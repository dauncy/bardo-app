/* eslint-disable react/jsx-pascal-case */
import { z } from 'zod'
import { ClientOnly } from '../utility/ClientOnly'
import type { JournalWithUserEditable, journalCrudSchema } from '@app/types/journals'
import { TripDosage, TripIntention, TripModality, TripSetting } from '@app/types/journals'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '../bardo/Form'
import { TypographyParagraph } from '../bardo/typography/TypographyParagraph'
import { Input } from '../bardo/Input'
import { Button } from '../bardo/Button'
import { HintPopover, SelectWithHint } from './SelectWithHint'
import { Textarea } from '../bardo/Textarea'
import { Fragment, useCallback, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../bardo/Select'
import { Switch } from '../bardo/Switch'
import { JournalStatus } from '@prisma/client'
import { useFetcher } from '@remix-run/react'
import { Icons } from '../bardo/Icons'
import { Accordion } from '../bardo/Accordion'
import { ModalitySelect } from './ModalitySelect'
import { useToast } from '../bardo/toast/use-toast'
import { stringify } from 'qs'
import type { SerializeFrom } from '@remix-run/node'
import { INTENTION, SETTING } from '@app/constants/journal.constants'

const journalFormSchema = z.object({
  title: z.string().min(1, 'Please enter a title.'),
  body: z.string().min(0, 'Please share a little bit about your experience.'),
  metadata: z.object({
    modalities: z
      .object({
        modality: z.enum([
          TripModality.AYAHUASCA_OR_DMT,
          TripModality.KETAMINE,
          TripModality.LSD,
          TripModality.MDMA,
          TripModality.PEYOTE_OR_MESCALINE,
          TripModality.PSILOCYBIN,
        ]),
        dosage: z.enum([TripDosage.MICRO, TripDosage.LOW, TripDosage.HIGH, TripDosage.HEROIC]),
      })
      .array()
      .min(1, 'Required.'),
    setting: z.enum([TripSetting.CLINIC, TripSetting.CONCERT_OR_FESTIVAL, TripSetting.NATURE, TripSetting.INDOORS]),
    intention: z.enum([
      TripIntention.CURIOSITY,
      TripIntention.RECREATION,
      TripIntention.SPIRITUAL,
      TripIntention.THERAPY,
    ]),
  }),
  date_of_experience: z.object({
    day: z.number(),
    month: z.number(),
    year: z.number(),
  }),
  public: z.boolean(),
  status: z.enum([JournalStatus.DRAFT, JournalStatus.PUBLISHED]),
})

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const defaultDays = Array.from({ length: 31 }, (_, index) => index + 1)

export const JournalForm = ({
  journal,
  onUpdate,
}: {
  journal?: SerializeFrom<JournalWithUserEditable>
  onUpdate?: (data: z.infer<typeof journalCrudSchema>) => void
}) => {
  const { toast } = useToast()
  const [days, setDays] = useState(defaultDays)
  const [modalityErrors, setModalityErrors] = useState<{ modality: TripModality; error: string }[]>([])
  const fetcher = useFetcher()
  const pending = fetcher.state === 'loading' || fetcher.state === 'submitting'

  const defaultDateOfExperience = () => {
    if (!journal?.metadata?.date_of_experience) {
      return undefined
    }
    const date = new Date(journal.metadata.date_of_experience)
    const day = date.getUTCDate()
    const month = date.getUTCMonth() + 1
    const year = date.getUTCFullYear()
    return {
      day,
      month,
      year,
    }
  }
  const form = useForm<z.infer<typeof journalFormSchema>>({
    resolver: zodResolver(journalFormSchema),
    defaultValues: {
      public: journal?.public ?? true,
      title: journal?.title ?? undefined,
      body: journal?.body ?? undefined,
      metadata: {
        intention: (journal?.metadata?.intention ?? undefined) as TripIntention,
        modalities: journal?.metadata?.modalities ?? undefined,
        setting: (journal?.metadata.setting ?? undefined) as TripSetting,
      },
      date_of_experience: defaultDateOfExperience(),
    },
  })

  const formatDateOfExperience = (date_of_experience?: { day?: number; year?: number; month?: number }) => {
    if (date_of_experience?.day && date_of_experience.month && date_of_experience.year) {
      const date = new Date(date_of_experience.year, date_of_experience.month - 1, date_of_experience.day)
      return date
    }
    return null
  }

  const onSubmit = (data: z.infer<typeof journalFormSchema>) => {
    const modalities = data.metadata.modalities
    if (!modalities || modalities.length == 0) {
      form.setError('metadata.modalities', { message: 'Required' })
      return
    }

    if (!data.title || !data.body) {
      return
    }

    const date = formatDateOfExperience(data.date_of_experience)
    if (!date) {
      form.setError('date_of_experience', { message: 'Enter a valid date.' })
      return
    }

    if (onUpdate) {
      const updatePayload: z.infer<typeof journalCrudSchema> = {
        _action: 'UPDATE_JOURNAL',
        data: {
          title: data.title,
          date_of_experience: date,
          public: data.public,
          body: data.body,
          modalities: modalities,
          intention: data.metadata.intention,
          setting: data.metadata.setting,
        },
      }
      onUpdate(updatePayload)
      return null
    }

    const payload: z.infer<typeof journalCrudSchema> = {
      _action: 'CREATE_JOURNAL',
      data: {
        title: data.title,
        date_of_experience: date,
        public: data.public,
        body: data.body,
        modalities: modalities,
        intention: data.metadata.intention,
        setting: data.metadata.setting,
      },
    }
    fetcher.submit(stringify(payload), { method: 'POST' })
    return null
  }

  const currentYear = new Date().getFullYear()
  const yearsAgo = 100
  const yearsArray = Array.from({ length: yearsAgo + 1 }, (_, index) => currentYear - index)

  const getDayOptions = useCallback(() => {
    const values = form.getValues()
    if (!values.date_of_experience.year || !values.date_of_experience.month) {
      return
    }

    const daysInMonth = new Date(values.date_of_experience.year, values.date_of_experience.month, 0).getDate()
    const dayOptions = Array.from({ length: daysInMonth }, (_, index) => index + 1)

    if (values.date_of_experience.day && values.date_of_experience.day > dayOptions.length) {
      form.resetField('date_of_experience.day')
    }

    setDays(dayOptions)
  }, [form])

  const handleModalities = (modalities: TripModality[]) => {
    const formModalities = form.getValues().metadata.modalities ?? []
    const updatedModalities: { modality: TripModality; dosage: TripDosage }[] = []
    const modalitiesToAppend: { modality: TripModality; dosage?: TripDosage }[] = []

    for (const modality of formModalities) {
      const removed = modalities.find(m => m === modality.modality) === undefined
      if (removed) {
        continue
      }
      updatedModalities.push(modality)
    }

    for (const m of modalities) {
      const alreadyInList = updatedModalities.find(modality => modality.modality === m) !== undefined
      if (alreadyInList) {
        continue
      }
      const maybeDosage = form.formState.defaultValues?.metadata?.modalities?.find(mod => mod?.modality === m)?.dosage
      modalitiesToAppend.push({ modality: m, dosage: maybeDosage })
    }

    //@ts-ignore
    form.setValue('metadata.modalities', [...updatedModalities, ...modalitiesToAppend])
  }

  const handleDosage = ({ dosage, modality }: { dosage: TripDosage; modality: TripModality }) => {
    const formModalities = form.getValues().metadata.modalities ?? []
    const updatedModalities: { modality: TripModality; dosage: TripDosage }[] = []
    for (const m of formModalities) {
      if (m.modality === modality && !m.dosage) {
        updatedModalities.push({ dosage, modality })
      }

      if (m.modality !== modality) {
        updatedModalities.push(m)
      }
    }
    form.setValue('metadata.modalities', updatedModalities)
    setModalityErrors(prev => [...prev].filter(e => e.modality !== modality))
  }

  const handleSaveAsDraft = () => {
    const canSaveAsDraft = () => {
      const { title, body, metadata, date_of_experience } = form.getValues()
      const date = formatDateOfExperience(date_of_experience)
      const modalities = metadata?.modalities ?? []
      const intention = metadata?.intention
      const setting = metadata?.setting
      const validTitle = () => {
        return title && title.trim().length > 0
      }

      const validBody = () => {
        return body && body.trim().length > 0
      }
      if (!validTitle() && !validBody() && modalities.length === 0 && !intention && !setting && !date) {
        return false
      }

      return true
    }

    if (!canSaveAsDraft()) {
      toast({
        variant: 'destructive',
        title: 'Unable to save draft',
        description: 'Please fill out at least one of the fields to save a draft.',
      })
      return
    }

    const { title, body, metadata, date_of_experience, public: pub } = form.getValues()
    const date = formatDateOfExperience(date_of_experience)
    const modalities = metadata?.modalities ?? []
    const intention = metadata?.intention
    const setting = metadata?.setting
    const payload: z.infer<typeof journalCrudSchema> = {
      _action: 'SAVE_DRAFT',
      data: {
        title,
        body,
        date_of_experience: date ?? undefined,
        modalities,
        intention,
        setting,
        public: pub,
      },
    }
    if (onUpdate) {
      onUpdate(payload)
      return null
    }
    fetcher.submit(stringify(payload), { method: 'POST' })
  }

  return (
    <ClientOnly>
      {() => (
        <Form {...form}>
          <div className="flex h-max min-h-full w-full flex-1 flex-col gap-y-8">
            <FormField
              control={form.control}
              name={'title'}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-1">
                  <TypographyParagraph
                    size={'medium'}
                    className="font-medium text-foreground after:ml-0.5 after:text-red-500 after:content-['*']"
                  >
                    {'Title'}
                  </TypographyParagraph>
                  <FormControl>
                    <Input
                      defaultValue={form.formState.defaultValues?.title}
                      autoComplete={'off'}
                      className={`${form.formState.errors.title ? 'border-destructive ring-destructive' : ''}`}
                      placeholder="My first psychedelic trip"
                      onChange={e => field.onChange(e)}
                    />
                  </FormControl>
                  <FormDescription>{'A friendly title.'}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-y-1">
              <TypographyParagraph
                size={'medium'}
                className="font-medium text-foreground after:ml-0.5 after:text-red-500 after:content-['*']"
              >
                {'Date of Experience'}
              </TypographyParagraph>
              <div className="flex w-full items-center gap-x-4">
                <FormField
                  control={form.control}
                  name={'date_of_experience.month'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          defaultValue={
                            form.formState.defaultValues?.date_of_experience?.month
                              ? `${form.formState.defaultValues?.date_of_experience?.month}`
                              : undefined
                          }
                          onValueChange={value => {
                            const month = parseInt(value)
                            field.onChange(month)
                            getDayOptions()
                          }}
                        >
                          <SelectTrigger
                            className={`flex-1 ${form.formState.errors.date_of_experience ? 'border-destructive ring-destructive' : ''}`}
                          >
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
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'date_of_experience.day'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          defaultValue={
                            form.formState.defaultValues?.date_of_experience?.day
                              ? `${form.formState.defaultValues?.date_of_experience?.day}`
                              : undefined
                          }
                          onValueChange={value => {
                            const day = parseInt(value)
                            field.onChange(day)
                          }}
                        >
                          <SelectTrigger
                            className={`flex-1 ${form.formState.errors.date_of_experience ? 'border-destructive ring-destructive' : ''}`}
                          >
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
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'date_of_experience.year'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          defaultValue={
                            form.formState.defaultValues?.date_of_experience?.year
                              ? `${form.formState.defaultValues?.date_of_experience?.year}`
                              : undefined
                          }
                          onValueChange={value => {
                            const year = parseInt(value)
                            field.onChange(year)
                            getDayOptions()
                          }}
                        >
                          <SelectTrigger
                            className={`flex-1 ${form.formState.errors.date_of_experience ? 'border-destructive ring-destructive' : ''}`}
                          >
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
                    </FormItem>
                  )}
                />
              </div>
              <FormDescription>{"If you don't remember, give your best guess."}</FormDescription>
              {form.formState.errors.date_of_experience && (
                <p className="mt-1 font-medium text-[0.8rem] text-destructive">
                  {form.formState.errors.date_of_experience.message ?? 'Please enter a valid date.'}
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name={'metadata.modalities'}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex w-full justify-between">
                    <TypographyParagraph
                      size={'medium'}
                      className="font-medium text-foreground after:ml-0.5 after:text-red-500 after:content-['*']"
                    >
                      {'Modalities'}
                    </TypographyParagraph>
                    <HintPopover hintText={'What psychedelic(s) did you take?'} />
                  </div>

                  <Accordion
                    defaultValue={
                      form.formState.defaultValues?.metadata?.modalities?.map(m => m?.modality ?? '') ?? undefined
                    }
                    type={'multiple'}
                    className="w-full"
                    onValueChange={e => handleModalities(e as TripModality[])}
                  >
                    {Object.values(TripModality).map(value => (
                      <Fragment key={value}>
                        <ModalitySelect
                          defaultValue={
                            form.formState.defaultValues?.metadata?.modalities?.find(m => m?.modality === value)?.dosage
                          }
                          handleDosage={handleDosage}
                          modality={value}
                          modalityErrors={modalityErrors}
                        />
                      </Fragment>
                    ))}
                  </Accordion>
                  <FormDescription>{'Select all that apply'}</FormDescription>
                  {form.formState.errors.metadata?.modalities?.message && (
                    <p className="mt-1 font-medium text-[0.8rem] text-destructive">
                      {form.formState.errors.metadata?.modalities.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'metadata.intention'}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-1">
                  <FormControl>
                    <SelectWithHint
                      defaultValue={form.formState.defaultValues?.metadata?.intention}
                      onValueChange={value => field.onChange(value)}
                      className={`${form.formState.errors.metadata?.intention ? 'border-destructive ring-destructive' : ''}`}
                      label={'Intention'}
                      hintText="What was the reason for your trip"
                      placeholder={'Select Intention'}
                      innerLabel={'Select an Intention'}
                      options={Object.keys(TripIntention).map(key => {
                        return {
                          value: key,
                          label: INTENTION[key] ?? key,
                        }
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'metadata.setting'}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-1">
                  <FormControl>
                    <SelectWithHint
                      defaultValue={form.formState.defaultValues?.metadata?.setting}
                      onValueChange={value => field.onChange(value)}
                      className={`${form.formState.errors.metadata?.setting ? 'border-destructive ring-destructive' : ''}`}
                      label={'Setting'}
                      hintText="Where did you take the psychedelics"
                      placeholder={'Select Setting'}
                      innerLabel={'Select a setting'}
                      options={Object.keys(TripSetting).map(key => {
                        return {
                          value: key,
                          label: SETTING[key] ?? key,
                        }
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'body'}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-1">
                  <TypographyParagraph
                    size={'medium'}
                    className="font-medium text-foreground after:ml-0.5 after:text-red-500 after:content-['*']"
                  >
                    {'Brief Description'}
                  </TypographyParagraph>
                  <FormControl>
                    <Textarea
                      defaultValue={form.formState.defaultValues?.body}
                      onChange={value => field.onChange(value)}
                      className={`h-48 resize-none ${form.formState.errors.body ? 'border-destructive ring-destructive' : ''}`}
                      placeholder="Jot down any thoughts, visions, feelings or anything else you experienced during or after your trip"
                    />
                  </FormControl>
                  <FormDescription>{'Share as much as you are comfortable with.'}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'public'}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-1">
                  <TypographyParagraph size={'medium'} className="font-medium text-foreground">
                    {'Keep Public'}
                  </TypographyParagraph>
                  <div className="flex flex-row items-center gap-x-2">
                    <TypographyParagraph size={'extraSmall'}>{'Private'}</TypographyParagraph>
                    <Switch
                      defaultChecked={form.formState.defaultValues?.public}
                      onCheckedChange={checked => {
                        form.setValue('public', checked)
                      }}
                    />
                    <TypographyParagraph size={'extraSmall'}>{'Public'}</TypographyParagraph>
                  </div>
                </FormItem>
              )}
            />
            <div className="mt-auto flex w-full items-center gap-x-4">
              {journal?.status !== 'PUBLISHED' && (
                <Button
                  disabled={pending}
                  type={'button'}
                  variant={'outline'}
                  className="flex flex-1 items-center gap-x-2 border-violet-500 text-violet-500 hover:text-violet-800"
                  onClick={() => {
                    form.setValue('status', JournalStatus.DRAFT)

                    handleSaveAsDraft()
                  }}
                >
                  {pending && form.getValues().status === JournalStatus.DRAFT && (
                    <Icons.loader className="size 4 animate-spin text-white/90" />
                  )}
                  {journal ? 'Save Changes' : 'Save as draft'}
                </Button>
              )}
              <Button
                disabled={pending}
                type={'button'}
                variant={'bardo_primary'}
                className={`
                  ${journal?.status === 'PUBLISHED' ? 'ml-auto w-48' : 'flex-1'}
                  flex  items-center gap-x-2
                `}
                onClick={() => {
                  setModalityErrors([])
                  form.setValue('status', JournalStatus.PUBLISHED)

                  const modalities = form.getValues().metadata.modalities ?? []
                  for (const modality of modalities) {
                    if (!modality.dosage) {
                      setModalityErrors(prev => [
                        ...prev,
                        { modality: modality.modality, error: 'Dosage is required.' },
                      ])
                    }
                  }
                  form.handleSubmit(onSubmit, error => {
                    let toasted = false
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    for (const _err of Object.values(error)) {
                      if (toasted) {
                        continue
                      }

                      toast({
                        variant: 'destructive',
                        title: 'Error publishing journal',
                        description: `Please confirm you have filled out all the fields in the form.`,
                      })
                      toasted = true
                    }
                    toasted = false
                  })()
                }}
              >
                {pending && form.getValues().status === JournalStatus.PUBLISHED && (
                  <Icons.loader className="size 4 animate-spin text-white/90" />
                )}
                {journal?.status === 'PUBLISHED' ? 'Save Changes' : 'Publish'}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </ClientOnly>
  )
}
