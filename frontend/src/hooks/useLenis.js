import { useEffect } from 'react';

/**
 * Custom hook for Lenis smooth scrolling
 * This is a lightweight implementation that provides smooth scrolling behavior
 * without requiring the full Lenis library
 */
export const useLenis = () => {
  useEffect(() => {
    // Simple smooth scrolling polyfill
    const smoothScrollPolyfill = () => {
      // Check if smooth scrolling is already supported
      if ('scrollBehavior' in document.documentElement.style) {
        return;
      }

      // Add smooth scrolling behavior for browsers that don't support it
      const originalScrollTo = window.scrollTo;
      const originalScrollBy = window.scrollBy;

      const smoothScroll = (targetX, targetY, duration = 500) => {
        const startX = window.pageXOffset;
        const startY = window.pageYOffset;
        const distanceX = targetX - startX;
        const distanceY = targetY - startY;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function (ease-out)
          const easeOut = 1 - Math.pow(1 - progress, 3);
          
          const currentX = startX + (distanceX * easeOut);
          const currentY = startY + (distanceY * easeOut);
          
          originalScrollTo.call(window, currentX, currentY);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      };

      // Override scrollTo
      window.scrollTo = function(x, y) {
        if (typeof x === 'object') {
          const options = x;
          if (options.behavior === 'smooth') {
            smoothScroll(options.left || 0, options.top || 0);
            return;
          }
        }
        
        if (arguments.length === 2) {
          smoothScroll(x, y);
          return;
        }
        
        originalScrollTo.apply(window, arguments);
      };

      // Override scrollBy
      window.scrollBy = function(x, y) {
        if (typeof x === 'object') {
          const options = x;
          if (options.behavior === 'smooth') {
            const targetX = window.pageXOffset + (options.left || 0);
            const targetY = window.pageYOffset + (options.top || 0);
            smoothScroll(targetX, targetY);
            return;
          }
        }
        
        if (arguments.length === 2) {
          const targetX = window.pageXOffset + x;
          const targetY = window.pageYOffset + y;
          smoothScroll(targetX, targetY);
          return;
        }
        
        originalScrollBy.apply(window, arguments);
      };
    };

    // Initialize smooth scrolling
    smoothScrollPolyfill();

    // Add CSS for smooth scrolling
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }
      
      /* Custom scrollbar styling */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      // Remove custom styles on cleanup
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Return utility functions for smooth scrolling
  return {
    scrollTo: (target, options = {}) => {
      if (typeof target === 'string') {
        const element = document.querySelector(target);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: options.block || 'start',
            inline: options.inline || 'nearest'
          });
        }
      } else if (typeof target === 'number') {
        window.scrollTo({
          top: target,
          behavior: 'smooth'
        });
      }
    },
    
    scrollToTop: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
    
    scrollToElement: (selector, offset = 0) => {
      const element = document.querySelector(selector);
      if (element) {
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };
};
