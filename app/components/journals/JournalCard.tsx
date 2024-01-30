import type { SerializeFrom } from '@remix-run/node'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../bardo/Card'
import { TypographyParagraph } from '../bardo/typography/TypographyParagraph'
import { Separator } from '../bardo/Separator'
import type { Journal } from '@prisma/client'
import { Popover, PopoverContent, PopoverTrigger } from '../bardo/Popover'
import { Icons } from '../bardo/Icons'

const JournalCardMenu = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="absolute right-2 top-2 flex cursor-pointer items-center justify-center">
          <Icons.more className="size-6 text-violet-400" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="max-w-sm" side="left"></PopoverContent>
    </Popover>
  )
}

export const JournalCard = ({ journal }: { journal: SerializeFrom<Journal> }) => {
  return (
    <Card className="relative cursor-default px-8">
      <JournalCardMenu />
      <CardHeader className="flex flex-col gap-y-1 px-0 pb-0">
        <CardTitle>{journal.title}</CardTitle>
        <div className="flex w-full flex-wrap items-center gap-2">
          <div className="rounded-md bg-violet-600 px-4 py-1 font-medium text-sm text-white/90">
            {journal.metadata.modality}
          </div>

          <div className="rounded-md bg-[#92a7c5] px-4 py-1 font-medium text-sm text-white/90">
            {journal.metadata.dosage}
          </div>

          <div className="rounded-md bg-[#2dd4bf] px-4 py-1 font-medium text-sm text-white/90">
            {journal.metadata.intention}
          </div>

          <div className="rounded-md bg-[#f472b6] px-4 py-1 font-medium text-sm text-white/90">
            {journal.metadata.setting}
          </div>
        </div>

        <CardDescription>
          {`Last updated: `}
          <span className="font-medium text-black">
            {new Date(journal.updated_at).toLocaleDateString('en', { year: 'numeric', day: '2-digit', month: 'long' })}
          </span>
        </CardDescription>
      </CardHeader>
      <Separator className="my-6" />
      <CardContent className="flex flex-col gap-y-1 px-0">
        {journal.body.split('\n').map((p, i) => (
          <TypographyParagraph key={`$paragraph-${i}`}>{p}</TypographyParagraph>
        ))}
      </CardContent>

      <CardFooter />
    </Card>
  )
}
