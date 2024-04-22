import { MainNav } from '@app/components/nav/MainNav'
import { Routes } from '@app/services/routes.service'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'

const validateRequest = async (ctx: LoaderFunctionArgs) => {
  const { authProfile, user } = await getAccountInfo(ctx.request)
  if (!user || !authProfile) {
    throw redirect(Routes.logout)
  }
  return { authProfile, user }
}

export const loader = async (ctx: LoaderFunctionArgs) => {
  const { user } = await validateRequest(ctx)
  return json({
    currentUser: user,
  })
}

export const action = async () => {
  return null
}

export default function FeedLayout() {
  const { currentUser } = useLoaderData<typeof loader>()
  return (
    <div className="relative flex size-full h-max min-h-full flex-col items-center bg-violet-50">
      <MainNav user={currentUser} />
      <div className="flex h-full min-h-full w-full flex-1 flex-col px-2 py-6 pt-[88px] md:px-6">
        <Outlet context={{ currentUser }} />
      </div>
    </div>
  )
}
