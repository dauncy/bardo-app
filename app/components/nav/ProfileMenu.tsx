/* eslint-disable react/jsx-pascal-case */
import { ClientOnly } from '../utility/ClientOnly'
import { Popover, PopoverContent, PopoverTrigger } from '@app/components/bardo/Popover'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { Icons } from '@app/components/bardo/Icons'
import { Separator } from '@app/components/bardo/Separator'
import type { SerializeFrom } from '@remix-run/node'
import type { User } from '@prisma/client'
import { Link, useFetcher } from '@remix-run/react'
import { Routes } from '@app/services/routes.service'
import { UserAvatar } from '@app/components/users/UserAvatar'
import { container } from 'tsyringe'
import { AuthClient } from '@app/services/auth/auth-client.service'

export const ProfileMenu = ({ user }: { user: SerializeFrom<User> }) => {
  const fetcher = useFetcher()
  return (
    <ClientOnly>
      <Popover>
        <PopoverTrigger>
          <UserAvatar user={user} />
        </PopoverTrigger>
        <PopoverContent className="z-[999999] ml-4 flex w-[240px] flex-col px-0 pb-2">
          <Link
            to={`${Routes.users}/${user.id}`}
            className="group flex w-full cursor-pointer flex-row items-center gap-x-2 px-4 py-1.5"
          >
            <Icons.userRound className="size-5 text-muted-foreground" strokeWidth={1.5} />
            <TypographyParagraph className="text-muted-foreground group-hover:underline">
              {'Profile'}
            </TypographyParagraph>
          </Link>

          <Link
            to={`${Routes.users}/${user.id}/journals`}
            className="group flex w-full cursor-pointer flex-row items-center gap-x-2 px-4 py-1.5"
          >
            <Icons.archive className="size-5 text-muted-foreground" strokeWidth={1.5} />
            <TypographyParagraph className="text-muted-foreground group-hover:underline">
              {'My journals'}
            </TypographyParagraph>
          </Link>

          <Link
            to={`${Routes.users}/${user.id}/journals/new`}
            className="group flex w-full cursor-pointer flex-row items-center gap-x-2 px-4 py-1.5"
          >
            <Icons.plusCircle className="size-5 text-muted-foreground" strokeWidth={1.5} />
            <TypographyParagraph className="text-muted-foreground group-hover:underline">
              {'New journal'}
            </TypographyParagraph>
          </Link>
          <Separator className="my-2" />
          <button
            onClick={async () => {
              await container.resolve(AuthClient).signOut()
              fetcher.submit({}, { method: 'GET', action: Routes.logout })
            }}
            className="group flex w-full cursor-pointer flex-row items-center gap-x-2 px-4 py-1.5"
          >
            <Icons.logout className="size-5 text-muted-foreground" strokeWidth={1.5} />
            <TypographyParagraph className="text-muted-foreground group-hover:underline">
              {'Sign out'}
            </TypographyParagraph>
          </button>
        </PopoverContent>
      </Popover>
    </ClientOnly>
  )
}
