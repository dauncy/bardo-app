/* eslint-disable react/jsx-pascal-case */
import { Form, useSubmit } from '@remix-run/react'
import { Card, CardContent, CardHeader, CardTitle } from '../bardo/Card'
import { TypographyParagraph } from '../bardo/typography/TypographyParagraph'
import { Label } from '../bardo/Label'
import { Input } from '../bardo/Input'
import { Button } from '../bardo/Button'
import { useState, type FormEvent } from 'react'
import { ZodError, z } from 'zod'
import { Icons } from '../bardo/Icons'
import { container } from 'tsyringe'
import { AuthClient } from '@app/services/auth/auth-client.service'
import { FirebaseError } from 'firebase/app'
import { Routes } from '@app/services/routes.service'

const passwordResetSchema = z.object({
  password: z.string().min(6, 'Password is too short').max(24, 'Password is too long'),
  passwordConfirm: z.string(),
})

const FirebaseErrorMessage: { [key: string]: string } = {
  'auth/invalid-action-code': 'The password reset link is invalid',
  'auth/expired-action-code': 'The password reset link has expired.',
  default: 'An unexpected error occured. Try Again',
}

export const ResetPasswordForm = ({ oobCode }: { oobCode: string }) => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const submit = useSubmit()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const authClient = container.resolve(AuthClient)
    e.preventDefault()
    if (loading) {
      return
    }
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const body = Object.fromEntries(formData)
    try {
      const verified = passwordResetSchema.parse(body)
      if (verified.password !== verified.passwordConfirm) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }
      const email = await authClient.resetPasswordLink({ oobCode, newPassword: verified.password })
      const user = await authClient.signInWithEmailAndPassword({ email: email, password: verified.password })
      const idToken = await user.user.getIdToken()
      if (!idToken) {
        throw new Error('Invalid Token')
      }
      setLoading(false)
      return submit({ idToken }, { action: Routes.login })
    } catch (e) {
      setLoading(false)
      if (e instanceof ZodError) {
        const error = e.errors.map(err => err.message).join(', ')
        setError(error)
      }

      if (e instanceof FirebaseError) {
        const code = e.code
        const msg = FirebaseErrorMessage[code] ?? FirebaseErrorMessage.default
        setError(msg)
        return
      }

      setError(FirebaseErrorMessage.default)
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{'Reset your password'}</CardTitle>
        <TypographyParagraph className="font-light leading-5" size={'small'}>
          {'Fill out the fields below and click Continue when you are done.'}
        </TypographyParagraph>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <Form
          className="relative flex flex-col gap-y-1"
          onSubmit={async e => {
            await handleSubmit(e)
          }}
        >
          <div className="flex h-full w-full flex-col gap-y-3">
            <Label
              className="peer peer-[&:not(:placeholder-shown):not(:focus):invalid]:text-red-500"
              htmlFor="password"
            >
              {'Password'}
            </Label>
            <Input
              disabled={loading}
              name="password"
              type={'password'}
              className="peer disabled:cursor-not-allowed disabled:opacity-60"
              required={true}
              placeholder={'enter your new password'}
              min={6}
            />
            <Label
              className="peer peer-[&:not(:placeholder-shown):not(:focus):invalid]:text-red-500"
              htmlFor="passwordConfirm"
            >
              {'Confrim password'}
            </Label>
            <Input
              disabled={loading}
              name="passwordConfirm"
              type={'password'}
              className="peer disabled:cursor-not-allowed disabled:opacity-60"
              required={true}
              placeholder={'confirm your new password'}
              min={6}
            />
            {error && (
              <div className="flex w-full items-center gap-x-1">
                <Icons.alertCircle className="size-4 text-destructive" />
                <TypographyParagraph size={'small'} className="font-medium text-destructive">
                  {error}
                </TypographyParagraph>
              </div>
            )}
            <Button
              disabled={loading}
              className="mt-3 flex items-center gap-x-2 py-5 uppercase peer-invalid:cursor-not-allowed peer-invalid:opacity-40 peer-invalid:hover:bg-violet-800"
              variant={'bardo_primary'}
              type={'submit'}
            >
              {loading && <Icons.loader className="size-5 animate-spin text-white/90" />}
              {'Update Password'}
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}
