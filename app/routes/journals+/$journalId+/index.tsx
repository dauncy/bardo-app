/* eslint-disable react/jsx-pascal-case */
import { buttonVariants } from '@app/components/bardo/Button'
import { Icons } from '@app/components/bardo/Icons'
import { Separator } from '@app/components/bardo/Separator'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { PopoverText } from '@app/components/journals/JournalCard/PopoverText'
import { BardoLogo } from '@app/components/nav/BardoLogo'
import { UserAvatar } from '@app/components/users/UserAvatar'
import { prisma } from '@app/db.server'
import { TripDosage } from '@app/types/journals'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import { getDynamicParams } from '@app/utils/server.utils/search-params.utils'
import { cn } from '@app/utils/ui.utils'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import type { LucideProps } from 'lucide-react'
import { z } from 'zod'

const validateRequest = async (ctx: LoaderFunctionArgs) => {
  const { authProfile, user } = await getAccountInfo(ctx.request)
  return { user, authProfile }
}

const journalIdSchema = z.object({
  journalId: z.string(),
})

// const searchParamSchema = z.object({
//   edit: z.coerce.boolean().optional()
// })

export const loader = async (ctx: LoaderFunctionArgs) => {
  await validateRequest(ctx)
  const { journalId } = getDynamicParams(ctx, journalIdSchema)
  try {
    const journal = await prisma.journal.findFirst({
      where: {
        id: journalId,
        public: true,
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        title: true,
        body: true,
        metadata: true,
        created_at: true,
        updated_at: true,
        user: {
          select: {
            id: true,
            name: true,
            user_id: true,
            created_at: true,
            picture: true,
          },
        },
      },
    })
    return json({ journal })
  } catch (e) {
    return json({ journal: null })
  }
}

const DosageToIcon: Record<string, (props: LucideProps) => JSX.Element> = {
  [TripDosage.MICRO]: (props: LucideProps) => <Icons.Micro {...props} />,
  [TripDosage.LOW]: (props: LucideProps) => <Icons.Low {...props} />,
  [TripDosage.HIGH]: (props: LucideProps) => <Icons.High {...props} />,
  [TripDosage.HEROIC]: (props: LucideProps) => <Icons.Heroic {...props} />,
  default: (props: LucideProps) => <Icons.HelpCircle {...props} />,
}

export default function JournalViewPage() {
  const { journal } = useLoaderData<typeof loader>()
  return (
    <div className="flex h-full min-h-full w-full flex-1 flex-col items-center md:px-6">
      {!journal && (
        <div className="mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col rounded-xl border border-destructive bg-white p-6">
          <TypographyParagraph size={'large'}>{'404'}</TypographyParagraph>
          <TypographyParagraph className="text-muted-forground/60">
            {'We are unable to locate this resource at this time...'}
          </TypographyParagraph>
          <Separator className="my-3" />
          <div className="flex size-full flex-1 flex-col items-center pt-8">
            <BardoLogo />
            <Link to={'/'} className={cn(buttonVariants({ size: 'default', variant: 'link' }), 'items-center gap-x-2')}>
              {'Go Home'}
              <Icons.arrowForward className="size-4" />
            </Link>
          </div>
        </div>
      )}

      {journal && (
        <div className="mx-auto flex h-max min-h-full w-full max-w-7xl flex-1 flex-col border bg-white p-6 shadow md:rounded-xl md:p-14">
          <div className="flex gap-x-2">
            <UserAvatar user={journal.user} />
            <div className="flex flex-col gap-y-1">
              <TypographyParagraph className="font-medium text-foreground" size={'large'}>
                {journal.title}
              </TypographyParagraph>
              <TypographyParagraph size={'small'} className="text-muted-foreground/80">
                <span>{'Last updated:'}</span>
                <span> </span>
                <span className="font-medium text-foreground">
                  {new Date(journal.updated_at).toLocaleDateString('en', {
                    month: 'long',
                    year: 'numeric',
                    day: 'numeric',
                  })}
                </span>
              </TypographyParagraph>
            </div>
          </div>

          <div className="mt-6 flex w-full flex-wrap items-start gap-6 pl-14">
            <div className="flex flex-col">
              <PopoverText text={'Which psychedelics were taken'}>
                <div className="flex cursor-pointer items-center gap-x-2">
                  <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                    <Icons.Pill className="size-5 stroke-pink-500 text-slate-500" />
                  </div>
                  <TypographyParagraph size={'small'}>{'Modalities'}</TypographyParagraph>
                </div>
              </PopoverText>
              <div className="mt-2 flex flex-wrap items-center gap-4 pl-8">
                {journal.metadata?.modalities &&
                  journal.metadata?.modalities?.map(m => {
                    const Icon = DosageToIcon[m?.dosage ?? 'default']
                    return (
                      <PopoverText key={m.modality} text={`${m.dosage?.toLowerCase() ?? 'Unknown '} dosage.`}>
                        <div className="flex cursor-pointer items-center gap-x-2">
                          <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                            <Icon className="size-5 text-blue-500" />
                          </div>
                          <TypographyParagraph size={'extraSmall'}>{m.modality}</TypographyParagraph>
                        </div>
                      </PopoverText>
                    )
                  })}
              </div>
            </div>
            {/* <div className="flex w-full flex-wrap items-center gap-6"> */}
            <PopoverText text={"User's main intention for the trip"}>
              <div className="flex cursor-pointer items-center gap-x-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                  <Icons.Lightbulb className="size-5 text-yellow-500" />
                </div>

                <TypographyParagraph className="select-none capitalize" size={'extraSmall'}>
                  {journal.metadata?.intention?.toLowerCase() ?? 'Unknown intention'}
                </TypographyParagraph>
              </div>
            </PopoverText>

            <PopoverText text={'The setting where the trip took place.'}>
              <div className="flex cursor-pointer items-center gap-x-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                  <Icons.MapPinned className="size-5 text-teal-500" />
                </div>

                <TypographyParagraph className="capitalize" size={'extraSmall'}>
                  {journal?.metadata?.setting?.toLowerCase() ?? 'Unknown setting'}
                </TypographyParagraph>
              </div>
            </PopoverText>

            <PopoverText text={'The date of the trip.'}>
              <div className="flex cursor-pointer items-center gap-x-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                  <Icons.CalendarDays className="size-5 text-foreground" />
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
            {/* </div> */}
          </div>

          <div className="mt-10 flex px-14">
            <TypographyParagraph className="whitespace-pre-line">{journal.body}</TypographyParagraph>
          </div>
        </div>
      )}
    </div>
  )
}
