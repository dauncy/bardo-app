import { Separator } from '@app/components/bardo/Separator'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { CreateJournal } from '@app/components/journals/CreateJournal'
import { prisma } from '@app/db.server'
import { Routes } from '@app/services/routes.service'
import type { RequestCtx } from '@app/types'
import type { TripDosage } from '@app/types/journals'
import { journalCrudSchema } from '@app/types/journals'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import { sleep } from '@app/utils/server.utils/async.utils'
import { getFormData } from '@app/utils/server.utils/forms.utils'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

const validateRequest = async (ctx: RequestCtx) => {
  const { user, authProfile } = await getAccountInfo(ctx.request)
  if (!user || !authProfile) {
    throw redirect(Routes.logout)
  }
  return { user, authProfile }
}

export const loader = async (ctx: LoaderFunctionArgs) => {
  const { user } = await validateRequest(ctx)
  const { userId, id: journalId } = ctx.params
  if (user.id !== userId) {
    throw new Error("user cannot edit someone else's journal")
  }
  const journal = await prisma.journal.findFirstOrThrow({
    where: {
      user_id: user.id,
      id: journalId,
    },
  })

  return json({ journal })
}

export const action = async (ctx: ActionFunctionArgs) => {
  const { user } = await validateRequest(ctx)
  const body = await getFormData(ctx, journalCrudSchema)
  const { id: journalId } = ctx.params
  switch (body._action) {
    case 'UPDATE_JOURNAL':
      const { data } = body
      await prisma.journal.update({
        where: {
          id: journalId,
        },
        data: {
          title: data.title,
          body: data.body,
          metadata: {
            modality: data.modality,
            intention: data.intention,
            setting: data.setting,
            dosage: data.dosage as TripDosage,
          },
        },
      })
      return redirect(`/users/${user.id}/journals`)
    case 'DELETE_JOURNAL':
      await sleep(2500)
      await prisma.journal.delete({
        where: {
          user_id: user.id,
          id: body.data.id,
        },
      })
      return null
    default:
      throw new Error(`unsupported action: ${body._action}`)
  }
}

export default function UserJournalIdPage() {
  const { journal } = useLoaderData<typeof loader>()
  return (
    <div className="flex flex-col">
      <TypographyParagraph className="" size={'medium'}>
        {'Edit Journal'}
      </TypographyParagraph>
      <TypographyParagraph className="text-muted-foreground">
        {'Update the fields below and click Save Changes when you are done.'}
      </TypographyParagraph>
      <Separator className="my-6" />
      <div className="relative">
        <CreateJournal journal={journal} />
      </div>
    </div>
  )
}
