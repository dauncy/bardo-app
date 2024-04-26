import { prisma } from '@app/db.server'
import type { ExportedUser } from '@app/types/admin'
import { adminActionSchema } from '@app/types/admin'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import { getJsonData } from '@app/utils/server.utils/forms.utils'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json2csv } from 'json-2-csv'
import os from 'node:os'
import path from 'path'
import { promises as fs } from 'fs'
import type { ExportedJournal } from '@app/types/journals'

const validateRequest = async (ctx: LoaderFunctionArgs) => {
  const { user, authProfile } = await getAccountInfo(ctx.request)
  if (!user || !authProfile) {
    throw redirect('/')
  }

  return { user }
}

export const action = async (ctx: ActionFunctionArgs) => {
  const { user } = await validateRequest(ctx)
  const { _action } = await getJsonData(ctx, adminActionSchema)

  const osTempDir = os.tmpdir()
  const tempDir = await fs.mkdtemp(path.join(osTempDir, `/${user.id}`))

  switch (_action) {
    case 'EXPORT_USERS': {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          metadata: true,
          created_at: true,
        },
      })

      const sanitizedUsers: ExportedUser[] = users.map(u => {
        const date_of_birth = u.metadata.date_of_birth
        return {
          id: u.id,
          date_of_birth: date_of_birth ? new Date(date_of_birth).toISOString() : '',
          gender: u.metadata.gender ?? '',
          ethnicity: u.metadata.ethnicity ?? '',
          education_level: u.metadata.education_level ?? '',
          created_at: u.created_at.toISOString(),
        }
      })

      const csv = json2csv(sanitizedUsers)
      const tempCSV = `${tempDir}/exported-users.csv`
      await fs.writeFile(tempCSV, csv)
      const buffer = await fs.readFile(tempCSV)
      return new Response(buffer, { status: 200 })
    }
    case 'EXPORT_JOURNALS': {
      const journals = await prisma.journal.findMany({
        select: {
          id: true,
          user_id: true,
          title: true,
          body: true,
          public: true,
          status: true,
          created_at: true,
          metadata: true,
        },
      })

      const sanitized: ExportedJournal[] = journals.map(j => {
        const date_of_experience = j.metadata.date_of_experience
        return {
          id: j.id,
          title: j.title ?? '',
          body: j.body ?? '',
          date_of_experience: date_of_experience ? new Date(date_of_experience).toISOString() : '',
          created_at: new Date(j.created_at).toISOString(),
          modalities: (j.metadata.modalities ?? [])?.map(m => {
            return {
              modality: m?.modality ?? '',
              dosage: m?.dosage ?? '',
            }
          }),
          intention: j.metadata.intention ?? '',
          setting: j.metadata.setting ?? '',
          public: String(j.public).toUpperCase() as 'TRUE' | 'FALSE',
          status: j.status,
        }
      })
      const csv = json2csv(sanitized)
      const tempCSV = `${tempDir}/exported-journals.csv`
      await fs.writeFile(tempCSV, csv)
      const buffer = await fs.readFile(tempCSV)
      return new Response(buffer, { status: 200 })
    }
    default:
      return null
  }
}
