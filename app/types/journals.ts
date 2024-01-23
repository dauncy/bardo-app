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
      modality: z.string(),
      intention: z.string(),
      dosage: z.string(),
      setting: z.string(),
    }),
  }),
])
