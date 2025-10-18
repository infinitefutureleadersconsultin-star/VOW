          {/* Step 3: Terms & Free Trial */}
          {step === 3 && (
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-light text-[#F4F1ED] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Begin Your Vow
                </h2>
                <p className="text-[#8E8A84]">Your daily act of unlocking</p>
              </div>

              {/* Terms Agreement - REQUIRED */}
              <TermsAgreement 
                onAcceptanceChange={setTermsAccepted}
                initialAccepted={termsAccepted}
              />

              {/* Free Trial with Pricing Display */}
              <div className={`p-6 rounded-xl border-2 transition-all ${
                termsAccepted 
                  ? 'border-[#E3C27D]/30 hover:border-[#E3C27D]' 
                  : 'border-[#252b3d] opacity-50'
              }`} style={{ background: 'rgba(227, 194, 125, 0.05)' }}>
                
                {/* Pricing Display */}
                <div className="text-center mb-6">
                  <p className="text-sm text-[#E3C27D] font-medium mb-4">Initiation</p>
                  <div className="mb-4">
                    <p className="text-5xl font-light text-[#F4F1ED]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      $0.16
                    </p>
                    <p className="text-lg text-[#8E8A84]">per day</p>
                  </div>
                  <div className="bg-[#1A1C1F] rounded-lg p-3 mb-4">
                    <p className="text-sm text-[#F4F1ED]">
                      Billed monthly at <span className="font-semibold text-[#E3C27D]">$4.99</span>
                    </p>
                    <p className="text-xs text-[#8E8A84] mt-1">4-week minimum commitment</p>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-[#E3C27D] mr-3 text-lg">✓</span>
                    <span className="text-[#F4F1ED]">Create unlimited vows</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#E3C27D] mr-3 text-lg">✓</span>
                    <span className="text-[#F4F1ED]">Daily reflection journaling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#E3C27D] mr-3 text-lg">✓</span>
                    <span className="text-[#F4F1ED]">Track patterns & triggers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#E3C27D] mr-3 text-lg">✓</span>
                    <span className="text-[#F4F1ED]">2-day free trial included</span>
                  </li>
                </ul>

                {/* Start Free Trial Button */}
                <button
                  onClick={handleStartFreeTrial}
                  disabled={loading || !termsAccepted}
                  className="w-full btn-primary py-4 text-lg disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Start Free Trial'}
                </button>

                {/* Trust Signals */}
                <div className="mt-4 space-y-2 text-center">
                  <p className="text-xs text-[#8E8A84]">✓ No credit card required for trial</p>
                  <p className="text-xs text-[#8E8A84]">✓ Cancel anytime after 4 weeks</p>
                  <p className="text-xs text-[#8E8A84]">✓ Secure payment via Stripe</p>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={loading}
                className="w-full btn-secondary mt-4"
              >
                Back
              </button>
            </div>
          )}
