import { Separator } from '@app/components/bardo/Separator'
import { JournalForm } from '@app/components/journals/JournalForm'
import { prisma } from '@app/db.server'
import { Routes } from '@app/services/routes.service'
import { journalCrudSchema } from '@app/types/journals'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import { sleep } from '@app/utils/server.utils/async.utils'
import { getFormData } from '@app/utils/server.utils/forms.utils'
import { redirect, type ActionFunctionArgs } from '@remix-run/node'

const validateRequest = async (ctx: ActionFunctionArgs) => {
  const { authProfile, user } = await getAccountInfo(ctx.request)
  if (!user || !authProfile) {
    throw redirect(Routes.logout)
  }
  return { user, authProfile }
}

export const action = async (ctx: ActionFunctionArgs) => {
  const { user } = await validateRequest(ctx)
  const body = await getFormData(ctx, journalCrudSchema)
  switch (body._action) {
    case 'CREATE_JOURNAL': {
      await sleep(350)
      const data = body.data
      await prisma.journal.create({
        data: {
          user_id: user.id,
          title: data.title,
          body: data.body,
          metadata: {
            date_of_experience: data.date_of_experience,
            modalities: data.modalities,
            intention: data.intention,
            setting: data.setting,
          },
          public: data.public,
        },
      })
      return redirect('/journals')
    }
    case 'SAVE_DRAFT': {
      await sleep(350)
      const data = body.data
      await prisma.journal.create({
        data: {
          status: 'DRAFT',
          user_id: user.id,
          title: data.title,
          body: data.body,
          metadata: {
            date_of_experience: data.date_of_experience,
            modalities: data.modalities,
            intention: data.intention,
            setting: data.setting,
          },
        },
      })
      return redirect(`/users/${user.id}?type=draft`)
    }
    default:
      return null
  }
}

export default function NewJournalPage() {
  return (
    <div className="flex h-max min-h-full w-full flex-1 flex-col items-center">
      <div className="flex h-full min-h-full w-full max-w-[640px] flex-1 flex-col gap-y-3 px-0 py-6 md:px-6">
        <div className="flex size-full min-h-full flex-1 flex-col rounded-md border bg-white px-4 py-3 shadow">
          <div className="flex h-max min-h-full w-full flex-1 flex-col gap-y-2 p-5">
            <h1 className="font-foreground font-medium text-2xl">{'New Journal Entry'}</h1>
            <div className="w-full">
              <p className="mb-2 border-l border-l-2 border-violet-400 pl-4 text-sm font-normal italic text-foreground/60">
                {'Fill out the form below and click publish when you are done.'}
              </p>
            </div>
            <Separator className="mb-3" />
            <JournalForm />
          </div>
        </div>
      </div>
    </div>
  )
}
