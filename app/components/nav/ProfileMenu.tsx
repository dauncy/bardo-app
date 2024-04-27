/* eslint-disable react/jsx-pascal-case */
import { Popover, PopoverContent, PopoverTrigger } from '@app/components/bardo/Popover'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { Icons } from '@app/components/bardo/Icons'
import { Separator } from '@app/components/bardo/Separator'
import type { SerializeFrom } from '@remix-run/node'
import { UserRole, type User } from '@prisma/client'
import { Link, useFetcher, useLocation } from '@remix-run/react'
import { Routes } from '@app/services/routes.service'
import { UserAvatar } from '@app/components/users/UserAvatar'
import { container } from 'tsyringe'
import { AuthClient } from '@app/services/auth/auth-client.service'
import { useEffect, useState } from 'react'

export const ProfileMenu = ({ user }: { user: SerializeFrom<User> }) => {
  const fetcher = useFetcher()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])
  return (
    <Popover open={open} onOpenChange={e => setOpen(e)}>
      <PopoverTrigger>
        <UserAvatar user={user} link={false} />
      </PopoverTrigger>
      <PopoverContent className="z-20 mr-12 flex max-w-[224px] flex-col gap-y-2 rounded-xl px-4 py-3 shadow-lg md:mr-16">
        <Link
          to={`/user-settings`}
          className="group flex w-full cursor-pointer flex-row items-center gap-x-4 rounded-md px-4 py-2 font-medium hover:bg-violet-200"
        >
          <Icons.userRound className="size-4 text-muted-foreground group-hover:text-foreground" strokeWidth={1.5} />
          <TypographyParagraph size={'small'} className="text-muted-foreground group-hover:text-foreground">
            {'Profile'}
          </TypographyParagraph>
        </Link>

        <Link
          to={`/journals`}
          className="group flex w-full cursor-pointer flex-row items-center gap-x-4 rounded-md px-4 py-2 font-medium hover:bg-violet-200"
        >
          <Icons.Newspaper className="size-4 text-muted-foreground group-hover:text-foreground" strokeWidth={1.5} />
          <TypographyParagraph size={'small'} className="text-muted-foreground group-hover:text-foreground">
            {'Feed'}
          </TypographyParagraph>
        </Link>

        <Link
          to={`/journals/new`}
          className="group flex w-full cursor-pointer flex-row items-center gap-x-4 rounded-md px-4 py-2 font-medium hover:bg-violet-200"
        >
          <Icons.NotebookPen className="size-4 text-muted-foreground group-hover:text-foreground" strokeWidth={1.5} />
          <TypographyParagraph size={'small'} className="text-muted-foreground group-hover:text-foreground">
            {'New Journal'}
          </TypographyParagraph>
        </Link>

        <Link
          to={`/users/${user.id}`}
          className="group flex w-full cursor-pointer flex-row items-center gap-x-4 rounded-md px-4 py-2 font-medium hover:bg-violet-200"
        >
          <Icons.archive className="size-4 text-muted-foreground group-hover:text-foreground" strokeWidth={1.5} />
          <TypographyParagraph size={'small'} className="text-muted-foreground group-hover:text-foreground">
            {'My Journals'}
          </TypographyParagraph>
        </Link>

        <Separator className="" />
        {user.roles.includes(UserRole.admin) && (
          <Link
            to={`/admin`}
            className="group flex w-full cursor-pointer flex-row items-center gap-x-4 rounded-md px-4 py-2 font-medium hover:bg-violet-200"
          >
            <Icons.Settings className="size-4 text-muted-foreground group-hover:text-foreground" strokeWidth={1.5} />
            <TypographyParagraph size={'small'} className="text-muted-foreground group-hover:text-foreground">
              {'Admin'}
            </TypographyParagraph>
          </Link>
        )}
        <button
          onClick={async () => {
            await container.resolve(AuthClient).signOut()
            fetcher.submit({}, { method: 'GET', action: Routes.logout })
          }}
          className="group flex w-full cursor-pointer flex-row items-center justify-between gap-x-4 rounded-md px-4 py-2 font-medium hover:bg-violet-200"
        >
          <TypographyParagraph size={'small'} className="text-muted-foreground group-hover:text-foreground">
            {'Sign out'}
          </TypographyParagraph>
          <Icons.logout className="size-4 text-muted-foreground group-hover:text-foreground" strokeWidth={1.5} />
        </button>
      </PopoverContent>
    </Popover>
  )
}
