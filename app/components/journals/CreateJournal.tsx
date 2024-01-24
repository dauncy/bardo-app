/* eslint-disable react/jsx-pascal-case */
import { Form, useNavigation } from '@remix-run/react'
import { Label } from '../bardo/Label'
import { Input } from '../bardo/Input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectGroup,
  SelectValue,
} from '../bardo/Select'
import { TripDosage, TripIntention, TripModality, TripSetting } from '@app/types/journals'
import { Button } from '../bardo/Button'
import { Textarea } from '../bardo/Textarea'
import { Icons } from '../bardo/Icons'

export const CreateJournal = () => {
  const navigation = useNavigation()
  const pending = navigation.state === 'submitting' || navigation.state === 'loading'

  return (
    <Form className="flex h-full w-full flex-col justify-center gap-x-8 gap-y-8 md:flex-row md:gap-y-0" method={'POST'}>
      <div className="flex flex-1 flex-col gap-y-8">
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
          <div className="flex flex-col gap-y-1">
            <Label htmlFor={'data[modality]'} className="after:ml-0.5 after:text-red-500 after:content-['*']">
              {'Modality'}
            </Label>
            <Select disabled={pending} required={true} name={'data[modality]'}>
              <SelectTrigger disabled={pending} className="w-[180px] disabled:cursor-not-allowed disabled:opacity-40">
                <SelectValue placeholder="Select the modality" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Modalities</SelectLabel>
                  {Object.keys(TripModality).map((key: string) => (
                    <SelectItem key={`modality-${key}`} value={key as TripModality}>
                      {/* @ts-ignore */}
                      {TripModality[key] as string}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-y-1">
            <Label htmlFor={'data[dosage]'} className="after:ml-0.5 after:text-red-500 after:content-['*']">
              {'Dosage'}
            </Label>
            <Select disabled={pending} required={true} name={'data[dosage]'}>
              <SelectTrigger disabled={pending} className="w-[180px] disabled:cursor-not-allowed disabled:opacity-40">
                <SelectValue placeholder="Select the dosage" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Dosage</SelectLabel>
                  {Object.keys(TripDosage).map((key: string) => (
                    <SelectItem key={`dosage-${key}`} value={key as TripDosage} className="capitalize">
                      {/* @ts-ignore */}
                      {(TripDosage[key] as string).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-x-4">
          <div className="flex flex-col gap-y-1">
            <Label htmlFor={'data[setting]'} className="after:ml-0.5 after:text-red-500 after:content-['*']">
              {'Setting'}
            </Label>
            <Select disabled={pending} required={true} name={'data[setting]'}>
              <SelectTrigger disabled={pending} className="w-[180px] disabled:cursor-not-allowed disabled:opacity-40">
                <SelectValue placeholder="Select the setting" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Setting</SelectLabel>
                  {Object.keys(TripSetting).map((key: string) => (
                    <SelectItem key={`setting-${key}`} value={key as TripSetting} className="capitalize">
                      {/* @ts-ignore */}
                      {(TripSetting[key] as string).split('_').join(' ').toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-y-1">
            <Label htmlFor={'data[intention]'} className="after:ml-0.5 after:text-red-500 after:content-['*']">
              {'Your Intention'}
            </Label>
            <Select disabled={pending} required={true} name={'data[intention]'}>
              <SelectTrigger disabled={pending} className="w-[180px] disabled:cursor-not-allowed disabled:opacity-40">
                <SelectValue placeholder="Select the intention" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Intention</SelectLabel>
                  {Object.keys(TripIntention).map((key: string) => (
                    <SelectItem key={`intention-${key}`} value={key as TripIntention} className="capitalize">
                      {/* @ts-ignore */}
                      {(TripIntention[key] as string).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          disabled={pending}
          className="disabled:hover:opaci max-w-sm items-center gap-x-2 disabled:cursor-not-allowed disabled:opacity-40"
          variant={'bardo_primary'}
          type={'submit'}
          name={'_action'}
          value={'CREATE_JOURNAL'}
        >
          {pending && <Icons.loader className="size-5 animate-spin text-white/90" />}
          {pending ? 'Publishing...' : 'Publish'}
        </Button>
      </div>

      <div className="h-full flex-1 gap-y-1">
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
    </Form>
  )
}
