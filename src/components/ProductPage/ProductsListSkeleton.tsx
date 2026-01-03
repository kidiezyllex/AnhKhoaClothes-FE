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
          className="overflow-hidden border rounded-lg shadow-sm h-full flex flex-col bg-white"
        >
          {/* Image Skeleton */}
          <div className="aspect-square w-full bg-gray-50 relative">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Content Skeleton */}
          <div className="p-4 flex flex-col flex-grow bg-gray-100 border-t border-gray-100/50 space-y-3">
            {/* Brand */}
            <Skeleton className="h-4 w-24 rounded-full" />

            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full rounded-md" />
              <Skeleton className="h-5 w-2/3 rounded-md" />
            </div>

            {/* Price */}
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-7 w-32 rounded-lg" />
            </div>

            {/* Variants */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-12" />
                <div className="flex gap-1">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
