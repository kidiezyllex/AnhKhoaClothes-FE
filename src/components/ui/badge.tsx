import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex !text-white items-center rounded-full border !px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent !bg-primary -foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent !bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent !bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "!text-white !bg-amber-500",
        success: "!bg-green-50 !border-green-300 !text-green-600",
        warning: "!bg-amber-50 !border-amber-300 !text-amber-600",
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
