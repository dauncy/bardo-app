import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'

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
  return <div></div>
}
