import { useEffect } from 'react';
import Lenis from 'lenis';

export const useLenis = () => {
  useEffect(() => {
    // Initialize Lenis with optimized settings
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      autoResize: true,
      syncTouch: true,
    });

    // Make lenis available globally for other components
    window.lenis = lenis;

    // Optimized animation frame function
    const animate = (time) => {
      lenis.raf(time);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    // Add scroll event listener for debugging
    lenis.on('scroll', (e) => {
      // Uncomment for debugging
      // console.log('Lenis scroll:', e);
    });

    // Cleanup function
    return () => {
      lenis.destroy();
      if (window.lenis) {
        delete window.lenis;
      }
    };
  }, []);
};
