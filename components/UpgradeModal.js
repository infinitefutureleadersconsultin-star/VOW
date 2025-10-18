import { X, Sparkles } from 'lucide-react';

export default function UpgradeModal({ tier, onClose, onUpgrade, loading }) {
  const tiers = {
    reflection: {
      name: 'Reflection',
      price: 9.99,
      priceId: 'price_monthly_9_99',
      title: "You've Unlocked the Path of Reflection",
      description: "Your consistency has opened a deeper level of clarity and peace.",
      features: [
        'AI-guided reflection prompts',
        'Advanced pattern analysis',
        'Voice journaling',
        'Priority support',
        'Everything in Initiation'
      ]
    },
    liberation: {
      name: 'Liberation',
      price: 14.99,
      priceId: 'price_monthly_14_99',
      title: "Your Journey of Liberation Awaits",
      description: "You've built strong foundations — now unlock full mastery of your vow.",
      features: [
        '1-on-1 mentor sessions',
        'Personalized healing roadmap',
        'Private community access',
        'Early feature access',
        'Everything in Reflection'
      ]
    }
  };

  const currentTier = tiers[tier];

  if (!currentTier) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-3xl p-8 max-w-lg w-full relative animate-fade-in border-2 border-[#E3C27D]/30">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8E8A84] hover:text-[#F4F1ED] transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E3C27D]/10 flex items-center justify-center">
            <Sparkles size={32} className="text-[#E3C27D]" />
          </div>
          <h2 className="text-3xl font-light text-[#F4F1ED] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            {currentTier.title}
          </h2>
          <p className="text-[#8E8A84]">{currentTier.description}</p>
        </div>

        {/* Price */}
        <div className="text-center mb-6 p-4 rounded-xl" style={{ background: 'rgba(227, 194, 125, 0.1)' }}>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-light text-[#E3C27D]" style={{ fontFamily: "'Playfair Display', serif" }}>
              ${currentTier.price}
            </span>
            <span className="text-xl text-[#8E8A84]">/month</span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {currentTier.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E3C27D]"></div>
              <span className="text-[#F4F1ED] text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => onUpgrade(currentTier)}
            disabled={loading}
            className="w-full btn-primary py-4 disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Ascend to ${currentTier.name}`}
          </button>
          <button
            onClick={onClose}
            className="w-full btn-secondary py-3"
          >
            Continue Current Path
          </button>
        </div>
      </div>
    </div>
  );
}
