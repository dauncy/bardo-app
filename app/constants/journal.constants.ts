import { TripDosage, TripIntention, TripModality, TripSetting } from '@app/types/journals'

export const MODALITIES: Record<string, string> = {
  [TripModality.AYAHUASCA_OR_DMT]: 'Ayahuasca or N,N-dimethryltryptamine (DMT)',
  [TripModality.KETAMINE]: 'Ketamine',
  [TripModality.LSD]: 'D-lysergic acid diethylamide (LSD)',
  [TripModality.MDMA]: 'Ecstacy or MDMA',
  [TripModality.PEYOTE_OR_MESCALINE]: 'Peyote or Mescaline',
  [TripModality.PSILOCYBIN]: 'Psilocybin or magic mushrooms',
}

export const DOSAGE: Record<string, string> = {
  [TripDosage.LOW]: 'Low',
  [TripDosage.MICRO]: 'Micro',
  [TripDosage.HIGH]: 'High',
  [TripDosage.HEROIC]: 'Heroic',
}

export const SETTING: Record<string, string> = {
  [TripSetting.CLINIC]: 'Clinic',
  [TripSetting.CONCERT_OR_FESTIVAL]: 'Concert or festival',
  [TripSetting.INDOORS]: 'Indoors',
  [TripSetting.NATURE]: 'Nature or outdoors',
}

export const INTENTION: Record<string, string> = {
  [TripIntention.CURIOSITY]: 'Curiosity',
  [TripIntention.RECREATION]: 'Recreational',
  [TripIntention.SPIRITUAL]: 'Spiritual',
  [TripIntention.THERAPY]: 'Theraputic',
}
