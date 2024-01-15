import { AdminAuthService } from '@app/services/auth/auth-server.service'
import { container } from 'tsyringe'

export const getAccountInfo = async (req: Request) => {
  const adminAuth = container.resolve(AdminAuthService)
  const authProfile = await adminAuth.getAuthProfile(req)
  console.log({ authProfile })
  return { authProfile }
}
