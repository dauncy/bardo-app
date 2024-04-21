import { BardoLogo } from '@app/components/nav/BardoLogo'
import { ProfileMenu } from '@app/components/nav/ProfileMenu'
import type { User } from '@prisma/client'
import type { SerializeFrom } from '@remix-run/node'

export const MainNav = ({ user }: { user: SerializeFrom<User> }) => {
  return (
    <nav className="fixed left-0 top-0 w-full border-b bg-white px-6 py-2">
      <div className="flex w-full items-center justify-between">
        <BardoLogo />
        <ProfileMenu user={user} />
      </div>
    </nav>
  )
}
