/* eslint-disable react/jsx-pascal-case */
import { buttonVariants } from '@app/components/bardo/Button'
import { Icons } from '@app/components/bardo/Icons'
import { Separator } from '@app/components/bardo/Separator'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { JournalCardMenu } from '@app/components/journals/JournalCard'
import { PopoverText } from '@app/components/journals/JournalCard/PopoverText'
import { JournalForm } from '@app/components/journals/JournalForm'
import { BardoLogo } from '@app/components/nav/BardoLogo'
import { UserAvatar } from '@app/components/users/UserAvatar'
import { DOSAGE, INTENTION, MODALITIES, SETTING } from '@app/constants/journal.constants'
import { prisma } from '@app/db.server'
import { Routes } from '@app/services/routes.service'
import type { JournalWithUserEditable } from '@app/types/journals'
import { TripDosage, journalCrudSchema } from '@app/types/journals'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import { sleep } from '@app/utils/server.utils/async.utils'
import { getFormData } from '@app/utils/server.utils/forms.utils'
import { getDynamicParams } from '@app/utils/server.utils/search-params.utils'
import { cn } from '@app/utils/ui.utils'
import type { User } from '@prisma/client'
import type { ActionFunctionArgs, LoaderFunctionArgs, SerializeFrom } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, useFetcher, useLoaderData, useOutletContext, useSearchParams } from '@remix-run/react'
import type { LucideProps } from 'lucide-react'
import { stringify } from 'qs'
import { z } from 'zod'

const validateRequest = async (ctx: LoaderFunctionArgs) => {
  const { authProfile, user } = await getAccountInfo(ctx.request)
  return { user, authProfile }
}

const journalIdSchema = z.object({
  journalId: z.string(),
})

const getJournal = async (ctx: LoaderFunctionArgs) => {
  const { journalId } = getDynamicParams(ctx, journalIdSchema)
  const { user } = await validateRequest(ctx)
  const userId = user?.id
  if (!userId) {
    return await prisma.journal.findFirst({
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
  }

  try {
    return await prisma.journal.findFirst({
      where: {
        id: journalId,
        OR: [
          {
            public: true,
            status: 'PUBLISHED',
          },
          {
            user_id: userId,
          },
        ],
      },
      select: {
        id: true,
        title: true,
        body: true,
        metadata: true,
        created_at: true,
        updated_at: true,
        status: true,
        public: true,
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
  } catch (e) {
    return null
  }
}

export const loader = async (ctx: LoaderFunctionArgs) => {
  const journal = await getJournal(ctx)
  return json({
    journal,
  })
}

export const action = async (ctx: ActionFunctionArgs) => {
  const { user } = await validateRequest(ctx)
  if (!user) {
    throw redirect(Routes.logout)
  }
  const { journalId } = getDynamicParams(ctx, journalIdSchema)
  const body = await getFormData(ctx, journalCrudSchema)
  await sleep(350)
  switch (body._action) {
    case 'UPDATE_JOURNAL': {
      const data = body.data
      const updated = await prisma.journal.update({
        where: {
          user_id: user.id,
          id: journalId,
        },
        data: {
          title: data.title,
          public: data.public,
          status: 'PUBLISHED',
          body: data.body,
          metadata: {
            modalities: data.modalities,
            intention: data.intention,
            setting: data.setting,
            date_of_experience: data.date_of_experience,
          },
        },
      })
      return redirect(`/journals/${updated.id}`)
    }
    case 'SAVE_DRAFT': {
      const data = body.data
      const updated = await prisma.journal.update({
        where: {
          id: journalId,
          user_id: user.id,
        },
        data: {
          title: data.title,
          body: data.body,
          public: data.public,
          status: 'DRAFT',
          metadata: {
            modalities: data.modalities,
            intention: data.intention,
            date_of_experience: data.date_of_experience,
            setting: data.setting,
          },
        },
      })

      return redirect(`/journals/${updated.id}`)
    }
    default:
      return null
  }
  return null
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
  const { currentUser } = useOutletContext<{ currentUser: User | null }>()
  const fetcher = useFetcher()
  const [search] = useSearchParams()
  const edit = search.get('edit')
  const editable = edit === 'true' && currentUser?.id === journal?.user?.id

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

      {journal && !editable && (
        <div className="relative mx-auto flex h-max min-h-full w-full max-w-7xl flex-1 flex-col border bg-white p-6 shadow md:rounded-xl md:p-14">
          {currentUser?.id === journal.user.id && <JournalCardMenu journalId={journal.id} />}
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
                      <PopoverText
                        key={m.modality}
                        text={`${DOSAGE[m.dosage ?? ''] ?? m.dosage?.toLowerCase() ?? 'Unknown '} dosage.`}
                      >
                        <div className="flex cursor-pointer items-center gap-x-2">
                          <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                            <Icon className="size-5 text-blue-500" />
                          </div>
                          <TypographyParagraph size={'extraSmall'}>
                            {MODALITIES[m.modality] ?? m.modality?.trim()}
                          </TypographyParagraph>
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
                  {INTENTION[journal.metadata?.intention ?? ''] ??
                    journal.metadata?.intention?.toLowerCase() ??
                    'Unknown intention'}
                </TypographyParagraph>
              </div>
            </PopoverText>

            <PopoverText text={'The setting where the trip took place.'}>
              <div className="flex cursor-pointer items-center gap-x-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                  <Icons.MapPinned className="size-5 text-teal-500" />
                </div>

                <TypographyParagraph className="capitalize" size={'extraSmall'}>
                  {SETTING[journal?.metadata?.setting ?? ''] ??
                    journal?.metadata?.setting?.toLowerCase() ??
                    'Unknown setting'}
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

          <div className="mt-10 flex px-4 md:px-14">
            <TypographyParagraph className="whitespace-pre-line">{journal.body}</TypographyParagraph>
          </div>
        </div>
      )}

      {journal && editable && (
        <div className="flex h-max min-h-full w-full flex-1 flex-col items-center">
          <div className="flex h-full min-h-full w-full max-w-[640px] flex-1 flex-col gap-y-3 px-0 py-6 md:px-6">
            <div className="flex size-full min-h-full flex-1 flex-col rounded-md border bg-white px-4 py-3 shadow">
              <div className="flex h-max min-h-full w-full flex-1 flex-col gap-y-2 p-5">
                <h1 className="font-foreground font-medium text-2xl">{journal.title ?? 'Undefined title...'}</h1>
                <div className="w-full">
                  <p className="mb-2 border-l border-l-2 border-violet-400 pl-4 text-sm font-normal italic text-foreground/60">
                    {'Fix any of the details below to update this journal'}
                  </p>
                </div>
                <Separator className="mb-3" />
                <JournalForm
                  onUpdate={data => {
                    fetcher.submit(stringify(data), { method: 'POST' })
                  }}
                  journal={journal as SerializeFrom<JournalWithUserEditable>}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
