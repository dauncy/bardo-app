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
  const { authProfile, user } = await validateRequest(ctx)

  return json({
    authProfile,
    user,
  })
}

export default function UserLayout() {
  const { user, authProfile } = useLoaderData<typeof loader>()

  return (
    <>
      <Outlet context={{ user, authProfile }} />
    </>
  )
}
