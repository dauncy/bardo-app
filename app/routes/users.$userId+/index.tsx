import { Avatar, AvatarFallback, AvatarImage } from '@app/components/bardo/Avatar'
import { Button } from '@app/components/bardo/Button'
import { Input } from '@app/components/bardo/Input'
import { Label } from '@app/components/bardo/Label'
import { ClientOnly } from '@app/components/utility/ClientOnly'
import type { DecodedClaims } from '@app/services/auth/auth-server.service'
import { Routes } from '@app/services/routes.service'
import type { User } from '@prisma/client'
import { Link, useOutletContext } from '@remix-run/react'

export default function UserPage() {
  const data = useOutletContext<{ user: User; authProfile: DecodedClaims }>()
  const avatarFallback = () => {
    const maybeName = data.user.name
    if (maybeName) {
      return maybeName.charAt(0).toUpperCase()
    }
    return data.user.email.charAt(0).toUpperCase()
  }
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
          <Avatar className="h-12 w-12 rounded-md">
            <AvatarImage src={data.user.picture ?? ''} alt={data.user.email} className="rounded-md" />
            <AvatarFallback className="h-12 w-12 rounded-md bg-violet-400">{avatarFallback()}</AvatarFallback>
          </Avatar>
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
