import type { PublicUser } from '@app/types/users'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../bardo/Card'
import { UserAvatar } from './UserAvatar'
import { TypographyParagraph } from '../bardo/typography/TypographyParagraph'
import { Link, useOutletContext } from '@remix-run/react'
import { Button } from '../bardo/Button'
import type { User } from '@prisma/client'
import type { SerializeFrom } from '@remix-run/node'

export const UserPreviewCard = ({
  user,
  numJournals,
}: {
  user: PublicUser | SerializeFrom<PublicUser>
  numJournals: number
}) => {
  const { currentUser } = useOutletContext<{ currentUser: User | null }>()
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
    <Card className="h-max w-full md:w-[302px]">
      <CardHeader>
        <div className="flex flex-row gap-x-2">
          <UserAvatar user={user} />
          <div className="flex flex-col">
            <CardTitle>{displayName()}</CardTitle>
            <CardDescription>{`
                Member since 
                ${new Date(user.created_at).toLocaleDateString('en', {
                  month: 'long',
                  year: 'numeric',
                })}
              `}</CardDescription>
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
      <CardFooter className="items-center justify-center">
        {currentUser?.id === user.id && (
          <Link className="w-max min-w-36 md:w-full" to={'/user-settings'}>
            <Button variant={'bardo_primary'} className="w-full rounded-full">
              {'Visit Profile'}
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
