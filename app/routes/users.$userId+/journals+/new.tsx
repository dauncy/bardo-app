import { Separator } from '@app/components/bardo/Separator'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { CreateJournal } from '@app/components/journals/CreateJournal'
import { prisma } from '@app/db.server'
import { Routes } from '@app/services/routes.service'
import type { RequestCtx } from '@app/types'
import type { TripDosage } from '@app/types/journals'
import { journalCrudSchema } from '@app/types/journals'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import { getFormData } from '@app/utils/server.utils/forms.utils'
import { redirect, type ActionFunctionArgs } from '@remix-run/node'

const validateRequest = async (ctx: RequestCtx) => {
  const { user, authProfile } = await getAccountInfo(ctx.request)
  if (!user || !authProfile) {
    throw redirect(Routes.logout)
  }
  return { user, authProfile }
}

export const action = async (ctx: ActionFunctionArgs) => {
  const { user } = await validateRequest(ctx)
  const body = await getFormData(ctx, journalCrudSchema)
  switch (body._action) {
    case 'CREATE_JOURNAL':
      const { data } = body
      await prisma.journal.create({
        data: {
          user_id: user.id,
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
    default:
      throw new Error(`unsupported action: ${body._action}`)
  }
}

export default function NewJournalPage() {
  return (
    <div className="flex flex-col">
      <TypographyParagraph className="" size={'medium'}>
        {'New Journal Entry'}
      </TypographyParagraph>
      <TypographyParagraph className="text-muted-foreground">
        {'Fill in the fields below and click publish when you are done.'}
      </TypographyParagraph>
      <Separator className="my-6" />
      <div className="relative">
        <CreateJournal />
      </div>
    </div>
  )
}
