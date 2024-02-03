/* eslint-disable react/jsx-pascal-case */
import { Button } from '@app/components/bardo/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@app/components/bardo/Card'
import { Icons } from '@app/components/bardo/Icons'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { JournalCard } from '@app/components/journals/JournalCard'
import { JournalSkeleton } from '@app/components/journals/JournalsSkeleton'
import { UserAvatar } from '@app/components/users/UserAvatar'
import { prisma } from '@app/db.server'
import { Routes } from '@app/services/routes.service'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import type { Journal, User } from '@prisma/client'
import { defer, redirect } from '@remix-run/node'
import type { SerializeFrom, LoaderFunctionArgs } from '@remix-run/node'
import { Await, Link, useLoaderData, useOutletContext } from '@remix-run/react'
import { Fragment, Suspense } from 'react'

const getAllJournals = async (): Promise<Array<Journal & { user: User }>> => {
  return await prisma.journal.findMany({
    include: {
      user: true,
    },
    orderBy: {
      updated_at: 'desc',
    },
  })
}

export const loader = async (ctx: LoaderFunctionArgs) => {
  const { authProfile } = await getAccountInfo(ctx.request)
  if (!authProfile) {
    throw redirect(Routes.logout)
  }
  const userJournals = await prisma.user.findFirst({
    where: {
      id: authProfile.fbUid,
    },
    select: {
      journals: {
        select: {
          id: true,
        },
      },
    },
  })
  const journals = getAllJournals()
  return defer({
    userStats: {
      num_journals: userJournals?.journals?.length ?? 0,
    },
    feed: journals,
  })
}

export default function JournalsFeedPage() {
  const { user } = useOutletContext<{ user: SerializeFrom<User> }>()
  const { feed, userStats } = useLoaderData<typeof loader>()
  return (
    <div className="mx-auto mt-10 flex w-full max-w-7xl flex-col gap-4 pb-10 md:flex-row">
      <Card className="h-max w-full md:w-[302px]">
        <CardHeader>
          <div className="flex flex-row gap-x-2">
            <UserAvatar user={user} />
            <div className="flex flex-col">
              <CardTitle>{user.name ?? user.email}</CardTitle>
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
              {userStats.num_journals}
            </TypographyParagraph>
          </div>
        </CardContent>
        <CardFooter className="items-center justify-center">
          <Link className="w-max min-w-36 md:w-full" to={Routes.user(user.id)}>
            <Button variant={'bardo_primary'} className="w-full rounded-full">
              {'Visit Profile'}
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <div className="flex w-full flex-col items-center gap-y-5 md:max-w-xl">
        <Suspense
          fallback={
            <>
              {Array.from(new Array(5)).map((_, i) => (
                <Fragment key={`feed-loading-${i}`}>
                  <JournalSkeleton />
                </Fragment>
              ))}
            </>
          }
        >
          <Await resolve={feed}>
            {feed => {
              if (feed.length === 0) {
                return (
                  <div className="flex min-h-full w-full flex-col items-center justify-center rounded-md border border-violet-400/60 bg-muted px-4 py-5 shadow">
                    <TypographyParagraph className="text-center font-light text-muted-foreground" size={'large'}>
                      {'There are no experiences shared'}
                    </TypographyParagraph>
                    <TypographyParagraph className="text-center" size={'small'}>
                      {'Be the first to share your experience with others.'}
                    </TypographyParagraph>
                    <Link to={`/users/${user.id}/journals/new`}>
                      <Button
                        className="mt-5 mt-8 items-center gap-x-2 self-center border border-violet-600 text-violet-600"
                        variant={'secondary'}
                      >
                        {'Share your expereince'}
                        <Icons.arrowForward className="size-5" strokeWidth={1.5} />
                      </Button>
                    </Link>
                  </div>
                )
              }
              return (
                <>
                  {feed.map(journal => (
                    <Fragment key={journal.id}>
                      <JournalCard journal={journal} />
                    </Fragment>
                  ))}
                </>
              )
            }}
          </Await>
        </Suspense>
      </div>
    </div>
  )
}
