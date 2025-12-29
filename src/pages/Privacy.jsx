import React from 'react';

export default function Privacy({ onBack }) {
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
          Privacy Policy
        </h1>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
        <p style={{ color: '#A1A1AA', marginBottom: '32px' }}>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            1. Introduction
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            Luna AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI companion service.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            2. Information We Collect
          </h2>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#D4D4D8' }}>
            2.1 Information You Provide
          </h3>
          <ul style={{ color: '#A1A1AA', marginLeft: '24px', marginBottom: '16px' }}>
            <li>Email address and password for account creation</li>
            <li>Messages and conversations with the AI companion</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Subscription preferences and settings</li>
          </ul>
          
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#D4D4D8' }}>
            2.2 Automatically Collected Information
          </h3>
          <ul style={{ color: '#A1A1AA', marginLeft: '24px', marginBottom: '16px' }}>
            <li>Device information and browser type</li>
            <li>IP address and location data</li>
            <li>Usage patterns and interaction data</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            3. How We Use Your Information
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            We use the information we collect to:
          </p>
          <ul style={{ color: '#A1A1AA', marginLeft: '24px', marginBottom: '16px' }}>
            <li>Provide, maintain, and improve our Service</li>
            <li>Process payments and manage subscriptions</li>
            <li>Personalize your experience with the AI companion</li>
            <li>Send you service-related communications</li>
            <li>Detect and prevent fraud or abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            4. Data Storage and Security
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            We use industry-standard security measures to protect your information, including encryption, secure servers, and access controls. Your data is stored securely using Firebase and Firestore. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            5. Data Sharing and Disclosure
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            We do not sell your personal information. We may share your information only in the following circumstances:
          </p>
          <ul style={{ color: '#A1A1AA', marginLeft: '24px', marginBottom: '16px' }}>
            <li>With service providers (e.g., Stripe for payments, Google for AI services) who assist in operating our Service</li>
            <li>When required by law or to protect our rights</li>
            <li>In connection with a business transfer or merger</li>
            <li>With your explicit consent</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            6. Your Rights (GDPR Compliance)
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            If you are located in the European Economic Area (EEA), you have certain data protection rights:
          </p>
          <ul style={{ color: '#A1A1AA', marginLeft: '24px', marginBottom: '16px' }}>
            <li><strong>Right to Access:</strong> Request copies of your personal data</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
            <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
            <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
            <li><strong>Right to Object:</strong> Object to processing of your data</li>
          </ul>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            To exercise these rights, please contact us through the support channels in the Service.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            7. Cookies and Tracking
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            We use cookies and similar technologies to enhance your experience, analyze usage, and assist in marketing efforts. You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            8. Third-Party Services
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            Our Service integrates with third-party services:
          </p>
          <ul style={{ color: '#A1A1AA', marginLeft: '24px', marginBottom: '16px' }}>
            <li><strong>Firebase:</strong> Authentication and data storage</li>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>Google Gemini:</strong> AI conversation processing</li>
          </ul>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            These services have their own privacy policies, and we encourage you to review them.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            9. Data Retention
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            We retain your personal information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy. When you delete your account, we will delete your personal data, except where we are required to retain it for legal purposes.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            10. Children's Privacy
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            Our Service is not intended for users under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            11. Changes to This Privacy Policy
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#E4E4E7' }}>
            12. Contact Us
          </h2>
          <p style={{ color: '#A1A1AA', marginBottom: '16px' }}>
            If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us through the support channels provided in the Service.
          </p>
        </section>
      </div>
    </div>
  );
}

