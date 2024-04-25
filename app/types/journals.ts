import type { Prisma } from '@prisma/client'
import { z } from 'zod'

export enum TripModality {
  LSD = 'LSD',
  PSILOCYBIN = 'PSILOCYBIN',
  MDMA = 'MDMA',
  KETAMINE = 'KETAMINE',
  PEYOTE_OR_MESCALINE = 'PEYOTE_OR_MESCALINE',
  AYAHUASCA_OR_DMT = 'AYAHUASCA_OR_DMT',
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
  INDOORS = 'INDOORS',
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
          modality: 
          z.union([
            z.string(),
            z.enum([
              TripModality.LSD,
              TripModality.PSILOCYBIN,
              TripModality.MDMA,
              TripModality.KETAMINE,
              TripModality.PEYOTE_OR_MESCALINE,
              TripModality.AYAHUASCA_OR_DMT,
            ]),
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
      modalities: z
        .object({
          modality: z.union([
            z.string(),
            z.enum([
              TripModality.LSD,
              TripModality.PSILOCYBIN,
              TripModality.MDMA,
              TripModality.KETAMINE,
              TripModality.PEYOTE_OR_MESCALINE,
              TripModality.AYAHUASCA_OR_DMT,
            ]),
          ]),
          dosage: z.enum([TripDosage.HEROIC, TripDosage.HIGH, TripDosage.LOW, TripDosage.MICRO]).optional(),
        })
        .array()
        .optional(),
      date_of_experience: z.coerce.date().optional(),
      intention: z.string().optional(),
      setting: z.string().optional(),
      public: z.coerce.boolean(),
    }),
  }),
  z.object({
    _action: z.literal('UPDATE_JOURNAL'),
    data: z.object({
      title: z.string().optional(),
      body: z.string(),
      modalities: z
        .object({
          modality: z.union([
            z.string(),
            z.enum([
              TripModality.LSD,
              TripModality.PSILOCYBIN,
              TripModality.MDMA,
              TripModality.KETAMINE,
              TripModality.PEYOTE_OR_MESCALINE,
              TripModality.AYAHUASCA_OR_DMT,
            ]),
          ]),
          dosage: z.enum([TripDosage.HEROIC, TripDosage.HIGH, TripDosage.LOW, TripDosage.MICRO]),
        })
        .array(),
      date_of_experience: z.coerce.date(),
      intention: z.union([
        z.enum([TripIntention.CURIOSITY, TripIntention.RECREATION, TripIntention.SPIRITUAL, TripIntention.SPIRITUAL]),
        z.string(),
      ]),
      setting: z.string(),
      public: z.coerce.boolean(),
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
        created_at: true
      }
    }
  }
}>

export type JournalWithUserEditable = Prisma.JournalGetPayload<{
  select: {
    id: true
    metadata: true
    title: true
    body: true
    status: true
    public: true
    updated_at: true
    created_at: true
    user: {
      select: {
        id: true
        name: true
        picture: true
        user_id: true
        created_at: true
      }
    }
  }
}>
