import { z } from 'zod'

export interface UserDTO {
  fbUid: string
  email: string
  picture: string
  name: string
}

export const userCrudSchema = z.discriminatedUnion('_action', [
  z.object({
    _action: z.literal('UPDATE_USER'),
    data: z.object({
      name: z.string().min(3).max(24),
    }),
  }),
  z.object({
    _action: z.literal('DELETE_USER'),
  }),
])

export type UserCrudPayload = z.infer<typeof userCrudSchema>
