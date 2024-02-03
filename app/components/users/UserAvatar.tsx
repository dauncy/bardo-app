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
    <Avatar className="size-9 cursor-pointer rounded-full">
      <AvatarImage src={user.picture ?? ''} alt={user.email} className="rounded-md" />
      <AvatarFallback className="size-9 rounded-md bg-violet-400">{avatarFallback()}</AvatarFallback>
    </Avatar>
  )
}
