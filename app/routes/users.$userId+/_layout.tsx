import { MainNav } from '@app/components/nav/MainNav'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'

const validateRequest = async (ctx: LoaderFunctionArgs) => {
  const { authProfile, user } = await getAccountInfo(ctx.request)
  return { authProfile, user }
}
export const loader = async (ctx: LoaderFunctionArgs) => {
  const { user } = await validateRequest(ctx)
  return json({
    currentUser: user,
  })
}

export default function UserLayout() {
  const { currentUser } = useLoaderData<typeof loader>()

  return (
    <div className="relative h-max min-h-full w-full bg-violet-50">
      <MainNav user={currentUser} />
      <div className="flex h-max min-h-full w-full flex-1 flex-col px-0 py-6 pt-[88px] md:px-6">
        <Outlet context={{ currentUser }} />
      </div>
    </div>
  )
}
