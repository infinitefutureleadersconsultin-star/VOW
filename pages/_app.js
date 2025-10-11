import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NotificationToast from '../components/NotificationToast';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Register service worker for push notifications
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      // Don't request immediately, wait for user interaction
      const requestPermission = () => {
        Notification.requestPermission().then(permission => {
          console.log('Notification permission:', permission);
        });
        // Remove listener after first interaction
        document.removeEventListener('click', requestPermission);
      };
      
      document.addEventListener('click', requestPermission, { once: true });
    }

    // Log page views (for analytics)
    const handleRouteChange = (url) => {
      console.log('[PAGE_VIEW]', {
        url,
        timestamp: new Date().toISOString(),
      });
      
      // TODO: Send to analytics service
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Handle errors globally
  useEffect(() => {
    const handleError = (event) => {
      console.error('[GLOBAL_ERROR]', {
        message: event.error?.message,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
      });
      
      // Show user-friendly message
      window.dispatchEvent(new CustomEvent('vow-toast', {
        detail: {
          message: 'An unexpected error occurred. Please try again.',
          type: 'error',
          duration: 5000,
        },
      }));
    };

    const handleUnhandledRejection = (event) => {
      console.error('[UNHANDLED_REJECTION]', {
        reason: event.reason,
        timestamp: new Date().toISOString(),
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <NotificationToast />
    </>
  );
}
