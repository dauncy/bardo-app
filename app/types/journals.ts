import type { Prisma } from '@prisma/client'
import { z } from 'zod'

export enum TripModality {
  LSD = 'LSD',
  PSILOCYBIN = 'PSILOCYBIN',
  MDMA = 'MDMA',
  MESCALINE = 'MESCALINE',
  KETAMINE = 'KETAMINE',
  PEYOTE = 'PEYOTE',
  DMT = 'DMT',
  AYAHUASCA = 'AYAHUASCA',
}

export enum TripIntention {
  THERAPY = 'THERAPY',
  RECREATION = 'RECREATION',
  CURIOSITY = 'CURIOSITY',
  SPIRITUAL = 'SPIRITUAL',
}

export enum TripSetting {
  NATURE = 'NATURE',
  CONCERT_OR_FESTIVAL = 'CONCERT_OR_FESTIVAL',
  CLINIC = 'CLINIC',
}

export enum TripDosage {
  MICRO = 'MICRO',
  LOW = 'LOW',
  HIGH = 'HIGH',
  HEROIC = 'HEROIC',
}

export const journalCrudSchema = z.discriminatedUnion('_action', [
  z.object({
    _action: z.literal('CREATE_JOURNAL'),
    data: z.object({
      title: z.string().optional(),
      body: z.string(),
      modalities: z
        .object({
          modality: z.enum([
            TripModality.LSD,
            TripModality.PSILOCYBIN,
            TripModality.MDMA,
            TripModality.MESCALINE,
            TripModality.KETAMINE,
            TripModality.PEYOTE,
            TripModality.DMT,
            TripModality.AYAHUASCA,
          ]),
          dosage: z.enum([TripDosage.HEROIC, TripDosage.HIGH, TripDosage.LOW, TripDosage.MICRO]),
        })
        .array(),
      date_of_experience: z.coerce.date(),
      intention: z.string(),
      setting: z.string(),
      public: z.coerce.boolean(),
    }),
  }),
  z.object({
    _action: z.literal('SAVE_DRAFT'),
    data: z.object({
      title: z.string().optional(),
      body: z.string().optional(),
      modality: z.string().optional(),
      intention: z.string().optional(),
      dosage: z.string().optional(),
      setting: z.string().optional(),
    }),
  }),
  z.object({
    _action: z.literal('UPDATE_JOURNAL'),
    data: z.object({
      title: z.string().optional(),
      body: z.string(),
      modality: z.string(),
      intention: z.string(),
      dosage: z.string(),
      setting: z.string(),
    }),
  }),
  z.object({
    _action: z.literal('DELETE_JOURNAL'),
    data: z.object({
      id: z.string(),
    }),
  }),
])

export type JournalWithUser = Prisma.JournalGetPayload<{
  select: {
    id: true
    metadata: true
    title: true
    body: true
    updated_at: true
    created_at: true
    user: {
      select: {
        id: true
        name: true
        picture: true
        user_id: true
      }
    }
  }
}>
