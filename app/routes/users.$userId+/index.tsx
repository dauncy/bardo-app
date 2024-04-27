import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { JournalCard } from '@app/components/journals/JournalCard'
import { UserJournalTabs } from '@app/components/users/UserJournalTabs'
import { UserPreviewCard } from '@app/components/users/UserPreviewCard'
import { prisma } from '@app/db.server'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import { getDynamicParams, getSearchParams } from '@app/utils/server.utils/search-params.utils'
import type { User } from '@prisma/client'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData, useOutletContext } from '@remix-run/react'
import { Fragment } from 'react'
import { z } from 'zod'

const validateRequest = async (ctx: LoaderFunctionArgs) => {
  const { authProfile, user } = await getAccountInfo(ctx.request)
  return { user, authProfile }
}

const userJournalSearchSchema = z.object({
  type: z.enum(['draft', 'private']).optional(),
})

const userIdSchema = z.object({
  userId: z.string(),
})
export const loader = async (ctx: LoaderFunctionArgs) => {
  const { user: currentUser } = await validateRequest(ctx)
  const { userId } = getDynamicParams(ctx, userIdSchema)

  if (!currentUser || currentUser.id !== userId) {
    const numJournals = await prisma.journal.count({
      where: {
        user_id: userId,
        status: 'PUBLISHED',
        public: true,
      },
    })
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        picture: true,
        created_at: true,
        user_id: true,
        journals: {
          where: {
            status: 'PUBLISHED',
            public: true,
          },
          select: {
            id: true,
            title: true,
            metadata: true,
            updated_at: true,
            body: true,
            created_at: true,
          },
        },
      },
    })

    return json({
      numJournals,
      user: {
        id: user.id,
        user_id: user.user_id,
        name: user.name,
        created_at: user.created_at,
        picture: user.picture,
      },
      journals: user.journals,
    })
  }

  // currentUser;
  try {
    const { type } = getSearchParams(ctx, userJournalSearchSchema)
    if (type === 'draft') {
      const numJournals = await prisma.journal.count({
        where: {
          user_id: currentUser.id,
        },
      })

      const journals = await prisma.journal.findMany({
        where: {
          user_id: currentUser.id,
          status: 'DRAFT',
        },
        select: {
          id: true,
          title: true,
          metadata: true,
          updated_at: true,
          body: true,
          created_at: true,
        },
      })

      return json({
        journals,
        user: currentUser,
        numJournals,
      })
    }

    if (type === 'private') {
      const numJournals = await prisma.journal.count({
        where: {
          user_id: currentUser.id,
        },
      })

      const journals = await prisma.journal.findMany({
        where: {
          user_id: currentUser.id,
          status: 'PUBLISHED',
          public: false,
        },
        select: {
          id: true,
          title: true,
          metadata: true,
          updated_at: true,
          body: true,
          created_at: true,
        },
      })

      return json({
        journals,
        user: currentUser,
        numJournals,
      })
    }
  } catch (e) {
    //
  }

  const numJournals = await prisma.journal.count({
    where: {
      user_id: currentUser.id,
    },
  })

  const journals = await prisma.journal.findMany({
    where: {
      user_id: currentUser.id,
      status: 'PUBLISHED',
      public: true,
    },
    select: {
      id: true,
      title: true,
      metadata: true,
      updated_at: true,
      body: true,
      created_at: true,
    },
  })

  return json({
    journals,
    user: currentUser,
    numJournals,
  })
}

export default function UserJournalsPage() {
  const { journals, user, numJournals } = useLoaderData<typeof loader>()
  const { currentUser } = useOutletContext<{ currentUser: User | null }>()
  return (
    <div className="mx-auto flex h-max min-h-full min-h-full w-full max-w-7xl flex-1 flex-col gap-4 pb-10 md:flex-row">
      <div className="flex w-full md:w-[302px]">
        <UserPreviewCard numJournals={numJournals} user={user} />
      </div>
      <div className="mt-5 flex h-max min-h-full w-full flex-1 flex-col gap-y-5 md:mt-0 md:max-w-xl">
        {user.id === currentUser?.id && (
          <div className="flex w-full px-2 md:px-0">
            <UserJournalTabs />
          </div>
        )}
        <div className="flex h-max min-h-full w-full flex-1 flex-col items-center gap-y-5">
          {journals.length == 0 && (
            <div className="flex flex h-max min-h-full w-full flex-1 flex-col gap-y-3 border bg-white p-6 shadow md:rounded-xl">
              <TypographyParagraph size={'large'} className="text-foreground">
                {'No journals found'}
              </TypographyParagraph>
              <TypographyParagraph size={'small'} className="text-muted-foreground">
                {"We couldn't find any jounals that match your query."}
              </TypographyParagraph>
            </div>
          )}
          {journals.length > 0 &&
            journals.map(journal => (
              <Fragment key={journal.id}>
                <JournalCard journal={{ ...journal, user: user }} />
              </Fragment>
            ))}
        </div>
      </div>
    </div>
  )
}
