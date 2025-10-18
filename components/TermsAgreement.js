import { useState } from 'react';
import { CheckCircle, Circle, FileText } from 'lucide-react';

export default function TermsAgreement({ onAcceptanceChange, initialAccepted = false }) {
  const [accepted, setAccepted] = useState(initialAccepted);
  const [showTerms, setShowTerms] = useState(false);

  const handleToggle = () => {
    const newValue = !accepted;
    setAccepted(newValue);
    onAcceptanceChange(newValue);
  };

  return (
    <div className="space-y-4">
      {/* Agreement Checkbox */}
      <div 
        onClick={handleToggle}
        className="flex items-start space-x-3 cursor-pointer p-4 rounded-xl glass-card hover:border-[#E3C27D]/30 transition-all"
      >
        <div className="mt-0.5">
          {accepted ? (
            <CheckCircle size={24} className="text-[#93B89A]" strokeWidth={2} />
          ) : (
            <Circle size={24} className="text-[#8E8A84]" strokeWidth={2} />
          )}
        </div>
        <div className="flex-1">
          <p className="text-[#F4F1ED] text-sm leading-relaxed">
            I agree to the{' '}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTerms(!showTerms);
              }}
              className="text-[#E3C27D] hover:underline"
            >
              Terms of Service
            </button>{' '}
            and understand this is a <strong className="text-[#E3C27D]">4-week minimum commitment</strong> billed monthly at $4.99 ($0.16/day).
          </p>
        </div>
      </div>

      {/* Expandable Terms */}
      {showTerms && (
        <div className="glass-card rounded-xl p-6 animate-fade-in space-y-4 max-h-96 overflow-y-auto">
          <div className="flex items-center space-x-2 mb-4">
            <FileText size={24} className="text-[#E3C27D]" />
            <h3 className="text-lg font-medium text-[#F4F1ED]">Terms of Service</h3>
          </div>

          <div className="space-y-4 text-sm text-[#C8C4BE] leading-relaxed">
            <section>
              <h4 className="font-medium text-[#F4F1ED] mb-2">1. Subscription Terms</h4>
              <p>
                By subscribing to VOW, you agree to a monthly recurring subscription billed at $4.99 per month (equivalent to $0.16 per day). This subscription includes a <strong className="text-[#E3C27D]">minimum 4-week commitment period</strong>.
              </p>
            </section>

            <section>
              <h4 className="font-medium text-[#F4F1ED] mb-2">2. Billing & Payment</h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Your subscription will automatically renew each month unless cancelled.</li>
                <li>Payment is processed securely through Stripe.</li>
                <li>You will be charged $4.99 at the start of each billing cycle.</li>
                <li>All payments are non-refundable during the 4-week minimum commitment period.</li>
              </ul>
            </section>

            <section>
              <h4 className="font-medium text-[#F4F1ED] mb-2">3. Cancellation Policy</h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>You may cancel your subscription at any time after the 4-week minimum commitment.</li>
                <li>Cancellations take effect at the end of your current billing cycle.</li>
                <li>You will retain access to all features until your subscription period ends.</li>
                <li>No refunds will be issued for partial months or the minimum commitment period.</li>
              </ul>
            </section>

            <section>
              <h4 className="font-medium text-[#F4F1ED] mb-2">4. Chargebacks & Disputes</h4>
              <p>
                By accepting these terms, you acknowledge that:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Initiating a chargeback without first contacting support may result in immediate account suspension.</li>
                <li>You agree to resolve billing disputes through our support team before filing chargebacks.</li>
                <li>Fraudulent chargebacks may result in permanent account termination and legal action.</li>
              </ul>
            </section>

            <section>
              <h4 className="font-medium text-[#F4F1ED] mb-2">5. Free Trial</h4>
              <p>
                If applicable, your subscription includes a 2-day free trial. The trial period does not count toward the 4-week minimum commitment. You may cancel during the trial without charge.
              </p>
            </section>

            <section>
              <h4 className="font-medium text-[#F4F1ED] mb-2">6. Changes to Terms</h4>
              <p>
                VOW reserves the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="pt-4 border-t" style={{ borderColor: 'rgba(244, 241, 237, 0.1)' }}>
              <p className="text-[#8E8A84] text-xs">
                Last updated: October 17, 2025
              </p>
            </section>
          </div>

          <button
            type="button"
            onClick={() => setShowTerms(false)}
            className="w-full btn-secondary mt-4"
          >
            Close Terms
          </button>
        </div>
      )}
    </div>
  );
}
