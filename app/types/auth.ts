import { z } from 'zod'

export const authenticateSchema = z.object({
  idToken: z.string(),
})

export enum AuthStep {
  INTIAL = 'INTIAL',
  SIGN_IN = 'SIGN_IN',
  SIGN_UP = 'SIGN_UP',
}
