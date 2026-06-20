import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'btn-shine bg-gradient-to-b from-brand-500 to-brand-700 text-white shadow-3d-md hover:shadow-3d-lg hover:from-brand-400 hover:to-brand-600 hover:-translate-y-0.5',
        outline:
          'border border-border bg-card text-foreground shadow-elevated hover:border-brand/40 hover:bg-muted dark:shadow-elevated-dark',
        ghost: 'hover:bg-muted hover:text-foreground',
        secondary: 'bg-muted text-foreground shadow-elevated hover:bg-muted/80 dark:shadow-elevated-dark',
        destructive: 'bg-red-600 text-white shadow-3d-sm hover:bg-red-500',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 rounded-lg px-4 text-xs',
        lg: 'h-14 px-8 text-base rounded-2xl',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };