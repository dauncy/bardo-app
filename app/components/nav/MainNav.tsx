/* eslint-disable react/jsx-pascal-case */
import { ProfileMenu } from './ProfileMenu'
import type { SerializeFrom } from '@remix-run/node'
import type { User } from '@prisma/client'
import { Link } from '@remix-run/react'
import { Routes } from '@app/services/routes.service'
import { Button } from '../bardo/Button'
import { Icons } from '../bardo/Icons'

export const MainNav = ({ user }: { user: SerializeFrom<User> }) => {
  return (
    <nav className="justif-center fixed left-0 top-0 z-[99] flex w-screen items-center bg-white shadow">
      <div className="max-w-9xl mx-auto flex w-full items-center justify-between px-4 py-3">
        <ProfileMenu user={user} />

        <Link to={`${Routes.user(user.id)}/journals/new`} className="w-max">
          <Button
            variant={'outline'}
            className="flex items-center gap-x-2 border-violet-600 text-violet-600 hover:text-violet-900"
          >
            <Icons.plusCircle className="size-5" strokeWidth={1.5} />
            {'New Journal'}
          </Button>
        </Link>
      </div>
    </nav>
  )
}
