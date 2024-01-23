import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'

export default function NewJournalPage() {
  return (
    <div className="flex flex-col">
      <TypographyParagraph className="" size={'medium'}>
        {'New Journal Entry'}
      </TypographyParagraph>
      <TypographyParagraph className="text-muted-foreground">
        {'Fill in the fields below and click publish when you are done.'}
      </TypographyParagraph>
    </div>
  )
}
