import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Privacy() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Privacy Policy - VOW</title>
        <meta name="description" content="VOW Privacy Policy" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
        {/* Header */}
        <nav className="bg-white border-b border-amber-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <img src="/logo.svg" alt="VOW" className="h-10" />
              <div className="w-16"></div>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
            <h1 className="text-4xl font-light text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last Updated: October 14, 2025</p>

            <div className="prose prose-amber max-w-none space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">1. Introduction</h2>
                <p>
                  At VOW, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                  protect, and share your personal information when you use our Service. By using VOW, you 
                  consent to the practices described in this policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, password, gender, nationality, language preferences</li>
                  <li><strong>Profile Data:</strong> Optional information you choose to add to your profile</li>
                  <li><strong>Payment Information:</strong> Processed securely by Stripe (we do not store credit card details)</li>
                  <li><strong>User Content:</strong> Vows, reflections, journal entries, trigger logs, notes</li>
                  <li><strong>Communications:</strong> Messages, feedback, support requests</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">2.2 Automatically Collected Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Usage Data:</strong> Pages viewed, features used, time spent, interactions</li>
                  <li><strong>Device Information:</strong> Device type, operating system, browser type, IP address</li>
                  <li><strong>Log Data:</strong> Error logs, performance data, crash reports</li>
                  <li><strong>Cookies:</strong> Authentication tokens, preferences, analytics (see Cookie Policy below)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p>
                  We use your information to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Provide the Service:</strong> Create your account, store your vows and reflections, track progress</li>
                  <li><strong>Personalization:</strong> Customize your experience, provide relevant insights and reminders</li>
                  <li><strong>Communication:</strong> Send notifications, updates, newsletters (with your consent)</li>
                  <li><strong>Payment Processing:</strong> Process subscriptions and transactions via Stripe</li>
                  <li><strong>Service Improvement:</strong> Analyze usage patterns, fix bugs, develop new features</li>
                  <li><strong>Security:</strong> Detect fraud, prevent abuse, protect user accounts</li>
                  <li><strong>Legal Compliance:</strong> Comply with laws, respond to legal requests, enforce our Terms</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">4. How We Share Your Information</h2>
                <p className="font-medium text-amber-700 mb-4">
                  We do not sell your personal information. We only share data in limited circumstances:
                </p>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Service Providers</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Hosting:</strong> Vercel (application hosting)</li>
                  <li><strong>Database:</strong> Firebase/Firestore (data storage)</li>
                  <li><strong>Payment Processing:</strong> Stripe (subscription payments)</li>
                  <li><strong>Email:</strong> Email service providers for transactional emails</li>
                  <li><strong>Analytics:</strong> Anonymized usage analytics (if you consent)</li>
                </ul>
                <p className="mt-4 text-sm">
                  All service providers are contractually obligated to protect your data and use it only for providing services to us.
                </p>

                <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">4.2 Legal Requirements</h3>
                <p>
                  We may disclose information if required by law, legal process, or to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Comply with legal obligations</li>
                  <li>Protect our rights and property</li>
                  <li>Prevent fraud or security threats</li>
                  <li>Protect user safety</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">4.3 Business Transfers</h3>
                <p>
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred 
                  to the acquiring entity. We will notify you of any such change.
                </p>

                <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">4.4 With Your Consent</h3>
                <p>
                  We may share information with third parties when you explicitly consent (e.g., sharing progress with an accountability partner).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">5. Data Security</h2>
                <p>
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Encryption:</strong> All data transmitted via HTTPS/TLS encryption</li>
                  <li><strong>Password Security:</strong> Passwords are hashed using bcrypt</li>
                  <li><strong>Access Controls:</strong> Restricted access to personal data</li>
                  <li><strong>Regular Audits:</strong> Security reviews and vulnerability assessments</li>
                  <li><strong>Secure Infrastructure:</strong> Hosted on secure, compliant platforms</li>
                </ul>
                <p className="mt-4 text-sm text-gray-600">
                  While we take reasonable precautions, no system is 100% secure. You are responsible for maintaining 
                  the confidentiality of your account credentials.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">6. Data Retention</h2>
                <p>
                  We retain your information for as long as:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your account is active</li>
                  <li>Needed to provide the Service</li>
                  <li>Required by law (e.g., tax records, legal disputes)</li>
                  <li>Necessary for legitimate business purposes</li>
                </ul>
                <p className="mt-4">
                  You can request deletion of your account and data at any time through the Settings page. 
                  Some data may be retained in backups for up to 90 days.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">7. Your Rights and Choices</h2>
                <p>
                  Depending on your location, you may have the following rights:
                </p>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3 mt-4">7.1 Access and Portability</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Request a copy of your personal data</li>
                  <li>Export your data in machine-readable format (JSON)</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3 mt-4">7.2 Correction and Updates</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Update your profile information in Settings</li>
                  <li>Request correction of inaccurate data</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3 mt-4">7.3 Deletion</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Delete your account and personal data</li>
                  <li>Request erasure of specific information</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3 mt-4">7.4 Opt-Out Rights</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Unsubscribe from marketing emails (link in every email)</li>
                  <li>Disable push notifications in Settings</li>
                  <li>Opt out of analytics data sharing</li>
                  <li>Manage cookie preferences</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3 mt-4">7.5 Lodge a Complaint</h3>
                <p>
                  If you believe we have violated your privacy rights, you may file a complaint with us at 
                  <a href="mailto:privacy@vowapp.com" className="text-amber-600 hover:underline"> privacy@vowapp.com</a> or 
                  with your local data protection authority.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">8. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar technologies for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Authentication, security, basic functionality (required)</li>
                  <li><strong>Analytics Cookies:</strong> Usage statistics, performance monitoring (optional, with consent)</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
                <p className="mt-4">
                  You can control cookies through your browser settings. Disabling essential cookies may affect functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">9. Children's Privacy</h2>
                <p>
                  VOW is not intended for users under 18 years of age. We do not knowingly collect information from 
                  children. If we discover that a child has provided personal information, we will delete it immediately. 
                  If you believe a child has provided information to us, please contact us at 
                  <a href="mailto:privacy@vowapp.com" className="text-amber-600 hover:underline"> privacy@vowapp.com</a>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">10. International Data Transfers</h2>
                <p>
                  Your information may be transferred to and processed in countries other than your own. 
                  These countries may have different data protection laws. By using VOW, you consent to such transfers. 
                  We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">11. California Privacy Rights (CCPA)</h2>
                <p>
                  If you are a California resident, you have additional rights under the California Consumer Privacy Act:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Right to know what personal information is collected and how it's used</li>
                  <li>Right to delete personal information</li>
                  <li>Right to opt out of the sale of personal information (we do not sell data)</li>
                  <li>Right to non-discrimination for exercising your privacy rights</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, contact us at <a href="mailto:privacy@vowapp.com" className="text-amber-600 hover:underline">privacy@vowapp.com</a>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">12. European Privacy Rights (GDPR)</h2>
                <p>
                  If you are in the European Economic Area (EEA), you have rights under the General Data Protection Regulation:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Right of access to your personal data</li>
                  <li>Right to rectification of inaccurate data</li>
                  <li>Right to erasure ("right to be forgotten")</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                  <li>Right to withdraw consent</li>
                </ul>
                <p className="mt-4">
                  Our legal basis for processing includes: consent, contract performance, legal obligations, and legitimate interests.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">13. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of significant changes via:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email notification</li>
                  <li>In-app notification</li>
                  <li>Update to the "Last Updated" date at the top of this page</li>
                </ul>
                <p className="mt-4">
                  Continued use of the Service after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">14. Contact Us</h2>
                <p>
                  For questions, concerns, or requests regarding this Privacy Policy or your personal data:
                </p>
                <p className="mt-4">
                  <strong>Privacy Team</strong><br />
                  Email: <a href="mailto:privacy@vowapp.com" className="text-amber-600 hover:underline">privacy@vowapp.com</a><br />
                  Support: <a href="mailto:support@vowapp.com" className="text-amber-600 hover:underline">support@vowapp.com</a><br />
                  Website: <a href="https://vowapp.com" className="text-amber-600 hover:underline">https://vowapp.com</a>
                </p>
                <p className="mt-4 text-sm text-gray-600">
                  We will respond to your request within 30 days.
                </p>
              </section>

              <section className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-600">
                  By using VOW, you acknowledge that you have read, understood, and agree to this Privacy Policy.
                </p>
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-center space-x-6 text-sm text-gray-600">
              <button onClick={() => router.push('/')} className="hover:text-gray-900">Home</button>
              <button onClick={() => router.push('/privacy')} className="hover:text-gray-900">Privacy</button>
              <button onClick={() => router.push('/terms')} className="hover:text-gray-900">Terms</button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
