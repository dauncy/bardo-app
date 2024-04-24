import type { TripModality } from '@app/types/journals'
import { TripDosage } from '@app/types/journals'
import { ClientOnly } from '../utility/ClientOnly'
import { AccordionContent, AccordionItem, AccordionTrigger } from '../bardo/Accordion'
import { Label } from '../bardo/Label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../bardo/Select'
import { Icons } from '../bardo/Icons'
import { DOSAGE, MODALITIES } from '@app/constants/journal.constants'

export const ModalitySelect = ({
  modality,
  modalityErrors,
  handleDosage,
  defaultValue,
}: {
  defaultValue?: string | TripDosage
  modality: TripModality
  modalityErrors: { modality: TripModality; error: string }[]
  handleDosage: ({ modality, dosage }: { modality: TripModality; dosage: TripDosage }) => void
}) => {
  const currentError = modalityErrors.find(err => err.modality === modality)
  const hasError = currentError !== undefined
  return (
    <ClientOnly>
      <AccordionItem value={modality} className="group w-full border-0 py-0" onChange={e => console.log({ e })}>
        <AccordionTrigger
          chevron={false}
          className="flex w-min flex-row items-center justify-start gap-x-2 border-0 py-1"
        >
          <div className="flex size-4 items-center justify-center rounded border border-foreground group-data-[state=open]:border-violet-400 group-data-[state=open]:bg-violet-400">
            <Icons.Check className="hidden size-3 text-white group-data-[state=open]:flex" strokeWidth={2} />
          </div>
          <Label>{MODALITIES[modality]}</Label>
        </AccordionTrigger>
        <AccordionContent className="flex w-max flex-col gap-y-1 py-2 pl-5 pr-4">
          <Select
            defaultValue={defaultValue}
            onValueChange={e => {
              handleDosage({ modality, dosage: e as TripDosage })
            }}
          >
            <SelectTrigger className={`w-max min-w-48 ${hasError ? 'border-destructive ring-destructive' : ''}`}>
              <SelectValue placeholder={'Select a dose'} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{'Select a dose'}</SelectLabel>
                {Object.values(TripDosage).map(dosage => (
                  <SelectItem key={dosage} value={dosage}>
                    {DOSAGE[dosage]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {hasError && <p className="mt-1 font-medium text-[0.8rem] text-destructive">{currentError?.error}</p>}
        </AccordionContent>
      </AccordionItem>
    </ClientOnly>
  )
}
