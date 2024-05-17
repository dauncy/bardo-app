import type { PublicUser } from '@app/types/users'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../bardo/Card'
import { UserAvatar } from './UserAvatar'
import { TypographyParagraph } from '../bardo/typography/TypographyParagraph'
import { Link, useLocation, useOutletContext } from '@remix-run/react'
import { Button } from '../bardo/Button'
import type { User } from '@prisma/client'
import type { SerializeFrom } from '@remix-run/node'
import { Icons } from '../bardo/Icons'

export const UserPreviewCard = ({
  user,
  numJournals,
}: {
  user: PublicUser | SerializeFrom<PublicUser>
  numJournals: number
}) => {
  const { currentUser } = useOutletContext<{ currentUser: User | null }>()
  const { pathname } = useLocation()

  const displayName = () => {
    if (user.name) {
      return user.name
    }
    if (user.user_id < 10) {
      return `bardo_user_00${user.user_id}`
    }

    if (user.user_id < 100) {
      return `bardo_user_0${user.user_id}`
    }

    return `bardo_user_${user.user_id}`
  }
  return (
    <Card className="rounded-non h-max w-full shadow-none md:w-[302px] md:rounded-md md:shadow">
      <CardHeader className="p-4 py-5">
        <div className="flex flex-row gap-x-2">
          <UserAvatar user={user} />
          <div className="mt-1 flex flex-col">
            <CardTitle>{displayName()}</CardTitle>
            <CardDescription>
              <span>Member since </span>
              <span> </span>
              <span className="font-medium text-foreground">
                {`${new Date(user.created_at).toLocaleDateString('en', {
                  month: 'long',
                  year: 'numeric',
                })}`}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-row items-center justify-between">
          <TypographyParagraph className="text-muted-foreground">{'Total Entries: '}</TypographyParagraph>

          <TypographyParagraph size={'medium'} className="font-semibold text-violet-800">
            {numJournals}
          </TypographyParagraph>
        </div>
      </CardContent>
      <CardFooter className="items-center justify-center py-0">
        {currentUser?.id === user.id && pathname !== `/users/${currentUser.id}` && (
          <Link className=" my-6 w-full min-w-36" to={`/users/${currentUser.id}`}>
            <Button variant={'bardo_primary'} className="w-full rounded-full">
              {'Visit Profile'}
            </Button>
          </Link>
        )}
        {currentUser?.id === user.id && pathname === `/users/${currentUser.id}` && (
          <Link className=" my-6 w-full min-w-36" to={`/journals/new`}>
            <Button variant={'bardo_primary'} className="w-full items-center gap-x-2 rounded-full">
              {/* eslint-disable-next-line react/jsx-pascal-case */}
              <Icons.plus />
              {'New Journal'}
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
