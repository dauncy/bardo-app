import { z } from 'zod'
import { ClientOnly } from '../utility/ClientOnly'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TypographyParagraph } from './typography/TypographyParagraph'
import { Form, FormControl, FormField, FormItem, FormMessage } from './Form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select'
import { forwardRef, useImperativeHandle, useState } from 'react'

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const defaultDays = Array.from({ length: 31 }, (_, index) => index + 1)

const formSchema = z.object({
  day: z.number().int().min(1).max(31),
  month: z.number().int().min(0).max(11),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
})

interface DateFormProps {
  label: string
  onSubmit: (data: z.infer<typeof formSchema>) => void
}

export const DateFormChild = forwardRef((props: DateFormProps, ref) => {
  const { label } = props
  const [days, setDays] = useState(defaultDays)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  useImperativeHandle(ref, () => ({
    // Expose form methods to parent component
    getValues: form.getValues,
    submit: form.handleSubmit(props.onSubmit),
    setError: (error: 'root', data: { message: string }) => form.setError(error, data),
  }))

  const currentYear = new Date().getFullYear()
  const yearsAgo = 100
  const yearsArray = Array.from({ length: yearsAgo + 1 }, (_, index) => currentYear - index)

  const getDayOptions = () => {
    const values = form.getValues()
    if (!values.year || !values.month) {
      return
    }
    const daysInMonth = new Date(values.year, values.month, 0).getDate()
    const dayOptions = Array.from({ length: daysInMonth }, (_, index) => index + 1)

    if (values.day > dayOptions.length) {
      form.resetField('day')
    }

    setDays(dayOptions)
  }

  return (
    <div className="flex w-full flex-col gap-y-3">
      <TypographyParagraph size={'medium'} className="font-medium text-foreground">
        {label}
      </TypographyParagraph>
      <div className="flex w-full items-center gap-x-2">
        <Form {...form}>
          <FormField
            control={form.control}
            name={'month'}
            render={({ field }) => (
              <FormItem className="w-32">
                <FormControl>
                  <Select
                    onValueChange={value => {
                      const month = parseInt(value)
                      field.onChange(month)
                      getDayOptions()
                    }}
                  >
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue placeholder={'MM'} />
                    </SelectTrigger>
                    <SelectContent className="z-[99999] h-[140px] overflow-auto bg-white lg:h-[200px] portrait:h-[200px]">
                      {months.map(month => (
                        <SelectItem key={`month-${month}`} value={`${month}`}>
                          {`${month < 10 ? '0' : ''}${month}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={'day'}
            render={({ field }) => (
              <FormItem className="w-32">
                <FormControl>
                  <Select
                    onValueChange={value => {
                      const day = parseInt(value)
                      field.onChange(day)
                    }}
                  >
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue placeholder={'DD'} />
                    </SelectTrigger>
                    <SelectContent className="z-[99999] h-[140px] overflow-auto bg-white lg:h-[200px] portrait:h-[200px]">
                      {days.map(day => (
                        <SelectItem key={`month-${day}`} value={`${day}`}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem className="w-32">
                <FormControl>
                  <Select
                    onValueChange={value => {
                      field.onChange(parseInt(value))
                      getDayOptions()
                    }}
                  >
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent className="z-[99999] h-[140px] overflow-auto bg-white lg:h-[200px] portrait:h-[200px]">
                      {yearsArray.map(year => (
                        <SelectItem key={`year-${year}`} value={`${year}`}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </div>
      {form.formState.errors.root && <p>{form.formState.errors.root.message}</p>}
    </div>
  )
})

DateFormChild.displayName = 'DateFormChild'

export const DateForm = forwardRef((props: DateFormProps, ref) => {
  return (
    <ClientOnly>
      <DateFormChild {...props} ref={ref} />
    </ClientOnly>
  )
})

DateForm.displayName = 'DateForm'
