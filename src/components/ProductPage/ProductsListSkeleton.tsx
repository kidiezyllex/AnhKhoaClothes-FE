import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductsListSkeletonProps {
  count: number;
}

export const ProductsListSkeleton = ({ count }: ProductsListSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(count)].map((_, index) => (
        <Card
          key={index}
          className="group overflow-hidden rounded-xl shadow-md h-full flex flex-col bg-white relative backdrop-blur-sm border-2 border-transparent"
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 rounded-lg z-10 pointer-events-none" />

          {/* Image Container */}
          <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-t-2xl overflow-hidden">
            <div className="aspect-square overflow-visible relative flex items-center justify-center">
              <div className="w-full h-full relative z-20 bg-white">
                <Skeleton className="h-full w-full" />
              </div>
            </div>

            {/* Badges Skeleton */}
            <div className="absolute top-2 left-2 flex flex-row flex-wrap gap-2 z-20">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-3 flex flex-col flex-grow bg-green-50 border-t border-gray-200 relative">
            {/* Brand */}
            <Skeleton className="h-4 w-24 rounded-md mb-1" />

            {/* Title */}
            <div className="space-y-2 mb-2">
              <Skeleton className="h-5 w-full rounded-md" />
              <Skeleton className="h-5 w-2/3 rounded-md" />
            </div>

            {/* Price */}
            <div className="flex justify-between items-baseline mb-2">
              <Skeleton className="h-7 w-32 rounded-lg" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>

            {/* Variants */}
            <div className="flex flex-col gap-1 items-start justify-start mt-2">
              {/* Colors */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-16" />
                <div className="flex gap-1">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              </div>
              {/* Sizes */}
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>

            {/* Decorative bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-b-2xl opacity-0"></div>
          </div>
        </Card>
      ))}
    </div>
  );
};
