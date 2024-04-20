import { ResetPasswordForm } from '@app/components/auth/ResetPasswordForm'
import { Button } from '@app/components/bardo/Button'
import { Card, CardFooter, CardHeader, CardTitle } from '@app/components/bardo/Card'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { Routes } from '@app/services/routes.service'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  oobCode: z.string(),
  apiKey: z.string(),
  mode: z.literal('resetPassword'),
})
export const loader = async (ctx: LoaderFunctionArgs) => {
  const params = Object.fromEntries(new URL(ctx.request.url).searchParams)
  console.log('params ', params)
  try {
    const { oobCode } = resetPasswordSchema.parse(params)
    return json({ error: false, data: { oobCode } })
  } catch (e) {
    console.log(e)
    return json({ error: true, data: null })
  }
}

export default function ResetPassword() {
  const { error, data } = useLoaderData<typeof loader>()
  return (
    <div className="flex size-full min-h-full flex-col items-center justify-center gap-y-8 bg-violet-50">
      <div className="flex w-full w-max flex-row gap-x-4 px-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-violet-500 shadow-md">
          <img src={'/logo.png'} alt="" className="flex size-8 object-contain object-center" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold text-4xl uppercase md:text-5xl">{'Bardo App'}</h1>
          <TypographyParagraph size={'large'} className="ml-1">
            {'Psychedelic journal'}
          </TypographyParagraph>
        </div>
      </div>
      {data && !error && <ResetPasswordForm {...data} />}
      {(error || !data) && (
        <Card className="w-full max-w-sm border border-destructive shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">{'Something went wrong'}</CardTitle>
            <TypographyParagraph className="font-light leading-5" size={'small'}>
              {'We are having trouble verifying your link.'}
            </TypographyParagraph>
          </CardHeader>
          <CardFooter>
            <Link to={Routes.home}>
              <Button variant={'outline'}>{'Back home'}</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
