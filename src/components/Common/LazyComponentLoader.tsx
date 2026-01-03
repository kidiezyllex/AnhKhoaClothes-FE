import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyComponentLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string;
}

const DefaultFallback = ({ minHeight = "200px" }: { minHeight?: string }) => (
  <div className="w-full space-y-4" style={{ minHeight }}>
    <Skeleton className="h-8 w-1/3" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  </div>
);

export const LazyComponentLoader: React.FC<LazyComponentLoaderProps> = ({ 
  children, 
  fallback,
  minHeight 
}) => {
  const loadingComponent = fallback || <DefaultFallback minHeight={minHeight} />;
  
  return (
    <Suspense fallback={loadingComponent}>
      {children}
    </Suspense>
  );
};

// Simple loading component for quick loads
export const SimpleLoader = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Loading component for heavy operations
export const HeavyLoader = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Đang tải thư viện...</p>
    </div>
  </div>
);

export default LazyComponentLoader; 