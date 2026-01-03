import React from 'react';

// Performance optimization utilities

// Web Vitals monitoring
export const measureWebVitals = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Measure First Contentful Paint (FCP)
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
      }
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input'] });
  }
};

// Resource hints for critical resources
export const addResourceHints = () => {
  const criticalFonts = [
    '/fonts/Roboto-Regular.woff2',
  ];

  const criticalImages = [
    '/images/logo.svg',
    '/images/background.jpg',
  ];

  // Preload critical fonts
  criticalFonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Preload critical images
  criticalImages.forEach(image => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = image;
    link.as = 'image';
    document.head.appendChild(link);
  });
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            }
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
};

// Optimize images with lazy loading and WebP support
export const optimizeImages = () => {
  // Add loading="lazy" to all images
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => {
    img.setAttribute('loading', 'lazy');
  });

  // WebP support detection
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  if (supportsWebP()) {
    document.documentElement.classList.add('webp-support');
  }
};

// Memory management
export const cleanupMemory = () => {
  // Clear unused caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('old-') || name.includes('temp-')) {
          caches.delete(name);
        }
      });
    });
  }

  // Clear old localStorage items
  const oldKeys = Object.keys(localStorage).filter(key => 
    key.includes('temp-') || key.includes('cache-')
  );
  oldKeys.forEach(key => localStorage.removeItem(key));
};

// Bundle analyzer for development
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    console.group('📊 Bundle Analysis');
    
    // Estimate chunk sizes
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src?.includes('assets/')) {
        fetch(src, { method: 'HEAD' })
          .then(response => {
            const size = response.headers.get('content-length');
          })
          .catch(() => {});
      }
    });
    
    console.groupEnd();
  }
};

// Performance budget monitoring
export const monitorPerformanceBudget = () => {
  const budgets = {
    FCP: 2000, // 2 seconds
    LCP: 2500, // 2.5 seconds
    FID: 100,  // 100ms
    CLS: 0.1   // 0.1
  };

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      let metric: string;
      let value: number;
      let budget: number;

      if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
        metric = 'FCP';
        value = entry.startTime;
        budget = budgets.FCP;
      } else if (entry.entryType === 'largest-contentful-paint') {
        metric = 'LCP';
        value = entry.startTime;
        budget = budgets.LCP;
      } else if (entry.entryType === 'first-input') {
        metric = 'FID';
        value = (entry as any).processingStart - entry.startTime;
        budget = budgets.FID;
      } else {
        continue;
      }

    }
  });

  observer.observe({ 
    entryTypes: ['paint', 'largest-contentful-paint', 'first-input'] 
  });
};

// Initialize all performance optimizations
export const initPerformanceOptimizations = () => {
  // Run immediately
  addResourceHints();
  optimizeImages();
  
  // Run after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      measureWebVitals();
      monitorPerformanceBudget();
      analyzeBundleSize();
    });
  } else {
    measureWebVitals();
    monitorPerformanceBudget();
    analyzeBundleSize();
  }
  
  // Run after page is fully loaded
  window.addEventListener('load', () => {
    registerServiceWorker();
    
    // Cleanup after 5 minutes
    setTimeout(cleanupMemory, 5 * 60 * 1000);
  });
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = React.useState<{
    fcp?: number;
    lcp?: number;
    fid?: number;
    cls?: number;
  }>({});

  React.useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
        } else if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
        } else if (entry.entryType === 'first-input') {
          const fid = (entry as any).processingStart - entry.startTime;
          setMetrics(prev => ({ ...prev, fid }));
        }
      }
    });

    observer.observe({ 
      entryTypes: ['paint', 'largest-contentful-paint', 'first-input'] 
    });

    return () => observer.disconnect();
  }, []);

  return metrics;
}; 