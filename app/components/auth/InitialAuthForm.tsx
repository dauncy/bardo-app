/* eslint-disable react/jsx-pascal-case */
import { AuthClient } from '@app/services/auth/auth-client.service'
import { AuthStep } from '@app/types/auth'
import { Form } from '@remix-run/react'
import { Button } from 'app/components/bardo/Button'
import { Card, CardContent, CardHeader, CardTitle } from 'app/components/bardo/Card'
import { Label } from 'app/components/bardo/Label'
import { Separator } from 'app/components/bardo/Separator'
import { TypographyParagraph } from 'app/components/bardo/typography/TypographyParagraph'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import { container } from 'tsyringe'
import { Icons } from '@app/components/bardo/Icons'
import { Input } from '@app/components/bardo/Input'
import { z, ZodError } from 'zod'

const authSvc = container.resolve(AuthClient)
const emailSchema = z.object({ email: z.string().email() })

export const InitialAuthForm = ({
  setAuthStep,
  setCurrentEmail,
}: {
  setAuthStep: Dispatch<SetStateAction<AuthStep>>
  setCurrentEmail: Dispatch<SetStateAction<string>>
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState('')

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{'Login or Sign up'}</CardTitle>
        <TypographyParagraph className="font-light leading-3" size={'small'}>
          {'Enter your email to continue to bardo'}
        </TypographyParagraph>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <Form
          className="relative flex flex-col gap-y-1"
          onSubmit={async e => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const { email: maybeEmail } = Object.fromEntries(formData)

            try {
              const { email } = emailSchema.parse({ email: maybeEmail })
              const exists = await authSvc.checkEmailExists({ email })
              if (exists) {
                setAuthStep(AuthStep.SIGN_IN)
              } else {
                setAuthStep(AuthStep.SIGN_UP)
              }
              setCurrentEmail(email)
            } catch (e) {
              if (e instanceof ZodError) {
                setError('Enter a valid email')
              }
              return
            }
          }}
          navigate={false}
        >
          <div className="flex h-full w-full flex-col gap-y-3">
            <Label className="peer peer-[&:not(:placeholder-shown):not(:focus):invalid]:text-red-500" htmlFor="email">
              {'email'}
            </Label>
            <Input name="email" type={'email'} className="peer" required={true} placeholder={'hello@bardo.app'} />

            <Button
              className="mt-3 py-5 uppercase peer-invalid:cursor-not-allowed peer-invalid:opacity-40 peer-invalid:hover:bg-violet-800"
              variant={'bardo_primary'}
              type={'submit'}
            >
              {'Continue'}
            </Button>
          </div>
        </Form>

        <Separator className="my-5 flex" />
        <Button
          variant={'secondary'}
          className="items-center gap-x-2 py-5"
          onClick={async () => {
            const authSvc = container.resolve(AuthClient)
            await authSvc.signInWithGoogle()
          }}
        >
          <Icons.google className="h-5 w-5" />
          {'Continue with Google'}
        </Button>
      </CardContent>
    </Card>
  )
}
