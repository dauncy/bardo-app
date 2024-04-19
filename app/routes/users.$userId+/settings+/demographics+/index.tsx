import { Separator } from '@app/components/bardo/Separator'
import { DemographicsForm } from '../components/DemographicsForm'
import { redirect, type ActionFunctionArgs } from '@remix-run/node'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import { getSearchParams } from '@app/utils/server.utils/search-params.utils'
import { UserRouteParamsSchema, userCrudSchema } from '@app/types/users'
import { getFormData } from '@app/utils/server.utils/forms.utils'
import { sleep } from '@app/utils/server.utils/async.utils'
import { prisma } from '@app/db.server'
import { useOutletContext } from '@remix-run/react'
import type { User } from '@prisma/client'

const validateRequest = async (ctx: ActionFunctionArgs) => {
  const { authProfile, user } = await getAccountInfo(ctx.request)
  if (!authProfile || !user) {
    throw redirect('/logout')
  }

  return { user, authProfile }
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
      return null
    default:
      return null
  }
}

export default function DemographicsPage() {
  const { currentUser } = useOutletContext<{ currentUser: User }>()
  console.log({ currentUser })
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
      <DemographicsForm userMetadata={currentUser.metadata} />
    </div>
  )
}
