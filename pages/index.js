import { useState, useEffect } from 'react';
import { useTranslation } from '../lib/translations';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const { language, changeLanguage, t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <Head>
        <title>VOW - Remember Who You Said You'd Be</title>
        <meta name="description" content="{t("home.hero_subtitle")}" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Updated favicon references to use SVG */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/icon.svg" />
        
        {/* Open Graph - updated to use SVG logo */}
        <meta property="og:title" content="VOW - Remember Who You Said You'd Be" />
        <meta property="og:description" content="Transform through daily remembrance. Not warfare, but awareness." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/icon.svg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VOW - Remember Who You Said You'd Be" />
        <meta name="twitter:description" content="Transform through daily remembrance." />
        <meta name="twitter:image" content="/icon.svg" />
      </Head>

      <div className={`min-h-screen bg-gradient-to-b from-white to-amber-50 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-b border-amber-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                {/* Updated to use SVG logo */}
                <img 
                  src="/logo.svg" 
                  alt="VOW" 
                  className="h-10"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button 
                    onClick={() => setLangDropdown(!langDropdown)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors border border-gray-300 rounded-lg"
                  >
                    <span>{language === 'en' ? '🇬🇧 EN' : language === 'es' ? '🇪🇸 ES' : language === 'hi' ? '🇮🇳 HI' : language === 'zh' ? '🇨🇳 ZH' : '🇫🇷 FR'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {langDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl border border-gray-300 py-2 z-50">
                      <button onClick={() => { changeLanguage('en'); setLangDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-amber-50">🇬🇧 English</button>
                      <button onClick={() => { changeLanguage('es'); setLangDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-amber-50">🇪🇸 Español</button>
                      <button onClick={() => { changeLanguage('hi'); setLangDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-amber-50">🇮🇳 हिन्दी</button>
                      <button onClick={() => { changeLanguage('zh'); setLangDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-amber-50">🇨🇳 中文</button>
                      <button onClick={() => { changeLanguage('fr'); setLangDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-amber-50">🇫🇷 Français</button>
                    </div>
                  )}
                </div>

                <Link href="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                  Log In
                </Link>
                <Link href="/signup" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105">
                  Start Your Journey
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Added logo in hero section */}
            <img 
              src="/logo.svg" 
              alt="VOW Logo" 
              className="h-16 mx-auto mb-8"
            />
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-gray-900 mb-8 tracking-tight">
              {t("home.hero_title").split(" ").slice(0, 3).join(" ")}<br />{t("home.hero_title").split(" ").slice(3).join(" ")}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 font-light leading-relaxed">
              Healing is not warfare. It is the restoration of identity through<br />
              daily, conscious remembrance of your personal vow.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link href="/signup" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all transform hover:scale-105 shadow-lg">
                Begin Your First Two Days
              </Link>
              <button className="border-2 border-gray-300 hover:border-amber-600 text-gray-700 hover:text-amber-700 px-8 py-4 rounded-full text-lg font-medium transition-all">
                Learn More
              </button>
            </div>
            <p className="text-sm text-gray-500">
              2-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-4">The Law of Daily Remembrance</h2>
              <p className="text-xl text-gray-600 font-light">Created by Issiah Deon McLean</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Not Combat</h3>
                <p className="text-gray-600 leading-relaxed">
                  We don't fight urges. We observe them. Awareness, not resistance, transforms behavior.
                </p>
              </div>
              
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl">🪞</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Daily Mirror</h3>
                <p className="text-gray-600 leading-relaxed">
                  See who you were. Remember who you're becoming. The vow is your constant reflection.
                </p>
              </div>
              
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Identity Shift</h3>
                <p className="text-gray-600 leading-relaxed">
                  Through remembrance, the vow becomes you. Not something you keep, but who you are.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-light text-gray-900 mb-16 text-center">Your Journey of Becoming</h2>
            
            <div className="space-y-12">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center font-medium">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">Create Your Vow</h3>
                  <p className="text-gray-600 leading-relaxed">
                    "I am the type of person that ___, therefore I will (never/always) ___ again."
                    Record it in your own voice. Make it sacred.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center font-medium">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">Daily Remembrance</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Each day, hear your vow. Reflect on moments of strength and awareness.
                    Log urges without judgment. Build your identity map.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center font-medium">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">Conscious Awareness</h3>
                  <p className="text-gray-600 leading-relaxed">
                    AI patterns detect when urges arise. Gentle reminders arrive before temptation.
                    Not to control you, but to remind you who you are.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center font-medium">
                  4
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">Become Your Vow</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Track alignment. Watch your identity shift. The vow stops being effort.
                    It becomes who you are. Permanent. Natural. You.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trial Psychology Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-light text-gray-900 mb-8">The First Two Days of Becoming</h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              This is not a trial. This is the beginning of your transformation.
              Most people stop at Day 2 — not because they fail, but because they forget.
            </p>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 mb-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                "You've completed the first 48 hours of your vow. Most people quit here.
                Will you cross into Day 3, where remembrance becomes identity?"
              </p>
              <p className="text-sm text-amber-700 font-medium">
                — The moment before continuation
              </p>
            </div>
            <Link href="/signup" className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all transform hover:scale-105 shadow-lg">
              Start Your First Two Days Free
            </Link>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-light text-gray-900 mb-4 text-center">Begin Your Vow</h2>
            <p className="text-xl text-gray-600 mb-16 text-center">Your daily act of unlocking</p>
            
            <div className="max-w-lg mx-auto">
              <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-xl p-8 border-2 border-amber-600">
                <div className="text-center mb-6">
                  <p className="text-sm text-amber-600 font-medium mb-4">Initiation</p>
                  <div className="mb-4">
                    <p className="text-6xl font-light text-gray-900 mb-2">$0.16</p>
                    <p className="text-xl text-gray-600">per day</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 inline-block">
                    <p className="text-sm text-gray-600">Billed monthly at <span className="font-semibold text-gray-900">$4.99</span></p>
                    <p className="text-xs text-gray-500 mt-1">4-week minimum commitment</p>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-3 text-lg">✓</span>
                    <span className="text-gray-700">Create unlimited vows</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-3 text-lg">✓</span>
                    <span className="text-gray-700">Daily reflection journaling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-3 text-lg">✓</span>
                    <span className="text-gray-700">Track patterns & triggers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-3 text-lg">✓</span>
                    <span className="text-gray-700">Monitor your progress</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-3 text-lg">✓</span>
                    <span className="text-gray-700">Access on all devices</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-3 text-lg">✓</span>
                    <span className="text-gray-700">2-day free trial included</span>
                  </li>
                </ul>

                <button
                  onClick={() => router.push('/signup')}
                  className="w-full bg-amber-600 text-white py-4 px-8 rounded-xl font-medium text-lg hover:bg-amber-700 transition-colors shadow-lg"
                >
                  Begin My Journey
                </button>

                <div className="mt-6 space-y-2 text-center">
                  <p className="text-xs text-gray-600">✓ Cancel anytime after 4 weeks</p>
                  <p className="text-xs text-gray-600">✓ Secure payment via Stripe</p>
                  <p className="text-xs text-gray-600">✓ No credit card for free trial</p>
                </div>
              </div>

              <div className="text-center mt-8 p-6 bg-amber-50 rounded-xl">
                <p className="text-sm text-gray-600 italic">
                  As you progress on your journey, deeper paths will reveal themselves.
                </p>
              </div>
            </div>
            
            <p className="text-center text-gray-600 mt-8">
              All plans include a 2-day free trial. No credit card required to start.
            </p>
            <p className="text-center text-gray-600 mt-8">
              All plans include a 2-day free trial. No credit card required to start.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                {/* Updated footer logo to SVG */}
                <img 
                  src="/logo-dark.svg" 
                  alt="VOW" 
                  className="h-10 mb-4"
                />
                <p className="text-gray-400 text-sm">
                  Remember who you said you'd be.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Theory</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2025 VOW. Created by Issiah Deon McLean. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
