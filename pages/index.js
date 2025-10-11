import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <Head>
        <title>VOW - Remember Who You Said You'd Be</title>
        <meta name="description" content="Transform through daily remembrance. Not warfare, but awareness. The Law of Daily Remembrance." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph */}
        <meta property="og:title" content="VOW - Remember Who You Said You'd Be" />
        <meta property="og:description" content="Transform through daily remembrance. Not warfare, but awareness." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VOW - Remember Who You Said You'd Be" />
        <meta name="twitter:description" content="Transform through daily remembrance." />
      </Head>

      <div className={`min-h-screen bg-gradient-to-b from-white to-amber-50 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-sm border-b border-amber-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-2xl font-light tracking-wider text-gray-900">VOW</span>
              </div>
              <div className="flex items-center space-x-4">
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
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-gray-900 mb-8 tracking-tight">
              Remember Who You<br />Said You'd Be
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
                  We don't fight urges. We observe them. Awareness, not r
