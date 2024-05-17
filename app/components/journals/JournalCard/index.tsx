/* eslint-disable react/jsx-pascal-case */
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@app/components/bardo/Card'
import type { User } from '@prisma/client'
import { UserAvatar } from '@app/components/users/UserAvatar'
import { JournalBody } from './JournalBody'
import { Popover, PopoverContent, PopoverTrigger } from '@app/components/bardo/Popover'
import { Icons } from '@app/components/bardo/Icons'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { Link, useOutletContext } from '@remix-run/react'
import type { SerializeFrom } from '@remix-run/node'
import { TripDosage, type JournalWithUser } from '@app/types/journals'
import type { LucideProps } from 'lucide-react'
import { PopoverText } from './PopoverText'
import { DOSAGE, INTENTION, MODALITIES, SETTING } from '@app/constants/journal.constants'
import { Button, buttonVariants } from '@app/components/bardo/Button'
import { useToast } from '@app/components/bardo/toast/use-toast'
import { cn } from '@app/utils/ui.utils'
import { useState } from 'react'

export const JournalCardMenu = ({ journal }: { journal: SerializeFrom<JournalWithUser> }) => {
  const [open, setOpen] = useState(false)
  const { currentUser } = useOutletContext<{ currentUser: User | null }>()

  const showMenu = () => {
    if (journal.public && journal.status === 'PUBLISHED') {
      return true
    }

    if (journal.user.id === currentUser?.id) {
      return true
    }

    return false
  }
  const { toast } = useToast()
  const handleShare = async () => {
    const name = () => {
      if (journal.user.name) {
        return journal.user.name
      }
      const id = journal.user.user_id
      if (id < 10) {
        return `bardo_user_00${id}`
      }

      if (id < 100) {
        return `bardo_user_0${id}`
      }

      return `bardo_user_${id}`
    }
    if (navigator.share) {
      setOpen(false)
      await navigator.share({
        title: `Bardo | ${journal.title}`,
        text: `${name()} - ${journal.body?.slice(0, 120)} - read more...`,
        url: `${window.location.origin}/journals/${journal.id}`,
      })
    } else {
      setOpen(false)
      navigator.clipboard.writeText(`${window.location.origin}/journals/${journal.id}`)
      toast({
        title: 'Link copied to clipboard.',
        description: 'You can now share this journal.',
        action: (
          <Link
            className={cn(buttonVariants({ variant: 'ghost' }), 'font-medium text-violet-800')}
            to={`/journals/${journal.id}`}
          >
            {'View'}
          </Link>
        ),
      })
    }
  }

  if (!showMenu()) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={e => setOpen(e)}>
      <PopoverTrigger asChild>
        <div className="absolute right-2 top-2 flex cursor-pointer items-center justify-center">
          <Icons.more className="size-6 text-slate-200 hover:text-violet-600" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex max-w-[224px] flex-col gap-y-2 rounded-xl px-4 py-3 shadow-lg" side={'left'}>
        {journal.public && journal.status === 'PUBLISHED' && (
          <Button
            onClick={async () => await handleShare()}
            tabIndex={-1}
            variant={'ghost'}
            className={`
                group flex w-full 
                cursor-pointer 
                items-center justify-start gap-x-4 rounded-md px-4 
                py-1.5 hover:bg-violet-200
              `}
          >
            <Icons.Share className="size-4 text-muted-foreground group-hover:text-foreground" />
            <TypographyParagraph size={'small'} className="text-muted-foreground group-hover:text-foreground">
              {'Share Journal'}
            </TypographyParagraph>
          </Button>
        )}
        {currentUser?.id === journal?.user?.id && (
          <Link
            to={`/journals/${journal.id}?edit=true`}
            className="group flex w-full cursor-pointer items-center justify-start gap-x-4 rounded-md px-4 py-1.5 font-medium text-sm hover:bg-violet-200"
          >
            <Icons.NotebookPen className="size-4 text-muted-foreground group-hover:text-foreground" />
            <TypographyParagraph size={'small'} className="text-muted-foreground group-hover:text-foreground">
              {'Edit Journal'}
            </TypographyParagraph>
          </Link>
        )}
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
  return (
    <Card className="relative w-full cursor-default rounded-none px-0 shadow-none md:rounded-md md:shadow">
      <JournalCardMenu journal={journal} />
      <CardHeader className="flex flex-row gap-x-2 px-4 py-5 pb-0 md:gap-x-4 md:px-8 md:py-6">
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
                    <PopoverText
                      key={m.modality}
                      text={`${DOSAGE[m.dosage ?? ''] ?? m.dosage?.toLowerCase() ?? 'Unknown '} dosage.`}
                    >
                      <div className="flex cursor-pointer items-center gap-x-1.5">
                        <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                          <Icon className="size-4 text-blue-500" />
                        </div>
                        <TypographyParagraph size={'extraSmall'}>
                          {MODALITIES[m.modality] ?? m.modality.trim()}
                        </TypographyParagraph>
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
                  {INTENTION[journal.metadata?.intention ?? ''] ??
                    journal.metadata.intention?.trim() ??
                    'Unknown intention'}
                </TypographyParagraph>
              </div>
            </PopoverText>

            <PopoverText text={'The setting where the trip took place.'}>
              <div className="flex cursor-pointer items-center gap-x-1.5">
                <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                  <Icons.MapPinned className="size-4 text-teal-500" />
                </div>

                <TypographyParagraph className="capitalize" size={'extraSmall'}>
                  {SETTING[journal?.metadata?.setting ?? ''] ?? journal?.metadata?.setting?.trim() ?? 'Unknown setting'}
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
