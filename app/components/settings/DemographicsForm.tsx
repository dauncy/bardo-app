/* eslint-disable react/jsx-pascal-case */
import { Button } from '@app/components/bardo/Button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@app/components/bardo/Form'
import { Icons } from '@app/components/bardo/Icons'
import { Label } from '@app/components/bardo/Label'
import { RadioGroup, RadioGroupItem } from '@app/components/bardo/Radio'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@app/components/bardo/Select'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { ClientOnly } from '@app/components/utility/ClientOnly'
import type { UserCrudPayload } from '@app/types/users'
import { EducationLevel, Ethnicity, Gender } from '@app/types/users'
import { zodResolver } from '@hookform/resolvers/zod'
import type { User } from '@prisma/client'
import { UserOnboardingStep } from '@prisma/client'
import { useFetcher, useOutletContext } from '@remix-run/react'
import { stringify } from 'qs'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const demographicsFormSchema = z.object({
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional(),
  race: z
    .enum([Ethnicity.WHITE, Ethnicity.BLACK, Ethnicity.HISPANIC, Ethnicity.PACIFIC_ISLANDER, Ethnicity.ASIAN])
    .optional(),
  education_level: z
    .enum([
      EducationLevel.SOME_HIGH_SCOOL,
      EducationLevel.NO_HIGH_SCHOOL,
      EducationLevel.HIGH_SCOOL,
      EducationLevel.SOME_COLLEGE,
      EducationLevel.COLLEGE,
      EducationLevel.MASTERS,
      EducationLevel.PHD,
    ])
    .optional(),
  date_of_birth: z
    .object({
      day: z.number().optional(),
      month: z.number().optional(),
      year: z.number().optional(),
    })
    .optional(),
})

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const defaultDays = Array.from({ length: 31 }, (_, index) => index + 1)

