import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/_lib/utils';

const buttonVariants = cva(
  'si-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'si-button-primary bg-primary text-base font-semibold text-primary-foreground hover:opacity-90',
        destructive:
          'si-button-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'si-button-outline border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'si-button-secondary bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'si-button-ghost hover:bg-accent hover:text-accent-foreground',
        link: 'si-button-link text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'si-button-default h-10 px-4 py-2',
        sm: 'si-button-sm h-9 rounded-md px-3',
        lg: 'si-button-lg h-11 rounded-md px-8',
        icon: 'si-button-icon h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
