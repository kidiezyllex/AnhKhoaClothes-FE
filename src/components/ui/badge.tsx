import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border-[2px] border-white/50 px-2 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap shadow-sm backdrop-blur-md text-white",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-slate-700 to-slate-900",
        secondary: "bg-gradient-to-r from-gray-400 to-gray-600",
        destructive: "bg-gradient-to-r from-red-600 to-rose-700",
        outline: "bg-gradient-to-r from-amber-400 to-orange-500",
        success: "bg-gradient-to-r from-emerald-500 to-teal-600",
        warning: "bg-gradient-to-r from-yellow-500 to-orange-500",
        promotion: "bg-gradient-to-r from-rose-500 to-pink-500",
        danger: "bg-gradient-to-r from-red-500 to-red-700",
        lowStock: "bg-gradient-to-r from-orange-400 to-red-500",
        new: "bg-gradient-to-r from-cyan-400 to-blue-500",
        bestSeller: "bg-gradient-to-r from-[#2C8B3D] to-[#88C140]",
        teal: "bg-gradient-to-r from-[#3F6844] to-[#3F6844]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
