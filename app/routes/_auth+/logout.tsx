import { AdminAuthService } from '@app/services/auth/auth-server.service'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { container } from 'tsyringe'

const adminAuth = container.resolve(AdminAuthService)
export const loader = async (ctx: LoaderFunctionArgs) => {
  return await adminAuth.signOut(ctx.request)
}
