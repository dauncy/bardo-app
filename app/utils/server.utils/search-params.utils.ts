import type { LoaderFunctionArgs } from '@remix-run/node'
import { parse } from 'qs'
import type { z, ZodObject, ZodRawShape } from 'zod'

export const getDynamicParams = <T extends ZodRawShape>(
  ctx: LoaderFunctionArgs,
  schema: ZodObject<T>,
): z.infer<typeof schema> => {
  const params = ctx.params
  const parsed = schema.parse(params)
  return parsed
}

export const getSearchParams = <T extends ZodRawShape>(
  ctx: LoaderFunctionArgs,
  schema: ZodObject<T>,
): z.infer<typeof schema> => {
  const url = new URL(ctx.request.url)
  const params = new URLSearchParams(url.search)
  const body = parse(params.toString())
  const parsed = schema.parse(body)
  return parsed
}
