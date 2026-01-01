const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
// Initialize Stripe with a placeholder or env config. 
// In production, set this via: firebase functions:config:set stripe.secret="sk_..."
const stripe = require('stripe')(functions.config().stripe?.secret || 'sk_test_placeholder');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));

// Routes
const v1Router = express.Router();

// Support: Report Issue
v1Router.post('/support/report-issue', async (req, res) => {
  try {
    const { userId, email, description, severity, page } = req.body;
    
    const report = {
      userId: userId || 'anonymous',
      email: email || 'anonymous',
      description,
      severity: severity || 'medium',
      page: page || 'unknown',
      status: 'new',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('reports').add(report);
    
    res.status(200).json({ success: true, message: 'Report submitted' });
  } catch (error) {
    console.error('Error reporting issue:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// Payment: Create Portal Session (For managing/cancelling subscription)
v1Router.post('/payment/create-portal-session', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    // Get customer ID from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    if (!userData || !userData.stripeCustomerId) {
      return res.status(404).json({ error: 'User or customer not found. You may not have an active subscription.' });
    }

    // Create a portal session
    // This allows the user to update payment methods and CANCEL their subscription
    const session = await stripe.billingPortal.sessions.create({
      customer: userData.stripeCustomerId,
      return_url: req.headers.origin || 'http://localhost:3000',
    });

    res.json({ portalUrl: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Payment: Create Checkout Session
v1Router.post('/payment/create-checkout', async (req, res) => {
  try {
    const { userId, planId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    // Get or create customer
    let customerId;
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists && userDoc.data().stripeCustomerId) {
      customerId = userDoc.data().stripeCustomerId;
    } else {
      // Create new customer in Stripe
      const authUser = await admin.auth().getUser(userId);
      const customer = await stripe.customers.create({
        email: authUser.email,
        metadata: { userId }
      });
      customerId = customer.id;
      await userRef.set({ stripeCustomerId: customerId }, { merge: true });
    }

    // Map planId to Stripe Price ID (You would normally fetch this from config or DB)
    // Placeholder price IDs - REPLACE THESE WITH ACTUAL STRIPE PRICE IDs
    const priceIds = {
        'monthly': 'price_monthly_placeholder',
        'yearly': 'price_yearly_placeholder',
        'three_months': 'price_3months_placeholder'
    };
    
    const priceId = priceIds[planId] || priceIds['monthly'];

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/luna-plus?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/luna-plus?payment=cancelled`,
      metadata: { userId }
    });

    res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Payment: Subscription Status
v1Router.get('/payment/subscription-status', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const userDoc = await db.collection('users').doc(userId).get();
    const isSubscribed = userDoc.exists && userDoc.data().isSubscribed === true;
    
    res.json({ isSubscribed });
  } catch (error) {
    console.error('Error checking subscription:', error);
    res.status(500).json({ error: 'Failed to check status' });
  }
});

// Chat: Send Message
v1Router.post('/chat', async (req, res) => {
  try {
    const { message, persona, userId } = req.body;
    
    // Placeholder response logic
    // In a real app, you would call OpenAI or another AI service here
    const reply = `I received your message: "${message}". I am ${persona || 'Luna'}. (Backend is working!)`;

    // Save message to Firestore history (optional)
    if (userId) {
      await db.collection('chats').add({
        userId,
        persona: persona || 'Luna',
        message,
        reply,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    res.json({ reply });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Chat processing failed' });
  }
});

// Chat: Get History
v1Router.get('/chat/history', async (req, res) => {
  try {
    const { userId, persona } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const snapshot = await db.collection('chats')
      .where('userId', '==', userId)
      .where('persona', '==', persona || 'Luna')
      .orderBy('createdAt', 'asc')
      .limit(50)
      .get();

    const messages = snapshot.docs.map(doc => doc.data());
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Mount the router
app.use('/v1', v1Router);

exports.api = functions.https.onRequest(app);

// Stripe Webhook (Optional but recommended for syncing status)
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = functions.config().stripe?.webhook_secret;

    let event;

    try {
        if (endpointSecret) {
            event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
        } else {
            event = req.body; // For testing without signature verification
        }
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        // Find user by customerId and update status
        const usersSnapshot = await db.collection('users').where('stripeCustomerId', '==', customerId).limit(1).get();
        if (!usersSnapshot.empty) {
            const userRef = usersSnapshot.docs[0].ref;
            const status = subscription.status;
            const isSubscribed = status === 'active' || status === 'trialing';
            await userRef.update({ isSubscribed, subscriptionStatus: status });
        }
    }

    res.json({received: true});
});
