import { Popover, PopoverContent, PopoverTrigger } from '@app/components/bardo/Popover'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import type { ReactNode } from 'react'

interface PopoverTextProps {
  text: string
  children: ReactNode
}
export const PopoverText = ({ text, children }: PopoverTextProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="bg-violet-600 px-4 py-2 shadow-md">
        <TypographyParagraph className="select-none border-none text-white/90" size={'extraSmall'}>
          {text}
        </TypographyParagraph>
      </PopoverContent>
    </Popover>
  )
}
