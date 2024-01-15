import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

const validateRequest = async (ctx: LoaderFunctionArgs) => {
  const { authProfile } = await getAccountInfo(ctx.request)
  return { authProfile }
}
export const loader = async (ctx: LoaderFunctionArgs) => {
  const { authProfile } = await validateRequest(ctx)
  return json({
    authProfile,
  })
}

export default function UserPage() {
  const { authProfile } = useLoaderData<typeof loader>()
  return (
    <div className="min-w-screen flex h-full min-h-screen w-full items-center justify-center">
      <pre>{JSON.stringify(authProfile, null, 2)}</pre>
    </div>
  )
}
