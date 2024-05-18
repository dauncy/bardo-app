import { Icons } from '../bardo/Icons'
import { TypographyParagraph } from '../bardo/typography/TypographyParagraph'

export const Loading = () => {
  return (
    <div className="flex w-full items-center justify-center gap-x-1.5">
      <div className="flex size-6 items-center justify-center rounded-md bg-gray-200 shadow">
        <Icons.Spinner className="text-back size-4 animate-spin fill-black stroke-violet-600" strokeWidth={2.5} />
      </div>
      <TypographyParagraph className="font-medium text-foreground/80" size={'extraSmall'}>
        {'Loading...'}
      </TypographyParagraph>
    </div>
  )
}
