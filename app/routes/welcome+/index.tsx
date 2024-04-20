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
    <div className="relative flex h-full min-h-full w-full flex-col items-center bg-violet-50">
      <MainNav user={currentUser} />
      <div className="flex h-full min-h-full w-full max-w-[968px] flex-1 flex-col items-center gap-y-2 p-6 pt-[88px]">
        <TypographyParagraph size={'large'} className="font-bold text-xl">
          <span>{`Welcome to Bardo App`}</span>
          <span> </span>
          <span className="text-violet-600 underline">{userName()}</span>
        </TypographyParagraph>
        <TypographyParagraph className="max-w-[600px] whitespace-pre-line text-center">
          {'What would you like to do today? \nSelect one of the options below to contiune.'}
        </TypographyParagraph>

        <div className="w-ful mt-8 flex flex-row justify-center gap-6">
          <div
            className={`
              ${pending ? 'cursor-not-allowed opacity-40' : 'cursor-pointer transition-all delay-150 duration-150 ease-in hover:shadow-lg'}
              flex flex h-[350px] w-full max-w-[302px] flex-col items-center rounded-xl border bg-white p-6
            `}
            onClick={() => handleSubmit('/journals')}
          >
            <div className="flex h-48 w-full flex-col items-center justify-center rounded-md bg-muted">
              <Icons.LibraryBig className="size-24 text-slate-600/80" strokeWidth={1} />
            </div>
            <div className="mt-5 flex w-full flex-col gap-y-1">
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
              ${pending ? 'cursor-not-allowed opacity-40' : 'cursor-pointer transition-all delay-150 duration-150 ease-in hover:shadow-lg'}
              flex flex h-[350px] w-full max-w-[302px] flex-col items-center rounded-xl border bg-white p-6
            `}
            onClick={() => {
              handleSubmit('/journals/new')
            }}
          >
            <div className="flex h-48 w-full flex-col items-center justify-center rounded-md bg-muted">
              <Icons.NotebookPen className="size-24 text-slate-600/80" strokeWidth={1} />
            </div>
            <div className="mt-5 flex w-full flex-col gap-y-1">
              <TypographyParagraph size={'small'} className="font-semibold text-violet-600">
                {'Share an experience'}
              </TypographyParagraph>
              <TypographyParagraph className="text-muted-foreground" size={'extraSmall'}>
                {
                  "Journal some thoughts, insights, and feelings you've had during a psychedelic experience. Keep it private or share it with others."
                }
              </TypographyParagraph>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
