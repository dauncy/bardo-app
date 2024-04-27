import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import { redirect, json } from '@remix-run/node'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { Icons } from '@app/components/bardo/Icons'
import { UserOnboardingStep } from '@prisma/client'
import { prisma } from '@app/db.server'
import { MainNav } from '@app/components/nav/MainNav'
import { getFormData } from '@app/utils/server.utils/forms.utils'
import type { UserCrudPayload } from '@app/types/users'
import { userCrudSchema } from '@app/types/users'
import { sleep } from '@app/utils/server.utils/async.utils'
import { stringify } from 'qs'

const validateRequest = async (ctx: LoaderFunctionArgs | ActionFunctionArgs) => {
  const { authProfile, user } = await getAccountInfo(ctx.request)
  if (!authProfile || !user) {
    throw redirect('/')
  }
  return { authProfile, user }
}
export const loader = async (ctx: LoaderFunctionArgs) => {
  const { user: currentUser } = await validateRequest(ctx)
  if (
    currentUser.onboarding_step === UserOnboardingStep.COMPLETED ||
    currentUser.onboarding_step === UserOnboardingStep.WELCOME
  ) {
    return json({ currentUser })
  }
  const updated = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      onboarding_step: UserOnboardingStep.WELCOME,
    },
  })
  return json({ currentUser: updated })
}

export const action = async (ctx: ActionFunctionArgs) => {
  const { user } = await validateRequest(ctx)
  const body = await getFormData(ctx, userCrudSchema)
  switch (body._action) {
    case 'COMPLETE_ONBOARDING':
      await sleep(350)
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          onboarding_step: UserOnboardingStep.COMPLETED,
        },
      })
      const redirect_to = body.data.redirect_to
      return redirect(redirect_to)
    default:
      return null
  }
}

export default function WelcomePage() {
  const { currentUser } = useLoaderData<typeof loader>()
  const fetcher = useFetcher()
  const pending = fetcher.state === 'loading' || fetcher.state === 'submitting'
  const userName = () => {
    if (currentUser.name) {
      return currentUser.name
    }

    let defaultName = `bardo_user`
    if (currentUser.user_id < 10) {
      defaultName += `_00${currentUser.user_id}`
    }

    if (currentUser.user_id < 100) {
      defaultName += `_0${currentUser.user_id}`
    }

    if (currentUser.user_id >= 100) {
      defaultName += `_${currentUser.user_id}`
    }
    return defaultName
  }

  const handleSubmit = (redirect_to: '/journals' | '/journals/new') => {
    const payload: UserCrudPayload = {
      _action: 'COMPLETE_ONBOARDING',
      data: {
        redirect_to,
      },
    }

    fetcher.submit(stringify(payload), { method: 'POST', action: '/welcome' })
  }
  return (
    <div className="relative flex h-max min-h-full w-full flex-col items-center bg-violet-50">
      <MainNav user={currentUser} />
      <div className="flex h-max min-h-full w-full max-w-[968px] flex-1 flex-col items-center gap-y-2 p-6 pt-[80px]">
        <TypographyParagraph size={'large'} className="font-bold text-xl">
          <span>{`Welcome to Bardo App`}</span>
          <span> </span>
          <span className="text-violet-600 underline">{userName()}</span>
        </TypographyParagraph>
        <TypographyParagraph className="max-w-[600px] whitespace-pre-line text-center">
          {'Select one of the options below to contiune.'}
        </TypographyParagraph>

        <div className="mt-8 grid  w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div
            className={`
              ${pending ? 'cursor-not-allowed opacity-40' : 'cursor-pointer shadow-lg'}
              col-span-1
              flex w-full items-center gap-x-4 rounded-xl border bg-white p-4 md:p-6
            `}
            onClick={() => handleSubmit('/journals')}
          >
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-md bg-muted">
              <Icons.LibraryBig className="size-7 text-foreground" strokeWidth={1.75} />
            </div>
            <div className="flex w-[calc(100%-80px)] flex-col gap-y-1">
              <TypographyParagraph size={'small'} className="font-semibold text-violet-600">
                {'View the library'}
              </TypographyParagraph>
              <TypographyParagraph className="text-muted-foreground" size={'extraSmall'}>
                {'Read through experiences shared by other users. Maybe something shared will resonate with you!'}
              </TypographyParagraph>
            </div>
          </div>
          <div
            className={`
              ${pending ? 'cursor-not-allowed opacity-40' : 'cursor-pointer shadow-lg'}
              col-span-1
              flex w-full items-center gap-x-4 rounded-xl border bg-white p-4 md:p-6
            `}
            onClick={() => handleSubmit('/journals')}
          >
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-md bg-muted">
              <Icons.NotebookPen className="size-7 text-foreground" strokeWidth={1.75} />
            </div>
            <div className="flex w-[calc(100%-80px)] flex-col gap-y-1">
              <TypographyParagraph size={'small'} className="font-semibold text-violet-600">
                {'Share an experience'}
              </TypographyParagraph>
              <TypographyParagraph className="text-muted-foreground" size={'extraSmall'}>
                {"Share your thoughts, insights, or feelings you've had during a psychedelic experience."}
              </TypographyParagraph>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
