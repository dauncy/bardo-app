import { Separator } from '@app/components/bardo/Separator'
import { DemographicsForm } from '../components/DemographicsForm'
import { redirect } from '@remix-run/node'
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import { getSearchParams } from '@app/utils/server.utils/search-params.utils'
import { UserRouteParamsSchema, userCrudSchema } from '@app/types/users'
import { getFormData } from '@app/utils/server.utils/forms.utils'
import { sleep } from '@app/utils/server.utils/async.utils'
import { prisma } from '@app/db.server'
import { UserOnboardingStep } from '@prisma/client'

const validateRequest = async (ctx: ActionFunctionArgs | LoaderFunctionArgs) => {
  const { authProfile, user } = await getAccountInfo(ctx.request)
  if (!authProfile || !user) {
    throw redirect('/logout')
  }

  return { user, authProfile }
}

export const loader = async (ctx: LoaderFunctionArgs) => {
  const { user } = await validateRequest(ctx)
  // edge case where users click private tab before updating
  if (user.onboarding_step === UserOnboardingStep.PROFILE) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        onboarding_step: UserOnboardingStep.DEMOGRAPHICS,
      },
    })
  }
  return null
}
export const action = async (ctx: ActionFunctionArgs) => {
  const { userId } = getSearchParams(ctx, UserRouteParamsSchema)
  const { user } = await validateRequest(ctx)
  if (userId !== user.id) {
    return null
  }

  const body = await getFormData(ctx, userCrudSchema)
  await sleep(500)
  switch (body._action) {
    case 'UPDATE_DEMOGRAPHICS':
      const shouldRedirect =
        user.onboarding_step === UserOnboardingStep.DEMOGRAPHICS || user.onboarding_step === UserOnboardingStep.PROFILE
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          onboarding_step:
            user.onboarding_step === UserOnboardingStep.DEMOGRAPHICS ||
            user.onboarding_step === UserOnboardingStep.PROFILE
              ? UserOnboardingStep.WELCOME
              : user.onboarding_step,
          metadata: {
            ...body.data,
          },
        },
      })
      if (shouldRedirect) {
        return redirect('/welcome')
      }
      return null
    default:
      return null
  }
}

export default function DemographicsPage() {
  return (
    <div className="flex h-full w-full flex-col gap-y-2 p-5">
      <h1 className="font-foreground font-medium text-2xl">{'Private Information'}</h1>
      <div className="w-full">
        <p className="mb-2 border-l border-l-2 border-violet-400 pl-4 text-sm font-normal italic text-foreground/60">
          {
            'This is private info inaccessible to other users. We collect this data to conduct research on how to better help pschedelic users integrate their experieces. In our research all this data will be de-identifiable. Feel free to skip this step.'
          }
        </p>
      </div>
      <Separator className="mb-3" />
      <DemographicsForm />
    </div>
  )
}
