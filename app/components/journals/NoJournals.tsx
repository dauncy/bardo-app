import { Icons } from '../bardo/Icons'
import { TypographyParagraph } from '../bardo/typography/TypographyParagraph'

export const NoJournals = () => {
  return (
    <div className="flex w-full flex-col gap-y-3 rounded-xl border bg-white p-4 shadow md:items-center">
      <TypographyParagraph size={'large'}>{'No Journals'}</TypographyParagraph>
      <div className="flex h-48 w-full items-center justify-center rounded-md bg-muted">
        <Icons.Bird className="size-full text-violet-500" strokeWidth={1} />
      </div>
      <TypographyParagraph>
        {'We could not find any journals at this time. Please try again later.'}
      </TypographyParagraph>
    </div>
  )
}
