import { Avatar, AvatarFallback, AvatarImage } from '@app/components/bardo/Avatar'
import type { PublicUser } from '@app/types/users'
import type { SerializeFrom } from '@remix-run/node'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../bardo/Tooltip'
import { Link } from '@remix-run/react'

export const UserAvatar = ({ user, link = true }: { user: PublicUser | SerializeFrom<PublicUser>; link?: boolean }) => {
  const userName = () => {
    if (user.name) {
      return user.name
    }

    const id = user.user_id
    if (id < 10) {
      return `bardo_user_00${id}`
    }

    if (id < 100) {
      return `bardo_user_0${id}`
    }

    return `bardo_user_$${id}`
  }

  const avatarFallback = () => {
    return userName().charAt(0)
  }

  if (!link) {
    return (
      <Avatar className="flex size-12 cursor-pointer rounded-full border border-slate-200">
        <AvatarImage src={user.picture ?? ''} alt={''} />
        <AvatarFallback className="size-12 border border-slate-200 bg-violet-400">{avatarFallback()}</AvatarFallback>
      </Avatar>
    )
  }
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          <Link to={`/users/${user.id}`}>
            <Avatar className="flex size-12 cursor-pointer rounded-full border border-slate-200">
              <AvatarImage src={user.picture ?? ''} alt={''} />
              <AvatarFallback className="size-12 border border-slate-200 bg-violet-400">
                {avatarFallback()}
              </AvatarFallback>
            </Avatar>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="left">{userName()}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
