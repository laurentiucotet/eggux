// EGG UI Input. Figma: Input (COMPONENTS / Input). Style (default, filled), Size (sm, default,
// lg), State (default, focus, error via aria-invalid, disabled, read-only). shadcn Input with the
// EGG changes from references/code-mapping.md: pill radius through --input-radius, density height.
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full min-w-0 rounded-input border bg-background px-3 py-1 text-base text-foreground shadow-xs outline-none transition-[color,box-shadow,border-color] duration-[var(--duration-fast)] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] aria-invalid:border-destructive read-only:enabled:bg-muted read-only:enabled:shadow-none read-only:enabled:focus-visible:shadow-none',
  {
    variants: {
      inputStyle: {
        default: 'border-input',
        filled: 'border-transparent bg-muted shadow-none placeholder:text-[var(--input-filled-muted-foreground)]',
      },
      size: {
        sm: 'h-8',
        default: 'h-[var(--control-height)]',
        lg: 'h-10 px-4 md:text-base',
      },
    },
    defaultVariants: { inputStyle: 'default', size: 'default' },
  },
);

export interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'>, VariantProps<typeof inputVariants> {}

function Input({ className, type, inputStyle, size, ...props }: InputProps) {
  return <input type={type} data-slot="input" className={cn(inputVariants({ inputStyle, size }), className)} {...props} />;
}

export { Input, inputVariants };
