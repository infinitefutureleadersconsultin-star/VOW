import Head from 'next/head';
import Link from 'next/link';

export default function LearnNeuroscience() {
  return (
    <>
      <Head><title>The Neuroscience - VOW Theory</title></Head>
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/learn" className="text-amber-600 hover:text-amber-700 mb-6 inline-block">← Back to Learn</Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🧠 The Neuroscience Behind VOW Theory™</h1>
          <p className="text-xl text-gray-700 mb-8">How identity reconsolidation happens at a neural level</p>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 border-l-4 border-amber-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Identity Reconsolidation</h2>
            <p className="text-gray-800 mb-4">The VOW Theory™ induces <strong>identity reconsolidation</strong> through metacognitive self-observation and daily activation of autobiographical self-memory.</p>
            <p className="text-gray-800">By repeatedly recalling and emotionally re-experiencing the pre-wound self, your neural networks rebalance, re-establishing authentic identity patterns that had been hijacked by trauma-linked behavioral conditioning.</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🔍 Metacognitive Self-Observation</h3>
              <p className="text-gray-800 mb-2">When you observe a behavior rather than become it, you activate executive control systems that enable reflection and regulation.</p>
              <p className="text-gray-700 italic">This shifts you from automatic reaction to conscious awareness.</p>
            </div>

            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🔄 The Daily Law of Remembrance</h3>
              <p className="text-gray-800 mb-2">Daily vowing creates neuroplastic reconsolidation. Revisiting your before-and-beyond self creates new neural associations, weakening old trauma-linked self-narratives.</p>
              <p className="text-gray-700 italic">Repetition = reconsolidation. Each day trains your authentic identity.</p>
            </div>

            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🧬 Identity Pattern Restoration</h3>
              <p className="text-gray-800 mb-2">By recalling pre-trauma states and pairing them with present self-awareness, your brain re-establishes connections between emotional safety and self-concept.</p>
              <p className="text-gray-700 italic">This process overwrites maladaptive beliefs with authentic identity.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-white mb-8">
            <h2 className="text-2xl font-bold mb-4">Why VOW Theory™ Is Different</h2>
            <ul className="space-y-3">
              <li>✓ <strong>Re-roots the self</strong> instead of reframing thoughts</li>
              <li>✓ <strong>Reclaims identity</strong> instead of accepting emotion</li>
              <li>✓ <strong>Re-integrates the pre-cause self</strong> instead of analyzing past causes</li>
            </ul>
            <p className="mt-4 text-amber-100">VOW Theory™ treats trauma not as emotional residue, but as a displacement of identity memory.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Three Refinements</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-amber-600 mb-2">1. Symbolic Self Reconstruction</h3>
                <p className="text-gray-800">If you cannot recall your pre-wound self, you can build a symbolic self through values, moments of peace, and the essence you want to embody.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-amber-600 mb-2">2. Essence Recognition</h3>
                <p className="text-gray-800">Focus on the felt essence (peace, curiosity, safety) rather than literal memory recall. The feeling matters more than the event.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-amber-600 mb-2">3. Daily Training</h3>
                <p className="text-gray-800">The Law of Daily Remembrance is neural training. Daily metacognitive exposure consolidates new identity wiring through repetition.</p>
              </div>
            </div>
          </div>

          <Link href="/learn" className="mt-8 inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700">Back to All Lessons</Link>
        </div>
      </div>
    </>
  );
}
