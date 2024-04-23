/* eslint-disable react/jsx-pascal-case */
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@app/components/bardo/Card'
import type { User } from '@prisma/client'
import { UserAvatar } from '@app/components/users/UserAvatar'
import { JournalBody } from './JournalBody'
import { Popover, PopoverContent, PopoverTrigger } from '@app/components/bardo/Popover'
import { Icons } from '@app/components/bardo/Icons'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { Separator } from '@app/components/bardo/Separator'
import { Link, useOutletContext } from '@remix-run/react'
import type { SerializeFrom } from '@remix-run/node'
import { TripDosage, type JournalWithUser } from '@app/types/journals'
import type { LucideProps } from 'lucide-react'
import { PopoverText } from './PopoverText'

const JournalCardMenu = ({ journalId }: { journalId: string }) => {
  // const { currentUser } = useOutletContext<{ currentUser: User }>()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="absolute right-2 top-2 flex cursor-pointer items-center justify-center">
          <Icons.more className="size-6 text-slate-200 hover:text-violet-600" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="max-w-[224px] p-0" side="left">
        <Link
          to={`/journals/${journalId}`}
          className="group flex w-full cursor-pointer items-center gap-x-2 px-4 py-1.5 hover:bg-violet-200"
        >
          <Icons.NotebookPen className="size-4 text-muted-foreground group-hover:text-foreground" />
          <TypographyParagraph size={'small'} className="text-muted-foreground group-hover:text-foreground">
            {'Edit Journal'}
          </TypographyParagraph>
        </Link>
        <Separator />
      </PopoverContent>
    </Popover>
  )
}

const DosageToIcon: Record<string, (props: LucideProps) => JSX.Element> = {
  [TripDosage.MICRO]: (props: LucideProps) => <Icons.Micro {...props} />,
  [TripDosage.LOW]: (props: LucideProps) => <Icons.Low {...props} />,
  [TripDosage.HIGH]: (props: LucideProps) => <Icons.High {...props} />,
  [TripDosage.HEROIC]: (props: LucideProps) => <Icons.Heroic {...props} />,
  default: (props: LucideProps) => <Icons.HelpCircle {...props} />,
}

export const JournalCard = ({ journal }: { journal: SerializeFrom<JournalWithUser> }) => {
  const { currentUser } = useOutletContext<{ currentUser: User | null }>()
  return (
    <Card className="relative w-full cursor-default rounded-none px-0 shadow-none md:rounded-md md:shadow">
      {journal.user.id === currentUser?.id && <JournalCardMenu journalId={journal.id} />}
      <CardHeader className="flex flex-row gap-x-4 px-8 pb-0">
        <UserAvatar user={journal.user} />
        <div className="flex flex-col gap-y-2">
          <CardTitle>{journal.title}</CardTitle>
          <div className="flex w-full flex-col">
            <PopoverText text={'Which psychedelics were taken'}>
              <div className="flex cursor-pointer items-center gap-x-1.5">
                <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                  <Icons.Pill className="size-4 stroke-pink-500 text-slate-500" />
                </div>
                <TypographyParagraph size={'extraSmall'}>{'Modalities'}</TypographyParagraph>
              </div>
            </PopoverText>
            <div className="mt-2 flex flex-wrap items-center gap-4 pl-8">
              {journal.metadata?.modalities &&
                journal.metadata?.modalities?.map(m => {
                  const Icon = DosageToIcon[m?.dosage ?? 'default']
                  return (
                    <PopoverText key={m.modality} text={`${m.dosage?.toLowerCase() ?? 'Unknown '} dosage.`}>
                      <div className="flex cursor-pointer items-center gap-x-1.5">
                        <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                          <Icon className="size-4 text-blue-500" />
                        </div>
                        <TypographyParagraph size={'extraSmall'}>{m.modality}</TypographyParagraph>
                      </div>
                    </PopoverText>
                  )
                })}
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center gap-4">
            <PopoverText text={"User's main intention for the trip"}>
              <div className="flex cursor-pointer items-center gap-x-1.5">
                <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                  <Icons.Lightbulb className="size-4 text-yellow-500" />
                </div>

                <TypographyParagraph className="select-none capitalize" size={'extraSmall'}>
                  {journal.metadata?.intention?.toLowerCase() ?? 'Unknown intention'}
                </TypographyParagraph>
              </div>
            </PopoverText>

            <PopoverText text={'The setting where the trip took place.'}>
              <div className="flex cursor-pointer items-center gap-x-1.5">
                <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                  <Icons.MapPinned className="size-4 text-teal-500" />
                </div>

                <TypographyParagraph className="capitalize" size={'extraSmall'}>
                  {journal?.metadata?.setting?.toLowerCase() ?? 'Unknown setting'}
                </TypographyParagraph>
              </div>
            </PopoverText>

            <PopoverText text={'The date of the trip.'}>
              <div className="flex cursor-pointer items-center gap-x-1.5">
                <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                  <Icons.CalendarDays className="size-4 text-foreground" />
                </div>

                <TypographyParagraph className="capitalize" size={'extraSmall'}>
                  {journal.metadata.date_of_experience
                    ? new Date(journal?.metadata.date_of_experience).toLocaleDateString('en', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                      })
                    : 'Unknown date'}
                </TypographyParagraph>
              </div>
            </PopoverText>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-y-1 px-8 py-5">
        {journal.body && <JournalBody body={journal.body ?? ''} id={journal.id} />}
      </CardContent>
      <CardFooter />
    </Card>
  )
}
