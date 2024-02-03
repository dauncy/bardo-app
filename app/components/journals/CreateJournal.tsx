/* eslint-disable react/jsx-pascal-case */
import { Form, useNavigation } from '@remix-run/react'
import { Label } from '@app/components/bardo/Label'
import { Input } from '@app/components/bardo/Input'
import { TripDosage, TripIntention, TripModality, TripSetting } from '@app/types/journals'
import { Button } from '@app/components/bardo/Button'
import { Textarea } from '@app/components/bardo/Textarea'
import { Icons } from '@app/components/bardo/Icons'
import { SelectWithHint } from './SelectWithHint'

export const CreateJournal = () => {
  const navigation = useNavigation()
  const pending = navigation.state === 'submitting' || navigation.state === 'loading'

  return (
    <Form className="flex h-full w-full flex-col justify-center gap-8 lg:flex-row " method={'POST'}>
      <div className="flex w-full flex-1 flex-col gap-y-8">
        <div className="flex max-w-sm flex-col gap-y-1">
          <Label htmlFor={'data[title]'}>{'Journal Title'}</Label>
          <Input
            className="disabled:cursor-not-allowed disabled:opacity-40"
            disabled={pending}
            name="data[title]"
            type={'text'}
            placeholder="optional"
            required={false}
          />
        </div>
        <div className="flex gap-x-4">
          <SelectWithHint
            label={'modality'}
            placeholder={'Select the modality'}
            innerLabel={'Modalities'}
            hintText={'What psychedelic did you take?'}
            options={Object.keys(TripModality).map(key => {
              // @ts-ignore
              return TripModality[key] as string
            })}
          />

          <SelectWithHint
            label={'dosage'}
            innerLabel={'Dosages'}
            placeholder={'Select the dosage'}
            hintText={'How much did you take?'}
            options={Object.keys(TripDosage).map(key => {
              // @ts-ignore
              return TripDosage[key] as string
            })}
          />
        </div>

        <div className="flex gap-x-4">
          <SelectWithHint
            placeholder={'Select the settings'}
            label={'setting'}
            innerLabel={'Trip Settings'}
            hintText={'Where did you take the drugs?'}
            options={Object.keys(TripSetting).map(key => {
              // @ts-ignore
              return TripSetting[key] as string
            })}
          />

          <SelectWithHint
            placeholder={'Select your intention'}
            label={'intention'}
            innerLabel={'Intentions'}
            hintText={'What was your motivation for taking the drugs??'}
            options={Object.keys(TripIntention).map(key => {
              // @ts-ignore
              return TripIntention[key] as string
            })}
          />
        </div>

        <Button
          disabled={pending}
          className="hidden max-w-sm items-center gap-x-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:opacity-60 lg:flex"
          variant={'bardo_primary'}
          type={'submit'}
          name={'_action'}
          value={'CREATE_JOURNAL'}
        >
          {pending && <Icons.loader className="size-5 animate-spin text-white/90" />}
          {pending ? 'Publishing...' : 'Publish'}
        </Button>
      </div>

      <div className="h-full w-full flex-1 gap-y-1">
        <Label htmlFor={'data[body'} className="after:ml-0.5 after:text-red-500 after:content-['*']">
          {'Describe your trip'}
        </Label>
        <Textarea
          disabled={pending}
          name={'data[body]'}
          className="placeholder:text-muted-forground mt-auto h-[260px] placeholder:font-regular disabled:cursor-not-allowed disabled:opacity-40"
          placeholder={
            'Provide details on specific imagery, themes, thoughts, or feelings you felt during your trip. Share anything you want.'
          }
          style={{ resize: 'none' }}
        />
      </div>

      <Button
        disabled={pending}
        className="flex max-w-sm items-center gap-x-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:opacity-60 lg:hidden"
        variant={'bardo_primary'}
        type={'submit'}
        name={'_action'}
        value={'CREATE_JOURNAL'}
      >
        {pending && <Icons.loader className="size-5 animate-spin text-white/90" />}
        {pending ? 'Publishing...' : 'Publish'}
      </Button>
    </Form>
  )
}
