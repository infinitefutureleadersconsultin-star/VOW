import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UnlockAnimation from '../components/UnlockAnimation';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Check if this is first launch
    const hasSeenAnimation = localStorage.getItem('vow_animation_seen');
    
    if (!hasSeenAnimation) {
      setShowAnimation(true);
    }

    // Analytics page view tracking
    const handleRouteChange = (url) => {
      console.log('[PAGE_VIEW]', {
        url,
        timestamp: new Date().toISOString(),
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router]);

  const handleAnimationComplete = () => {
    localStorage.setItem('vow_animation_seen', 'true');
    setShowAnimation(false);
  };

  if (showAnimation) {
    return <UnlockAnimation onComplete={handleAnimationComplete} />;
  }

  return <Component {...pageProps} />;
}
