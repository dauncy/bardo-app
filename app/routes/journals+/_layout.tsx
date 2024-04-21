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

export default function FeedLayout() {
  const { currentUser } = useLoaderData<typeof loader>()
  return (
    <div className="min-w-screen relative flex min-h-screen flex-col items-center bg-indigo-50/40 px-5">
      <MainNav user={currentUser} />
      <div className="mt-16 size-full bg-transparent">
        <Outlet context={{ currentUser }} />
      </div>
    </div>
  )
}
