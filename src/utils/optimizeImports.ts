// Optimize Framer Motion imports - only import what we need
export const motionConfig = {
  transition: { duration: 0.2, ease: "easeInOut" },
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

// Lazy load heavy animation libraries
export const loadFramerMotion = () => import('framer-motion');

// Optimize Antd imports
export const loadAntdComponent = (componentName: string) => {
  switch (componentName) {
    case 'Input':
      return import('antd/es/input');
    case 'Button':
      return import('antd/es/button');
    case 'Select':
      return import('antd/es/select');
    case 'Table':
      return import('antd/es/table');
    case 'Form':
      return import('antd/es/form');
    case 'Modal':
      return import('antd/es/modal');
    case 'DatePicker':
      return import('antd/es/date-picker');
    case 'Upload':
      return import('antd/es/upload');
    case 'Dropdown':
      return import('antd/es/dropdown');
    default:
      return import('antd');
  }
};

// Optimize Recharts imports
export const loadRechartsComponent = (componentName: string) => {
  switch (componentName) {
    case 'LineChart':
      return import('recharts').then(module => ({ default: module.LineChart }));
    case 'BarChart':
      return import('recharts').then(module => ({ default: module.BarChart }));
    case 'PieChart':
      return import('recharts').then(module => ({ default: module.PieChart }));
    default:
      return import('recharts');
  }
};

// Export utilities
export const exportUtilities = {
  // Lazy load jsPDF
  loadJsPDF: () => import('jspdf'),
  
  // Lazy load XLSX
  loadXLSX: () => import('xlsx'),
  
  // Lazy load QR Scanner
  loadQrScanner: () => import('html5-qrcode'),
  
  // Lazy load Lightbox
  loadLightbox: () => import('yet-another-react-lightbox')
};

// Performance helpers
export const performanceHelpers = {
  // Debounce function
  debounce: <T extends (...args: any[]) => any>(func: T, wait: number): T => {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  },
  
  // Throttle function
  throttle: <T extends (...args: any[]) => any>(func: T, limit: number): T => {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },
  
  // Optimize image loading
  preloadImage: (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }
};

// Bundle size analyzer
export const bundleAnalyzer = {
  measureBundleSize: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        transferSize: navigation.transferSize || 0
      };
    }
    return null;
  }
}; 