
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 bg-primary transition-all",
        indicatorClassName
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

// New ProgressCircle component
interface ProgressCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: "sm" | "md" | "lg";
  strokeWidth?: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ 
  value,
  size = "md",
  strokeWidth = 4,
  children,
  className,
  ...props
}) => {
  const sizeMap = {
    sm: 64,
    md: 100,
    lg: 160
  };
  
  const finalSize = sizeMap[size];
  const radius = (finalSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  return (
    <div 
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: finalSize, height: finalSize }}
      {...props}
    >
      <svg 
        width={finalSize} 
        height={finalSize} 
        viewBox={`0 0 ${finalSize} ${finalSize}`}
        className="rotate-[-90deg]"
      >
        <circle
          className="text-primary/20"
          cx={finalSize / 2}
          cy={finalSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="none"
        />
        <circle
          className="text-primary transition-all duration-300 ease-in-out"
          cx={finalSize / 2}
          cy={finalSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset
          }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export { Progress, ProgressCircle }
