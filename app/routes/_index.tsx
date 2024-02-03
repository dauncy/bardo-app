/* eslint-disable react/jsx-pascal-case */
import { AuthForm } from '@app/components/auth/AuthForm'
import { Button } from '@app/components/bardo/Button'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { AuthClient } from '@app/services/auth/auth-client.service'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Link, useSubmit } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { container } from 'tsyringe'
import { Routes } from '@app/services/routes.service'
import { AdminAuthService } from '@app/services/auth/auth-server.service'
import { Card, CardContent } from '@app/components/bardo/Card'
import { Icons } from '@app/components/bardo/Icons'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'

const authSvc = container.resolve(AuthClient)

export const meta: MetaFunction = () => {
  return [{ title: 'Bardo' }, { name: 'description', content: 'Psychedilic journal' }]
}

export const loader = async (ctx: LoaderFunctionArgs) => {
  const adminAuth = container.resolve(AdminAuthService)
  const isAuthenticated = await adminAuth.isAuthenticated(ctx.request)
  if (isAuthenticated) {
    const { user, authProfile } = await getAccountInfo(ctx.request)
    if (!user || !authProfile) {
      throw redirect(Routes.logout)
    }
    return redirect(`${Routes.users}/${user.id}`)
  }
  return null
}

export default function Index() {
  const submit = useSubmit()
  const [checkingAuth, setCheckingAuth] = useState(false)

  useEffect(() => {
    async function onRedirect() {
      setCheckingAuth(true)
      const user = await authSvc.getRedirectRes()
      const idToken = await user?.user?.getIdToken()
      if (!idToken) {
        setCheckingAuth(false)
        return
      }
      return submit({ idToken }, { action: Routes.login })
    }
    onRedirect()
  }, [submit])
  return (
    <div className="reltaive h-screen w-screen bg-neutral-50">
      <div className="mx-auto flex h-full w-full max-w-screen-2xl flex-col items-stretch md:flex-row">
        <div className="gapy-4 flex h-full w-full flex-1 flex-col items-center justify-center bg-violet-200">
          <div className="my-0 flex flex-row gap-x-4 md:mt-auto">
            <div className="flex size-14 items-center justify-center rounded-full bg-violet-500 shadow-md">
              <img src={'/logo.png'} alt="" className="flex size-8 object-contain object-center" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-5xl uppercase">{'Bardo App'}</h1>
              <TypographyParagraph size={'large'} className="ml-1">
                {'Psychedelic journal'}
              </TypographyParagraph>
            </div>
          </div>

          <div className="mt-auto hidden items-center gap-x-4 md:flex">
            <Link to={Routes.marketing.privacy}>
              <Button variant={'link'}>
                <TypographyParagraph size={'extraSmall'}>{'Privacy Policy'}</TypographyParagraph>
              </Button>
            </Link>
            <Link to={Routes.marketing.tos}>
              <Button variant={'link'}>
                <TypographyParagraph size={'extraSmall'}>{'Terms of Service'}</TypographyParagraph>
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex h-full  w-full flex-1 flex-col items-center justify-center bg-violet-200 px-4 py-0 pb-2 pt-5 md:bg-transparent md:py-5 md:pb-0 md:pt-0">
          <AuthForm />
          <div className="mt-auto flex gap-x-4 md:hidden">
            <Link to={Routes.marketing.privacy}>
              <Button variant={'link'}>
                <TypographyParagraph size={'extraSmall'}>{'Privacy Policy'}</TypographyParagraph>
              </Button>
            </Link>
            <Link to={Routes.marketing.tos}>
              <Button variant={'link'}>
                <TypographyParagraph size={'extraSmall'}>{'Terms of Service'}</TypographyParagraph>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {checkingAuth && (
        <div className="z-2 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black/60">
          <Card className="min-h-[250px flex w-full max-w-md items-center justify-center px-4 py-5 animate-in zoom-in">
            <CardContent className="flex items-center gap-x-4 p-0">
              <Icons.loader className="h-8 w-8 animate-spin text-violet-600" />
              <TypographyParagraph size={'large'}>{'Signing in...'}</TypographyParagraph>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
