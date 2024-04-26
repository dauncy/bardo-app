/* eslint-disable react/jsx-pascal-case */
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@app/components/bardo/Card'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { Form, useFetcher, useSubmit } from '@remix-run/react'
import { Button } from '@app/components/bardo/Button'
import { Input } from '@app/components/bardo/Input'
import { Label } from '@app/components/bardo/Label'
import { z, ZodError } from 'zod'
import { AuthClient } from '@app/services/auth/auth-client.service'
import { container } from 'tsyringe'
import { Routes } from '@app/services/routes.service'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import { AuthStep } from '@app/types/auth'
import { Icons } from '@app/components/bardo/Icons'
import { FirebaseError } from 'firebase/app'

const authSvc = container.resolve(AuthClient)
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2).max(32),
})

const errors: { [key: string]: string } = {
  'auth/wrong-password': 'Incorect password.',
}

export const SignInForm = ({
  currentEmail,
  setAuthStep,
}: {
  currentEmail: string
  setAuthStep: Dispatch<SetStateAction<AuthStep>>
}) => {
  const submit = useSubmit()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fetcher = useFetcher<{ success: true }>()
  const pending = fetcher.state === 'loading' || fetcher.state === 'submitting'
  console.log(fetcher.data)
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <Icons.arrowBack
          onClick={() => setAuthStep(AuthStep.INTIAL)}
          className="h-5 w-5 cursor-pointer text-black"
          role={'button'}
        />
        <CardTitle className="text-xl">{'Login'}</CardTitle>
        <TypographyParagraph className="font-light leading-3" size={'small'}>
          {'Enter your password to login to your account.'}
        </TypographyParagraph>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <Form
          onSubmit={async e => {
            e.preventDefault()
            setError('')
            const formData = new FormData(e.currentTarget)
            const values = Object.fromEntries(formData)
            try {
              setLoading(true)
              const data = signInSchema.parse(values)
              const userCred = await authSvc.signInWithEmailAndPassword({ ...data })
              const idToken = await userCred.user.getIdToken()
              if (!idToken) {
                throw new Error('no idToken')
              }
              return submit({ idToken }, { action: Routes.login })
            } catch (e) {
              if (e instanceof FirebaseError) {
                const code = e.code
                const message = code in errors ? errors[code] : 'Something went wrong.'
                setError(message)
              }

              if (e instanceof ZodError) {
                setError('Enter a valid password.')
              }
            }
            setLoading(false)
          }}
          className="relative flex flex-col gap-y-2"
          navigate={false}
        >
          <Label htmlFor="name">{'Email'}</Label>
          <input type={'hidden'} name={'email'} value={currentEmail} />
          <Input type={'email'} name={'email_display'} value={currentEmail} disabled={true} className="bg-violet-200" />

          <Label className="mt-3">{'Password'}</Label>
          <Input className={`peer`} type={'password'} name={'password'} required={true} placeholder="enter password" />

          <Button
            disabled={loading}
            variant={'bardo_primary'}
            className="peer mt-3 items-center gap-x-2 uppercase peer-invalid:cursor-not-allowed peer-invalid:opacity-40 peer-invalid:hover:bg-violet-900"
            type={'submit'}
          >
            {loading && <Icons.loader className="h-5 w-5 animate-spin text-white/90" />}
            {'Sign In'}
          </Button>
          {error && (
            <div className="absolute -bottom-6 inline-flex items-center gap-x-2">
              <Icons.alertCircle className="h-4 w-4 text-red-500" />
              <TypographyParagraph size={'small'} className="text-red-500">
                {error}
              </TypographyParagraph>
            </div>
          )}
        </Form>
      </CardContent>
      <CardFooter className="p-0 px-2 py-3 pb-6 pt-4">
        <fetcher.Form method={'POST'} action={'/api/send-password-reset'}>
          <input type={'hidden'} name={'email'} value={currentEmail} />
          <Button
            disabled={pending}
            type={'submit'}
            variant={'link'}
            className="flex items-center gap-x-2 text-blue-500"
          >
            {pending ? (
              <>
                <Icons.loader className="size-4 animate-spin text-violet-600" />
                {'Sending reset email...'}
              </>
            ) : (
              <>{'Forgot password?'}</>
            )}
          </Button>
        </fetcher.Form>
      </CardFooter>
    </Card>
  )
}
