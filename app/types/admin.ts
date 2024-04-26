import { z } from 'zod'
import type { EducationLevel, Ethnicity, Gender } from './users'

export const adminActionSchema = z.discriminatedUnion('_action', [
  z.object({
    _action: z.literal('EXPORT_USERS'),
  }),
  z.object({
    _action: z.literal('EXPORT_JOURNALS'),
  }),
])

export type ExportedUser = {
  id: string
  created_at: string
  gender: Gender | string
  date_of_birth: string
  education_level: EducationLevel | string
  ethnicity: Ethnicity | string
}
