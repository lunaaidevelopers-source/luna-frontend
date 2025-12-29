import React from 'react';

export default function Terms({ onBack }) {
  return (
    <div style={{
      backgroundColor: '#050505',
      minHeight: '100vh',
      padding: '24px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: 'white'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        {onBack && (
          <button 
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: '#A855F7',
              fontSize: '28px',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            ←
          </button>
        )}
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          Terms of Service
        </h1>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
        <p style={{ color: '#A1A1AA', marginBottom: '32px' }}>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            1. Acceptance of Terms
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            By accessing and using Luna AI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            2. Age Requirement
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            You must be at least 18 years old to use this Service. By using the Service, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into this agreement.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            3. Service Description
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            Luna AI is an AI companion service that provides conversational interactions through artificial intelligence. The Service offers both free and premium subscription tiers with varying features and message limits.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            4. User Accounts
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            5. Acceptable Use
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            You agree not to use the Service to:
          </p>
          <ul style={{ color: '#A1A1AA', marginLeft: '24px', marginBottom: '16px' }}>
            <li>Transmit any content that is illegal, harmful, or violates any laws</li>
            <li>Harass, abuse, or harm other users or individuals</li>
            <li>Attempt to reverse engineer or compromise the Service</li>
            <li>Use automated systems to access the Service without permission</li>
            <li>Share your account credentials with others</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            6. Subscription and Payments
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            Premium subscriptions are billed on a recurring basis. You may cancel your subscription at any time through your account settings. Refunds are subject to our refund policy. All fees are non-refundable unless otherwise stated.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            7. Intellectual Property
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            All content, features, and functionality of the Service are owned by Luna AI and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            8. Limitation of Liability
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            Luna AI is provided "as is" without warranties of any kind. We do not guarantee that the Service will be uninterrupted, error-free, or secure. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            9. Termination
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            We reserve the right to terminate or suspend your account and access to the Service at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            10. Changes to Terms
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            We reserve the right to modify these Terms at any time. We will notify users of any material changes. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            11. Contact Information
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            If you have any questions about these Terms, please contact us through the support channels provided in the Service.
          </p>
        </section>
      </div>
    </div>
  );
}

