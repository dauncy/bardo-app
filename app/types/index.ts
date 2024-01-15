import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import type { TripDosage, TripIntention, TripModality, TripSetting } from './journals'

declare global {
  interface Window {
    ENV: {
      [key: string]: string
    }
  }
}

declare global {
  namespace PrismaJson {
    type JournalMetadata = {
      modality: TripModality | string;
      intention: TripIntention | string;
      setting: TripSetting | string;
      dosage: TripDosage
    }
  }
}

export type Nullable<T> = T | null

export type RequestCtx = LoaderFunctionArgs | ActionFunctionArgs
