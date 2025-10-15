import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Terms() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Terms of Service - VOW</title>
        <meta name="description" content="VOW Terms of Service" />
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
            <h1 className="text-4xl font-light text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-sm text-gray-500 mb-8">Last Updated: October 14, 2025</p>

            <div className="prose prose-amber max-w-none space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using VOW ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
                  If you do not agree to these Terms, please do not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">2. Description of Service</h2>
                <p>
                  VOW is a personal development platform that helps individuals reclaim their identity through 
                  daily vows, reflections, and awareness practices. The Service includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Daily vow creation and tracking</li>
                  <li>Reflection journaling</li>
                  <li>Trigger logging and pattern recognition</li>
                  <li>Progress tracking and analytics</li>
                  <li>Educational resources and guidance</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">3. User Accounts</h2>
                <p>
                  To use certain features of the Service, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and complete information during registration</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Be at least 18 years of age or have parental consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">4. Subscription and Payment</h2>
                <p>
                  VOW offers both free trial and paid subscription plans:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Free Trial:</strong> 2-day trial access to explore the Service</li>
                  <li><strong>Paid Subscriptions:</strong> Monthly, Premium, and Executive plans with recurring billing</li>
                  <li>Payment is processed securely through Stripe</li>
                  <li>Subscriptions automatically renew unless cancelled</li>
                  <li>Cancellations take effect at the end of the billing period</li>
                  <li>Refunds are provided at our discretion within 14 days of purchase</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">5. User Content</h2>
                <p>
                  You retain ownership of all content you create on the Service (vows, reflections, journal entries). 
                  By using the Service, you grant us:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A license to store, process, and display your content to provide the Service</li>
                  <li>The right to use anonymized, aggregated data for service improvement</li>
                  <li>No right to share your personal content with third parties without consent</li>
                </ul>
                <p className="mt-4">
                  You agree not to post content that is:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Illegal, harmful, threatening, abusive, or harassing</li>
                  <li>Violating intellectual property or privacy rights</li>
                  <li>Contains malware, viruses, or harmful code</li>
                  <li>Spam or unsolicited promotional content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">6. Not Medical Advice</h2>
                <p className="font-medium text-amber-700">
                  IMPORTANT: VOW is a personal development tool and does NOT provide medical, psychological, 
                  or therapeutic advice. The Service is not a substitute for professional mental health care.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Always consult qualified professionals for mental health concerns</li>
                  <li>In emergencies, contact local emergency services immediately</li>
                  <li>The Service is designed for self-reflection, not crisis intervention</li>
                  <li>We are not responsible for outcomes based on use of the Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">7. Prohibited Uses</h2>
                <p>
                  You agree not to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the Service for illegal purposes</li>
                  <li>Impersonate others or misrepresent your identity</li>
                  <li>Attempt to access unauthorized areas of the Service</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Scrape, data mine, or extract data from the Service</li>
                  <li>Reverse engineer or copy any part of the Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">8. Intellectual Property</h2>
                <p>
                  All content, features, and functionality of the Service (excluding user content) are owned by 
                  VOW and protected by copyright, trademark, and other intellectual property laws. 
                  The VOW Theory™ framework is proprietary intellectual property.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">9. Privacy and Data Protection</h2>
                <p>
                  Your privacy is important to us. Please review our <a href="/privacy" className="text-amber-600 hover:underline">Privacy Policy</a> to 
                  understand how we collect, use, and protect your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">10. Termination</h2>
                <p>
                  We reserve the right to suspend or terminate your account at any time for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violation of these Terms</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Abuse or harassment of other users</li>
                  <li>Non-payment of subscription fees</li>
                </ul>
                <p className="mt-4">
                  You may terminate your account at any time through the Settings page. 
                  Upon termination, your access will cease, but some data may be retained as required by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">11. Disclaimers and Limitations of Liability</h2>
                <p className="font-medium">
                  THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>We do not guarantee uninterrupted or error-free service</li>
                  <li>We are not liable for any indirect, incidental, or consequential damages</li>
                  <li>Our total liability is limited to the amount you paid in the last 12 months</li>
                  <li>Some jurisdictions do not allow these limitations, so they may not apply to you</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">12. Indemnification</h2>
                <p>
                  You agree to indemnify and hold harmless VOW, its affiliates, and employees from any claims, 
                  damages, or expenses arising from your use of the Service or violation of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">13. Changes to Terms</h2>
                <p>
                  We may update these Terms at any time. Continued use of the Service after changes constitutes 
                  acceptance of the new Terms. We will notify users of significant changes via email or in-app notification.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">14. Governing Law</h2>
                <p>
                  These Terms are governed by the laws of the State of Delaware, United States, without regard to 
                  conflict of law principles. Any disputes shall be resolved in the courts of Delaware.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">15. Contact Information</h2>
                <p>
                  For questions about these Terms, please contact us at:
                </p>
                <p className="mt-2">
                  Email: <a href="mailto:support@vowapp.com" className="text-amber-600 hover:underline">support@vowapp.com</a><br />
                  Website: <a href="https://vowapp.com" className="text-amber-600 hover:underline">https://vowapp.com</a>
                </p>
              </section>

              <section className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-600">
                  By using VOW, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
