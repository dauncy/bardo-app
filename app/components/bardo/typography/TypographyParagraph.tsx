import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@app/utils/ui.utils'

const paragraphVariants = cva('text-black', {
  variants: {
    size: {
      default: 'text-base leading-normal font-regular',
      small: 'text-sm leading-tight fonr-regular',
      extraSmall: 'text-xs leading-tight font-medium',
      medium: 'font-medium text-base leading-normal',
      large: 'text-lg font-medium leading-relaxed'
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export interface TypographyParagraphProps
  extends HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {}

const TypographyParagraph = ({ className, size, ...props }: TypographyParagraphProps ) => (
  <p className={cn(paragraphVariants({ size, className }))} {...props} />
)

TypographyParagraph.displayName = 'TypographyParagraph'

export { TypographyParagraph }
