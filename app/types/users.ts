import type { Prisma } from '@prisma/client'
import { z } from 'zod'

export interface UserDTO {
  fbUid: string
  email: string
  picture: string
  name: string
}

export enum EducationLevel {
  NO_HIGH_SCHOOL = 'no_high_scool',
  SOME_HIGH_SCOOL = 'some_high_school',
  HIGH_SCOOL = 'high_scool',
  SOME_COLLEGE = 'some_college',
  COLLEGE = 'college',
  MASTERS = 'masters',
  PHD = 'PhD',
}

export enum Ethnicity {
  WHITE = 'white',
  BLACK = 'black',
  ASIAN = 'asian',
  HISPANIC = 'hispanic',
  PACIFIC_ISLANDER = 'pacific_islander',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export const userCrudSchema = z.discriminatedUnion('_action', [
  z.object({
    _action: z.literal('UPDATE_USER'),
    data: z.object({
      name: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(24, 'Username cannot be longer than 24 characters'),
    }),
  }),
  z.object({
    _action: z.literal('UPDATE_DEMOGRAPHICS'),
    data: z
      .object({
        gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional(),
        education_level: z
          .enum([
            EducationLevel.NO_HIGH_SCHOOL,
            EducationLevel.SOME_HIGH_SCOOL,
            EducationLevel.HIGH_SCOOL,
            EducationLevel.SOME_COLLEGE,
            EducationLevel.COLLEGE,
            EducationLevel.MASTERS,
            EducationLevel.PHD,
          ])
          .optional(),
        ethnicity: z
          .enum([Ethnicity.WHITE, Ethnicity.BLACK, Ethnicity.ASIAN, Ethnicity.HISPANIC, Ethnicity.PACIFIC_ISLANDER])
          .optional(),
        date_of_birth: z.coerce.date().optional(),
      })
      .optional(),
  }),
  z.object({
    _action: z.literal('DELETE_USER'),
  }),
  z.object({
    _action: z.literal('COMPLETE_ONBOARDING'),
    data: z.object({
      redirect_to: z.enum(['/journals', '/journals/new']),
    }),
  }),
])

export type UserCrudPayload = z.infer<typeof userCrudSchema>

export const UserRouteParamsSchema = z.object({ userId: z.string() })

export interface UserMetada {
  date_of_birth?: Date
  gender?: Gender
  ethnicity?: Ethnicity
  education_level?: EducationLevel
}

export type PublicUser = Prisma.UserGetPayload<{
  select: {
    created_at: true
    id: true
    name: true
    picture: true
    user_id: true
  }
}>
