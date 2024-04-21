import { Separator } from '@app/components/bardo/Separator'
import { redirect } from '@remix-run/node'
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import { userCrudSchema } from '@app/types/users'
import { getFormData } from '@app/utils/server.utils/forms.utils'
import { sleep } from '@app/utils/server.utils/async.utils'
import { prisma } from '@app/db.server'
import { UserOnboardingStep } from '@prisma/client'
import { DemographicsForm } from '@app/components/settings/DemographicsForm'

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

const checkRedirect = (currentStep: UserOnboardingStep) => {
  if (currentStep === UserOnboardingStep.PROFILE) {
    return true
  }

  if (currentStep === UserOnboardingStep.DEMOGRAPHICS) {
    return true
  }

  return false
}

export const action = async (ctx: ActionFunctionArgs) => {
  const { user } = await validateRequest(ctx)
  const body = await getFormData(ctx, userCrudSchema)
  await sleep(350)
  switch (body._action) {
    case 'UPDATE_DEMOGRAPHICS':
      const shouldRedirect = checkRedirect(user.onboarding_step)
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
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
