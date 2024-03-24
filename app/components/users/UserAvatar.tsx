import { Avatar, AvatarFallback, AvatarImage } from '@app/components/bardo/Avatar'
import type { User } from '@prisma/client'
import type { SerializeFrom } from '@remix-run/node'

export const UserAvatar = ({ user }: { user: SerializeFrom<User> }) => {
  const avatarFallback = () => {
    const maybeName = user.name
    if (maybeName) {
      return maybeName.charAt(0).toUpperCase()
    }
    return user.email.charAt(0).toUpperCase()
  }
  return (
    <Avatar className="flex size-12 cursor-pointer items-center justify-center rounded-full border border-slate-200 p-1">
      <AvatarImage src={user.picture ?? ''} alt={user.email} />
      <AvatarFallback className="size-12 border border-slate-200 bg-violet-400">{avatarFallback()}</AvatarFallback>
    </Avatar>
  )
}
