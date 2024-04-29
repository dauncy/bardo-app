import { BardoLogo } from '@app/components/nav/BardoLogo'
import { ProfileMenu } from '@app/components/nav/ProfileMenu'
import type { User } from '@prisma/client'
import type { SerializeFrom } from '@remix-run/node'
import { buttonVariants } from '../bardo/Button'
import { cn } from '@app/utils/ui.utils'
import { Link } from '@remix-run/react'

export const MainNav = ({ user }: { user: SerializeFrom<User> | null }) => {
  return (
    <nav className="fixed left-0 top-0 z-10 w-full border-b bg-white px-4 py-2 md:px-6">
      <div className="flex w-full items-center justify-between">
        <BardoLogo />
        {user && <ProfileMenu user={user} />}
        {!user && (
          <Link to={'/'} className={cn(buttonVariants({ variant: 'bardo_primary' }))}>
            {'Get Access'}
          </Link>
        )}
      </div>
    </nav>
  )
}
