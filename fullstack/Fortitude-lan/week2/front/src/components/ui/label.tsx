/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2025-01-04 08:33:50
 * @LastEditors: Hesin
 * @LastEditTime: 2025-01-04 10:49:47
 */
// Label component extends from shadcnui - https://ui.shadcn.com/docs/components/label

"use client";
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium text-gray-50 dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
