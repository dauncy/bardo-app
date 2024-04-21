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
        <PopoverContent className="shadow-ld z-[999999] ml-4 mr-14 flex w-[240px] flex-col rounded-lg p-0">
          <Link
            to={`${Routes.users}/${user.id}/settings`}
            className="group flex w-full cursor-pointer flex-row items-center gap-x-2 rounded-t-lg px-4 py-2 hover:bg-violet-200"
          >
            <Icons.userRound className="size-5 text-muted-foreground group-hover:text-foreground" strokeWidth={1.5} />
            <TypographyParagraph className="text-muted-foreground group-hover:text-foreground">
              {'Profile'}
            </TypographyParagraph>
          </Link>

          <Link
            to={`/journals`}
            className="group flex w-full cursor-pointer flex-row items-center gap-x-2 px-4 py-2 hover:bg-violet-200"
          >
            <Icons.Newspaper className="size-5 text-muted-foreground group-hover:text-foreground" strokeWidth={1.5} />
            <TypographyParagraph className="text-muted-foreground group-hover:text-foreground">
              {'Feed'}
            </TypographyParagraph>
          </Link>

          <Link
            to={`/journals`}
            className="group flex w-full cursor-pointer flex-row items-center gap-x-2 px-4 py-2 hover:bg-violet-200"
          >
            <Icons.NotebookPen className="size-5 text-muted-foreground group-hover:text-foreground" strokeWidth={1.5} />
            <TypographyParagraph className="text-muted-foreground group-hover:text-foreground">
              {'New Journal'}
            </TypographyParagraph>
          </Link>

          <Link
            to={`/journals`}
            className="group flex w-full cursor-pointer flex-row items-center gap-x-2 px-4 py-2 hover:bg-violet-200"
          >
            <Icons.archive className="size-5 text-muted-foreground group-hover:text-foreground" strokeWidth={1.5} />
            <TypographyParagraph className="text-muted-foreground group-hover:text-foreground">
              {'My Journals'}
            </TypographyParagraph>
          </Link>

          <Separator className="" />
          <button
            onClick={async () => {
              await container.resolve(AuthClient).signOut()
              fetcher.submit({}, { method: 'GET', action: Routes.logout })
            }}
            className="group flex w-full cursor-pointer flex-row items-center justify-between gap-x-2 rounded-b-lg px-4 py-2 hover:bg-violet-200"
          >
            <TypographyParagraph className="text-muted-foreground group-hover:text-foreground">
              {'Sign out'}
            </TypographyParagraph>
            <Icons.logout className="size-5 text-muted-foreground group-hover:text-foreground" strokeWidth={1.5} />
          </button>
        </PopoverContent>
      </Popover>
    </ClientOnly>
  )
}
