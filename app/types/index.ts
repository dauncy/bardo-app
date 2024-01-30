import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'

declare global {
  interface Window {
    ENV: {
      [key: string]: string
    }
  }
}

export type Nullable<T> = T | null

export type RequestCtx = LoaderFunctionArgs | ActionFunctionArgs
