import type { ActionFunctionArgs } from '@remix-run/node'
import { parse } from 'qs'
import type { ZodDiscriminatedUnion, ZodDiscriminatedUnionOption, z } from 'zod'

export const getFormData = async <T extends ZodDiscriminatedUnionOption<string>[]>(
  ctx: ActionFunctionArgs,
  zodSchema: ZodDiscriminatedUnion<string, T>,
): Promise<z.infer<typeof zodSchema>> => {
  const body = await ctx.request.text()
  const json = parse(body)
  const parsed = zodSchema.parse(json)
  return parsed
}
