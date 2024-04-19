import type { LoaderFunctionArgs } from '@remix-run/node'
import type { z, ZodObject, ZodRawShape } from 'zod'

export const getSearchParams = <T extends ZodRawShape>(
  ctx: LoaderFunctionArgs,
  schema: ZodObject<T>,
): z.infer<typeof schema> => {
  const params = ctx.params
  const parsed = schema.parse(params)
  return parsed
}
