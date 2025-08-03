
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-modern-blue-500 to-modern-blue-600 text-white hover:shadow-md hover:from-modern-blue-600 hover:to-modern-blue-700 transform hover:scale-[1.02]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 transform hover:scale-[1.02]",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground transform hover:scale-[1.02]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 transform hover:scale-[1.02]",
        ghost: "hover:bg-accent hover:text-accent-foreground transform hover:scale-[1.02]",
        link: "text-primary underline-offset-4 hover:underline",
        ats: "bg-gradient-to-r from-modern-blue-500 to-soft-purple text-white hover:shadow-md hover:from-modern-blue-600 hover:to-soft-purple transform hover:scale-[1.02]",
        glass: "bg-white/80 backdrop-blur-sm border border-white/20 text-modern-blue-700 hover:bg-white/90 hover:shadow-md transform hover:scale-[1.02]",
        gradient: "bg-gradient-to-r from-modern-blue-500 to-soft-purple text-white hover:shadow-md hover:from-modern-blue-600 hover:to-soft-purple transform hover:scale-[1.02]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
