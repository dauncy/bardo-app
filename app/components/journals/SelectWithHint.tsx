import { Label } from '@app/components/bardo/Label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@app/components/bardo/Select'
import { useNavigation } from '@remix-run/react'
import { Popover, PopoverContent, PopoverTrigger } from '@app/components/bardo/Popover'

interface SelectWithHintProps {
  options: string[]
  label: string
  innerLabel: string
  hintText: string
  placeholder: string
}

const HintPopover = ({ hintText }: { hintText: string }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex size-5 cursor-pointer items-center justify-center rounded-full bg-violet-400 font-semibold text-white/90 hover:opacity-80 hover:shadow-lg">
          <p className="text-sm">{'?'}</p>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-max max-w-[302px] rounded-md bg-violet-600 px-2 py-1.5 font-medium text-xs text-white">
        {hintText}
      </PopoverContent>
    </Popover>
  )
}

export const SelectWithHint = (props: SelectWithHintProps) => {
  const navigation = useNavigation()
  const pending = navigation.state === 'submitting' || navigation.state === 'loading'

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex flex-row items-center justify-between">
        <Label
          htmlFor={`data[${props.label}]`}
          className="capitalize after:ml-0.5 after:text-red-500 after:content-['*']"
        >
          {props.label}
        </Label>
        <HintPopover hintText={props.hintText} />
      </div>
      <Select disabled={pending} required={true} name={`data[${props.label}]`}>
        <SelectTrigger disabled={pending} className="w-[180px] disabled:cursor-not-allowed disabled:opacity-40">
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{props.innerLabel}</SelectLabel>
            {props.options.map(option => (
              <SelectItem key={option} value={option}>
                {option.split('_').join(' ')}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
