/* eslint-disable react/jsx-pascal-case */
import { JournalCard } from '@app/components/journals/JournalCard'
import { JournalSkeleton } from '@app/components/journals/JournalsSkeleton'
import { NoJournals } from '@app/components/journals/NoJournals'
import { UserPreviewCard } from '@app/components/users/UserPreviewCard'
import { prisma } from '@app/db.server'
import { Routes } from '@app/services/routes.service'
import type { JournalWithUser } from '@app/types/journals'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import type { User } from '@prisma/client'
import { defer, redirect } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { Await, useLoaderData, useOutletContext } from '@remix-run/react'
import { Fragment, Suspense } from 'react'

const getAllJournals = async (): Promise<JournalWithUser[]> => {
  return await prisma.journal.findMany({
    where: {
      status: 'PUBLISHED',
      public: true,
    },
    select: {
      id: true,
      title: true,
      metadata: true,
      body: true,
      updated_at: true,
      created_at: true,
      public: true,
      status: true,
      user: {
        select: {
          id: true,
          picture: true,
          name: true,
          user_id: true,
          created_at: true,
        },
      },
    },
    orderBy: {
      updated_at: 'desc',
    },
  })
}

export const loader = async (ctx: LoaderFunctionArgs) => {
  const { user } = await getAccountInfo(ctx.request)
  if (!user) {
    throw redirect(Routes.logout)
  }
  const userJournalsCount = await prisma.journal.count({
    where: {
      user_id: user.id,
    },
  })
  const journals = getAllJournals()
  return defer({
    userStats: {
      num_journals: userJournalsCount,
    },
    feed: journals,
  })
}

export default function JournalsFeedPage() {
  const { currentUser } = useOutletContext<{ currentUser: User }>()
  const { feed, userStats } = useLoaderData<typeof loader>()

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 pb-10 md:flex-row">
      <div className="flex w-full md:w-[302px] md:px-0 md:px-6">
        <UserPreviewCard numJournals={userStats.num_journals} user={currentUser} />
      </div>
      <div className="mt-5 flex w-full flex-col items-center gap-y-5 md:mt-0 md:max-w-xl">
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
                return <NoJournals />
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
