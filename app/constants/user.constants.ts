import { EducationLevel, Ethnicity, Gender } from '@app/types/users'

export const GENDER = {
  [Gender.MALE]: 'Male',
  [Gender.FEMALE]: 'Female',
  [Gender.OTHER]: 'Other',
}

export const EDUCATION_LEVEL = {
  [EducationLevel.NO_HIGH_SCHOOL]: 'No high school',
  [EducationLevel.SOME_HIGH_SCOOL]: 'Some high school',
  [EducationLevel.HIGH_SCOOL]: 'High school',
  [EducationLevel.SOME_COLLEGE]: 'Some college',
  [EducationLevel.COLLEGE]: 'College degree',
  [EducationLevel.MASTERS]: 'Masters degree',
  [EducationLevel.PHD]: 'PhD',
}

export const ETHNICITY = {
  [Ethnicity.ASIAN]: 'Asian',
  [Ethnicity.BLACK]: 'Black',
  [Ethnicity.HISPANIC]: 'Hispanic',
  [Ethnicity.PACIFIC_ISLANDER]: 'Pacific Islander',
  [Ethnicity.WHITE]: 'White',
}