export const DemographicsForm = () => {
  const { currentUser } = useOutletContext<{ currentUser: User }>()
  const userMetadata = currentUser.metadata
  const fetcher = useFetcher()
  const pending = fetcher.state === 'loading' || fetcher.state === 'submitting'

  const [days, setDays] = useState(defaultDays)

  const defaultDOB = () => {
    if (!userMetadata.date_of_birth) {
      return undefined
    }
    const date = new Date(userMetadata.date_of_birth)
    const day = date.getUTCDate()
    const month = date.getUTCMonth() + 1
    const year = date.getUTCFullYear()
    return {
      day,
      month,
      year,
    }
  }

  const form = useForm<z.infer<typeof demographicsFormSchema>>({
    resolver: zodResolver(demographicsFormSchema),
    defaultValues: {
      gender: userMetadata.gender,
      race: userMetadata.ethnicity,
      education_level: userMetadata.education_level,
      date_of_birth: defaultDOB(),
    },
  })

  const validateDob = (dob?: { day?: number; year?: number; month?: number }): boolean => {
    if (!dob) {
      return true
    }
    if (!dob.day && !dob.month && !dob.year) {
      return true
    }

    if (dob.day && dob.month && dob.year) {
      return true
    }
    return false
  }

  const formatDob = (dob?: { day?: number; year?: number; month?: number }) => {
    if (dob?.day && dob.month && dob.year) {
      const date = new Date(dob.year, dob.month - 1, dob.day)
      return date
    }
    return null
  }

  const onSubmit = async (data: z.infer<typeof demographicsFormSchema>) => {
    if (!validateDob(data.date_of_birth)) {
      form.setError('root', { message: 'Please enter a valid date.' })
      return
    }

    const date_of_birth = formatDob(data.date_of_birth) ?? undefined

    const payload: UserCrudPayload = {
      _action: 'UPDATE_DEMOGRAPHICS',
      data: {
        date_of_birth,
        gender: data.gender,
        ethnicity: data.race,
        education_level: data.education_level,
      },
    }

    fetcher.submit(stringify(payload), { method: 'POST' })
  }

  const currentYear = new Date().getFullYear()
  const yearsAgo = 100
  const yearsArray = Array.from({ length: yearsAgo + 1 }, (_, index) => currentYear - index)

  const getDayOptions = useCallback(() => {
    const values = form.getValues()
    if (!values.date_of_birth?.year || !values.date_of_birth.month) {
      return
    }

    const daysInMonth = new Date(values.date_of_birth.year, values.date_of_birth.month, 0).getDate()
    const dayOptions = Array.from({ length: daysInMonth }, (_, index) => index + 1)

    if (values.date_of_birth.day && values.date_of_birth.day > dayOptions.length) {
      form.resetField('date_of_birth.day')
    }

    setDays(dayOptions)
  }, [form])

  useEffect(() => {
    getDayOptions()
  }, [getDayOptions, userMetadata])

  return (
    <ClientOnly>
      {() => (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-y-5 md:gap-y-8">
            <FormField
              control={form.control}
              name={'gender'}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-1 space-y-0 md:gap-y-2">
                  <TypographyParagraph size={'medium'} className="font-medium leading-none text-foreground">
                    {'Gender'}
                  </TypographyParagraph>
                  <FormControl>
                    <RadioGroup
                      onValueChange={value => field.onChange(value)}
                      defaultValue={form.formState.defaultValues?.gender}
                    >
                      {Object.values(Gender).map(value => (
                        <div className="flex items-center space-x-2" key={value}>
                          <RadioGroupItem value={value} id={value} />
                          <Label htmlFor={value}>{value.split('_').join(' ')}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'race'}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-1 space-y-0 md:gap-y-2">
                  <TypographyParagraph size={'medium'} className="font-medium leading-none text-foreground">
                    {'Ethnicity'}
                  </TypographyParagraph>
                  <FormControl className="p-0">
                    <Select onValueChange={value => field.onChange(value)} value={field.value}>
                      <SelectTrigger className="max-w-[302px]">
                        <SelectValue placeholder={'Select your race'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{'Select your race'}</SelectLabel>
                          {Object.values(Ethnicity).map(option => (
                            <SelectItem key={option} value={option}>
                              {option.split('_').join(' ')}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'education_level'}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-1 space-y-0 md:gap-y-2">
                  <TypographyParagraph size={'medium'} className="font-medium leading-none text-foreground">
                    {'Highest Level of Education'}
                  </TypographyParagraph>
                  <FormControl>
                    <Select
                      onValueChange={value => {
                        form.setValue('education_level', value as EducationLevel)
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="max-w-[302px]">
                        <SelectValue placeholder={'Select the highest that applies'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{'Select the highest level of education that applies'}</SelectLabel>
                          {Object.values(EducationLevel).map(option => (
                            <SelectItem key={option} value={option}>
                              {option.split('_').join(' ')}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-y-1 md:gap-y-2">
              <TypographyParagraph size={'medium'} className="font-medium leading-none text-foreground">
                {'Date of Birth'}
              </TypographyParagraph>
              <div className="flex items-center gap-x-4">
                <FormField
                  control={form.control}
                  name={'date_of_birth.month'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          defaultValue={
                            form.formState.defaultValues?.date_of_birth?.month
                              ? `${form.formState.defaultValues?.date_of_birth?.month}`
                              : undefined
                          }
                          onValueChange={value => {
                            const month = parseInt(value)
                            field.onChange(month)
                            getDayOptions()
                          }}
                        >
                          <SelectTrigger className="w-fit md:w-32">
                            <SelectValue placeholder={'MM'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>{'Month'}</SelectLabel>
                              {months.map(month => (
                                <SelectItem key={`month-${month}`} value={`${month}`}>
                                  {`${month < 10 ? '0' : ''}${month}`}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'date_of_birth.day'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          defaultValue={
                            form.formState.defaultValues?.date_of_birth?.day
                              ? `${form.formState.defaultValues?.date_of_birth?.day}`
                              : undefined
                          }
                          onValueChange={value => {
                            const day = parseInt(value)
                            field.onChange(day)
                          }}
                        >
                          <SelectTrigger className="w-fit md:w-32">
                            <SelectValue placeholder={'DD'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>{'Day'}</SelectLabel>
                              {days.map(day => (
                                <SelectItem key={`day-${day}`} value={`${day}`}>
                                  {`${day < 10 ? '0' : ''}${day}`}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'date_of_birth.year'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          defaultValue={
                            form.formState.defaultValues?.date_of_birth?.year
                              ? `${form.formState.defaultValues?.date_of_birth?.year}`
                              : undefined
                          }
                          onValueChange={value => {
                            const year = parseInt(value)
                            field.onChange(year)
                            getDayOptions()
                          }}
                        >
                          <SelectTrigger className="w-fit md:w-32">
                            <SelectValue placeholder={'YYYY'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>{'Year'}</SelectLabel>
                              {yearsArray.map(year => (
                                <SelectItem key={`year-${year}`} value={`${year}`}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {form.formState.errors.root && (
              <div className="-mt-5 flex w-full items-center gap-x-2 rounded-xl border border-destructive p-2">
                <Icons.alertCircle className="size-4 text-destructive" />
                <TypographyParagraph size={'extraSmall'} className="font-medium text-destructive">
                  {form.formState.errors.root.message}
                </TypographyParagraph>
              </div>
            )}
            <Button
              type={'submit'}
              variant={'bardo_primary'}
              className="flex w-full items-center gap-x-2 md:ml-auto md:max-w-48"
              disabled={pending}
            >
              {pending && <Icons.loader className="size 4 animate-spin text-white/90" />}
              {currentUser.onboarding_step === UserOnboardingStep.DEMOGRAPHICS ? 'Done' : 'Update'}
            </Button>
          </form>
        </Form>
      )}
    </ClientOnly>
  )
}
