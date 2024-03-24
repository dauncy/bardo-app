import { Button } from '@app/components/bardo/Button'
import { Input } from '@app/components/bardo/Input'
import { Label } from '@app/components/bardo/Label'
import { UpdateUserProfileImage } from '@app/components/users/UpdateUserProfile'
import { ClientOnly } from '@app/components/utility/ClientOnly'
import type { DecodedClaims } from '@app/services/auth/auth-server.service'
import { Routes } from '@app/services/routes.service'
import type { User } from '@prisma/client'
import { Link, useOutletContext } from '@remix-run/react'

export default function UserPage() {
  const data = useOutletContext<{ user: User; authProfile: DecodedClaims }>()
  return (
    <div className="flex h-full flex-1 grow flex-col gap-y-8">
      <div className="flex flex-col gap-y-2">
        <Label>{'Email'}</Label>
        <Input
          value={data.user.email}
          className="w-full max-w-sm cursor-not-allowed border border-slate-300 bg-violet-100"
          disabled={true}
        />
      </div>

      <div className="flex flex-col gap-y-2">
        <Label>{'Username'}</Label>
        <Input
          value={data.user?.name ?? ''}
          placeholder="enter your username"
          className="w-full max-w-sm cursor-not-allowed border border-slate-300 bg-violet-100"
          disabled={true}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <Label>{'Profile Image'}</Label>
        <ClientOnly>
          <UpdateUserProfileImage user={data.user} />
        </ClientOnly>
      </div>
      <Link to={Routes.logout} className="w-max">
        <Button variant={'secondary'} className="mt-5 w-max border border-violet-400 text-violet-400">
          {'Logout'}
        </Button>
      </Link>
    </div>
  )
}
