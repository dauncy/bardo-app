import { UserRouteParamsSchema } from '@app/types/users'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import { getSearchParams } from '@app/utils/server.utils/search-params.utils'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { SettingsTabs } from './components/SettingsTabs'
import { MainNav } from '@app/components/nav/MainNav'

const validateRequest = async (ctx: LoaderFunctionArgs) => {
  const { authProfile, user } = await getAccountInfo(ctx.request)
  if (!authProfile || !user) {
    throw redirect('/')
  }
  return { authProfile, user }
}
export const loader = async (ctx: LoaderFunctionArgs) => {
  const { user: currentUser } = await validateRequest(ctx)
  const { userId } = getSearchParams(ctx, UserRouteParamsSchema)
  if (currentUser.id !== userId) {
    throw redirect(`/users/${currentUser.id}/settings`)
  }
  return json({ currentUser })
}

export default function UserSettingsLayout() {
  const { currentUser } = useLoaderData<typeof loader>()
  return (
    <div className="relative flex size-full h-max min-h-full flex-col items-center bg-violet-50">
      <MainNav user={currentUser} />
      <div className="flex h-full min-h-full w-full max-w-[640px] flex-1 flex-col gap-y-3 p-6 pt-[88px]">
        <SettingsTabs userId={currentUser.id} />
        <div className="flex size-full min-h-full flex-1 flex-col rounded-md border bg-white px-4 py-3 shadow">
          <Outlet context={{ currentUser }} />
        </div>
      </div>
    </div>
  )
}
