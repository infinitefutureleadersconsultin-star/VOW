/**
 * Privacy Policy Page
 * Data privacy and user information handling
 */

import { useRouter } from 'next/router';
import Head from 'next/head';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen corrective-bg">
      <Head>
        <title>Privacy Policy - VOW Theory</title>
      </Head>

      {/* Header */}
      <nav className="corrective-bg border-b border-[#E3C27D]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/')}
              className="text-[#8E8A84] hover:text-[#F4F1ED]"
            >
              ← Back
            </button>
            <h1 className="text-lg font-medium text-[#F4F1ED]">Privacy Policy</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-sm observation-text mb-8">
            Last Updated: October 19, 2025
          </p>

          <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100">
            <p className="font-medium awareness-text mb-2">
              Your Privacy Matters
            </p>
            <p className="text-sm observation-text">
              At VOW Theory, we take your privacy seriously. Your personal reflections, vows, and journey data are private and protected. We will never sell your personal information to third parties.
            </p>
          </div>

          <Section
            title="1. Information We Collect"
            subsections={[
              {
                title: "Account Information",
                content: `When you create an account, we collect:
- Email address
- Name (first and last)
- Password (encrypted)
- Profile preferences`
              },
              {
                title: "Content You Create",
                content: `We store the content you create to provide the Service:
- Vows and their details
- Daily reflections
- Trigger logs
- Notes and journal entries
- AI conversation history`
              },
              {
                title: "Usage Data",
                content: `We collect information about how you use the Service:
- Login dates and times
- Feature usage statistics
- Device information (type, OS, browser)
- IP address
- Streak and progress metrics`
              },
              {
                title: "Optional Information",
                content: `You may choose to provide:
- Profile photo
- Timezone
- Notification preferences
- Feedback and survey responses`
              }
            ]}
          />

          <Section
            title="2. How We Use Your Information"
            content={`We use your information to:

- Provide and improve the Service
- Personalize your experience
- Generate AI insights based on your reflections
- Send notifications and reminders (if enabled)
- Communicate service updates and changes
- Provide customer support
- Analyze usage patterns to improve features
- Ensure security and prevent fraud
- Comply with legal obligations

We do NOT use your personal reflections or vows for advertising purposes.`}
          />

          <Section
            title="3. Information Sharing and Disclosure"
            subsections={[
              {
                title: "We Do Not Sell Your Data",
                content: "We will never sell your personal information to third parties. Your journey is yours alone."
              },
              {
                title: "Service Providers",
                content: `We may share information with trusted service providers who help us operate the Service:
- Cloud hosting (Firebase/Google Cloud)
- AI processing (OpenAI)
- Payment processing (Stripe)
- Email services (SendGrid)
- Analytics (anonymized data only)

All providers are bound by confidentiality agreements.`
              },
              {
                title: "Legal Requirements",
                content: "We may disclose information if required by law, court order, or to protect our rights and safety."
              },
              {
                title: "Business Transfers",
                content: "If VOW Theory is acquired or merged, your information may be transferred. We will notify you of any such change."
              }
            ]}
          />

          <Section
            title="4. Data Security"
            content={`We implement industry-standard security measures:

- Encryption in transit (HTTPS/TLS)
- Encryption at rest for sensitive data
- Secure authentication (JWT tokens)
- Regular security audits
- Access controls and monitoring
- Secure backup systems

However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.`}
          />

          <Section
            title="5. Your Privacy Rights"
            subsections={[
              {
                title: "Access Your Data",
                content: "You can access all your data through your account dashboard or by requesting an export."
              },
              {
                title: "Correct Your Data",
                content: "You can update your account information and preferences at any time in Settings."
              },
              {
                title: "Delete Your Data",
                content: "You can delete your account and all associated data at any time. This action is permanent and cannot be undone."
              },
              {
                title: "Export Your Data",
                content: "You can export all your data in JSON, CSV, or text format at any time."
              },
              {
                title: "Opt-Out of Communications",
                content: "You can unsubscribe from marketing emails. Service-related emails cannot be disabled."
              },
              {
                title: "Restrict Processing",
                content: "You can request that we limit how we use your data in certain circumstances."
              }
            ]}
          />

          <Section
            title="6. Data Retention"
            content={`We retain your data for as long as your account is active or as needed to provide the Service. When you delete your account:

- Personal data is permanently deleted within 30 days
- Anonymized usage statistics may be retained
- Backups are purged within 90 days
- Legal or security data may be retained longer as required by law`}
          />

          <Section
            title="7. AI and Machine Learning"
            subsections={[
              {
                title: "How We Use AI",
                content: "We use AI (OpenAI) to provide personalized insights, pattern analysis, and guidance based on your reflections."
              },
              {
                title: "Data Processing",
                content: "Your content is sent to OpenAI's API for processing but is not used to train their models. OpenAI's data retention policy applies."
              },
              {
                title: "Opting Out",
                content: "You can disable AI features in Settings. This will limit some functionality but your data remains secure."
              }
            ]}
          />

          <Section
            title="8. Cookies and Tracking"
            content={`We use cookies and similar technologies:

- Essential cookies: Required for the Service to function
- Preference cookies: Remember your settings
- Analytics cookies: Understand how users interact with the Service (anonymized)

You can control cookies through your browser settings. Disabling cookies may limit functionality.`}
          />

          <Section
            title="9. Children's Privacy"
            content={`VOW Theory is not intended for children under 13. We do not knowingly collect information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.

Users aged 13-17 require parental consent to use the Service.`}
          />

          <Section
            title="10. International Users"
            content={`VOW Theory is based in the United States. By using the Service, you consent to the transfer of your information to the United States and other countries where we operate.

For users in the European Union, we comply with GDPR requirements and provide additional rights as outlined in this policy.`}
          />

          <Section
            title="11. California Privacy Rights (CCPA)"
            content={`California residents have additional rights:

- Right to know what personal information is collected
- Right to know if personal information is sold or disclosed
- Right to say no to the sale of personal information
- Right to access personal information
- Right to equal service and price

We do not sell personal information. To exercise your rights, contact privacy@vowtheory.com.`}
          />

          <Section
            title="12. Changes to This Policy"
            content={`We may update this Privacy Policy from time to time. We will notify you of significant changes via:

- Email notification
- In-app notification
- Notice on our website

Your continued use of the Service after changes constitutes acceptance of the updated policy.`}
          />

          <Section
            title="13. Contact Us"
            content={`For privacy-related questions or to exercise your rights:

Email: privacy@vowtheory.com
Data Protection Officer: dpo@vowtheory.com

For general support: support@vowtheory.com

Mailing Address:
VOW Theory Privacy Team
[Address will be added]

We will respond to your inquiry within 30 days.`}
          />

          <div className="mt-12 p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, #5FD3A520 0%, #5FD3A540 100%)' }}>
            <h3 className="font-bold awareness-text mb-2">Your Trust is Sacred</h3>
            <p className="text-sm observation-text">
              VOW Theory is built on the principle of remembrance and transformation. Your privacy is fundamental to that journey. We are committed to protecting your personal information and giving you control over your data.
            </p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/settings')}
              className="px-6 py-3 rounded-lg font-medium text-white"
              style={{ backgroundColor: '#C6A664' }}
            >
              Manage Privacy Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, content, subsections }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold awareness-text mb-4">{title}</h2>
      
      {content && (
        <p className="observation-text mb-4 whitespace-pre-line">{content}</p>
      )}
      
      {subsections && (
        <div className="space-y-4">
          {subsections.map((sub, i) => (
            <div key={i}>
              <h3 className="text-lg font-medium awareness-text mb-2">{sub.title}</h3>
              <p className="observation-text whitespace-pre-line">{sub.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
