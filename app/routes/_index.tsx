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
import { LearnMoreModal } from '@app/components/about/LearnModal'
import { UserOnboardingStep } from '@prisma/client'

const authSvc = container.resolve(AuthClient)

export const loader = async (ctx: LoaderFunctionArgs) => {
  const adminAuth = container.resolve(AdminAuthService)
  const isAuthenticated = await adminAuth.isAuthenticated(ctx.request)
  if (isAuthenticated) {
    const { user, authProfile } = await getAccountInfo(ctx.request)
    if (!user || !authProfile) {
      throw redirect(Routes.logout)
    }
    if (user.onboarding_step === UserOnboardingStep.COMPLETED) {
      return redirect(`/journals`)
    }

    if (user.onboarding_step === UserOnboardingStep.WELCOME) {
      return redirect('/welcome')
    }

    if (user.onboarding_step === UserOnboardingStep.DEMOGRAPHICS) {
      return redirect(`/user-settings/demographics`)
    }
    return redirect(`/user-settings`)
  }
  return null
}

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Bardo',
    },
    {
      property: 'og:title',
      content: 'Bardo',
    },
    {
      property: 'og:image',
      content: '/meta/meta-default.png',
    },
    {
      name: 'description',
      content: 'A community trip journal',
    },
  ]
}

export default function Index() {
  const submit = useSubmit()
  const [checkingAuth, setCheckingAuth] = useState(false)

  useEffect(() => {
    async function onRedirect() {
      await authSvc.getRedirectRes(async user => {
        if (!user) {
          return
        }
        setCheckingAuth(true)
        const idToken = await user?.getIdToken()
        if (!idToken) {
          setCheckingAuth(false)
          return
        }
        return submit({ idToken }, { action: Routes.login })
      })
    }
    onRedirect()
  }, [submit])
  return (
    <div className="reltaive flex h-max min-h-full w-full min-w-full bg-violet-200 md:bg-transparent md:py-0">
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="flex w-full flex-col items-center bg-violet-200 pt-5 md:h-full md:flex-1 md:justify-center md:gap-y-4">
          <div className="my-0 flex w-full flex-row gap-x-2 gap-y-0 px-4 md:mt-auto md:w-max md:gap-x-4">
            <div className="flex size-20 items-center justify-center rounded-full border border-2 border-black bg-yellow-200 shadow-md">
              <img src={'/logo.png'} alt="" className="flex size-14 object-contain object-center" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-4xl uppercase md:text-5xl">{'Bardo'}</h1>
              <TypographyParagraph size={'large'} className="ml-1 leading-none">
                {'A community trip journal'}
              </TypographyParagraph>
              <div className="mt-2 w-full md:w-max">
                <LearnMoreModal />
              </div>
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
        <div className="flex h-full w-full flex-1 flex-1 flex-col items-center justify-between px-4 py-0 md:mt-auto md:bg-transparent md:py-5 md:pb-0 md:pt-0">
          <div className="flex h-full w-full items-center justify-center md:mb-0">
            <AuthForm />
          </div>
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
        <div className="z-2 absolute left-0 top-0 flex h-full w-full items-center justify-center bg-[#170830]/80 backdrop-blur-sm">
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
