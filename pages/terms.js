/**
 * Terms of Service Page
 * Legal terms and conditions
 */

import { useRouter } from 'next/router';
import Head from 'next/head';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen corrective-bg">
      <Head>
        <title>Terms of Service - VOW Theory</title>
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
            <h1 className="text-lg font-medium text-[#F4F1ED]">Terms of Service</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-sm observation-text mb-8">
            Last Updated: October 19, 2025
          </p>

          <Section
            title="1. Acceptance of Terms"
            content={`By accessing and using VOW Theory ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service.`}
          />

          <Section
            title="2. Description of Service"
            content={`VOW Theory is a personal development and mental wellness platform that helps users create daily vows, track reflections, and support personal growth through the Law of Daily Remembrance™. The Service includes web and mobile applications, AI-powered insights, and educational content.`}
          />

          <Section
            title="3. User Accounts"
            subsections={[
              {
                title: "Registration",
                content: "You must create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials."
              },
              {
                title: "Eligibility",
                content: "You must be at least 13 years old to use this Service. Users under 18 require parental consent."
              },
              {
                title: "Account Security",
                content: "You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use."
              }
            ]}
          />

          <Section
            title="4. User Content"
            subsections={[
              {
                title: "Your Content",
                content: "You retain all rights to the vows, reflections, and other content you create. By using the Service, you grant us a license to store, process, and display your content solely to provide the Service."
              },
              {
                title: "Privacy",
                content: "Your personal reflections and vows are private by default. We do not share your content with third parties except as outlined in our Privacy Policy."
              },
              {
                title: "Content Standards",
                content: "You agree not to post content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable."
              }
            ]}
          />

          <Section
            title="5. Intellectual Property"
            content={`All content, features, and functionality of the Service, including but not limited to text, graphics, logos, and software, are owned by VOW Theory and protected by copyright, trademark, and other intellectual property laws. The Law of Daily Remembrance™, The Pacification Paradox™, The Confrontational Model™, and The Integration Cycle™ are proprietary frameworks of VOW Theory.`}
          />

          <Section
            title="6. Subscription and Payments"
            subsections={[
              {
                title: "Free Trial",
                content: "We offer a free trial with limited features. No credit card is required for the trial."
              },
              {
                title: "Paid Plans",
                content: "Paid subscriptions provide access to premium features. Billing occurs monthly or annually based on your selection."
              },
              {
                title: "Refunds",
                content: "We offer a 30-day money-back guarantee on paid plans. Contact support to request a refund within 30 days of purchase."
              },
              {
                title: "Cancellation",
                content: "You may cancel your subscription at any time. You'll retain access until the end of your paid period."
              }
            ]}
          />

          <Section
            title="7. AI Features and Limitations"
            subsections={[
              {
                title: "AI Insights",
                content: "Our AI-powered features provide suggestions and insights based on your input. These are for informational purposes only and should not be considered professional advice."
              },
              {
                title: "Not Medical Advice",
                content: "VOW Theory is not a substitute for professional mental health care, therapy, or medical treatment. If you are experiencing a mental health crisis, please contact a qualified healthcare provider or emergency services."
              },
              {
                title: "Accuracy",
                content: "While we strive for accuracy, AI-generated content may contain errors or inaccuracies. Use your judgment when applying insights."
              }
            ]}
          />

          <Section
            title="8. Prohibited Uses"
            content={`You agree not to:
- Use the Service for any illegal purpose
- Attempt to gain unauthorized access to the Service
- Interfere with or disrupt the Service
- Use automated systems to access the Service without permission
- Reverse engineer or attempt to extract source code
- Resell or redistribute the Service
- Impersonate another person or entity`}
          />

          <Section
            title="9. Disclaimer of Warranties"
            content={`The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free.`}
          />

          <Section
            title="10. Limitation of Liability"
            content={`To the maximum extent permitted by law, VOW Theory shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Service.`}
          />

          <Section
            title="11. Indemnification"
            content={`You agree to indemnify and hold harmless VOW Theory and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from your use of the Service or violation of these Terms.`}
          />

          <Section
            title="12. Modifications to Terms"
            content={`We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through the Service. Your continued use of the Service after changes constitutes acceptance of the modified Terms.`}
          />

          <Section
            title="13. Termination"
            content={`We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.`}
          />

          <Section
            title="14. Governing Law"
            content={`These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.`}
          />

          <Section
            title="15. Dispute Resolution"
            content={`Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration, except that either party may seek injunctive relief in court to protect intellectual property rights.`}
          />

          <Section
            title="16. Contact Information"
            content={`If you have any questions about these Terms, please contact us at:

Email: legal@vowtheory.com
Address: VOW Theory Legal Department

For support inquiries, visit support.vowtheory.com`}
          />

          <div className="mt-12 p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, #C6A66420 0%, #5FD3A540 100%)' }}>
            <p className="text-sm observation-text">
              By using VOW Theory, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
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
