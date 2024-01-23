/* eslint-disable react/jsx-pascal-case */
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { prisma } from '@app/db.server'
import { defer, type LoaderFunctionArgs } from '@remix-run/node'
import { Await, Link, useLoaderData, useParams } from '@remix-run/react'
import { Suspense } from 'react'
import { JournalSkeleton } from '@app/components/journals/JournalsSkeleton'
import type { Journal } from '@prisma/client'
import { Button } from '@app/components/bardo/Button'
import { Icons } from '@app/components/bardo/Icons'

export const loader = async (ctx: LoaderFunctionArgs) => {
  const { userId } = ctx.params
  if (!userId) {
    throw Error('no user id.')
  }

  const userJournals = new Promise<Journal[]>(async resolve => {
    const journals = await prisma.journal.findMany({
      where: {
        userId,
      },
    })
    resolve(journals)
  })

  return defer({
    userJournals,
  })
}

export default function UserJournalsPage() {
  const { userId } = useParams()
  const { userJournals } = useLoaderData<typeof loader>()
  return (
    <div className="flex w-full flex-col gap-y-5 pb-10 ">
      <div className="flex w-full items-center justify-between">
        <TypographyParagraph className="" size={'medium'}>
          {'Your Journals'}
        </TypographyParagraph>
        <Link to={`/users/${userId}/journals/new`}>
          <Button
            variant={'outline'}
            className="items-center gap-x-2 border border-violet-400 text-violet-400 hover:text-violet-600"
          >
            {'Add New Entry'}
            <Icons.plus className="size-5" />
          </Button>
        </Link>
      </div>

      <Suspense fallback={<JournalSkeleton />}>
        <Await resolve={userJournals}>
          {journals => {
            if (!journals.length) {
              return (
                <div className="flex min-h-full w-full flex-col items-center justify-center rounded-md border border-violet-400/60 bg-muted px-4 py-5">
                  <TypographyParagraph className="text-center font-light text-muted-foreground" size={'large'}>
                    {'You have no journals to view.'}
                  </TypographyParagraph>
                  <TypographyParagraph className="text-center" size={'small'}>
                    {'Add your first experience and share with others.'}
                  </TypographyParagraph>
                  <Link to={`/users/${userId}/journals/new`}>
                    <Button className="sself-center mt-5 mt-8 items-center gap-x-2" variant={'bardo_primary'}>
                      {'Add New Entry'}
                      <Icons.plus className="size-5" />
                    </Button>
                  </Link>
                </div>
              )
            }
            return null
          }}
        </Await>
      </Suspense>
    </div>
  )
}
