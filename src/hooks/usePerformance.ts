import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
// Stable callback that doesn't change on re-renders
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(
    ((...args: any[]) => callbackRef.current(...args)) as T,
    []
  );
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
  });

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    
    if (renderTime > 16) {
      console.warn(
        `${componentName} rendered ${renderCount.current} times, last render took ${renderTime.toFixed(2)}ms`
      );
    }
    
    startTime.current = performance.now();
  });

  return {
    renderCount: renderCount.current,
  };
}; 