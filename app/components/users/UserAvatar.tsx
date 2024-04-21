import { Avatar, AvatarFallback, AvatarImage } from '@app/components/bardo/Avatar'
import type { PublicUser } from '@app/types/users'
import type { SerializeFrom } from '@remix-run/node'

export const UserAvatar = ({ user }: { user: SerializeFrom<PublicUser> }) => {
  const avatarFallback = () => {
    const maybeName = user.name
    if (maybeName) {
      return maybeName.charAt(0).toUpperCase()
    }
    return 'B'
  }
  return (
    <Avatar className="flex size-12 cursor-pointer rounded-full border border-slate-200">
      <AvatarImage src={user.picture ?? ''} alt={''} />
      <AvatarFallback className="size-12 border border-slate-200 bg-violet-400">{avatarFallback()}</AvatarFallback>
    </Avatar>
  )
}
