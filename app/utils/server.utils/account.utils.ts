import { prisma } from '@app/db.server'
import { AdminAuthService } from '@app/services/auth/auth-server.service'
import { container } from 'tsyringe'

export const getAccountInfo = async (req: Request) => {
  const adminAuth = container.resolve(AdminAuthService)
  const authProfile = await adminAuth.getAuthProfile(req)
  if (!authProfile) {
    return { authProfile: null, user: null }
  }
  const user = await prisma.user.findFirst({ where: { id: authProfile.fbUid } })
  return { authProfile, user }
}
