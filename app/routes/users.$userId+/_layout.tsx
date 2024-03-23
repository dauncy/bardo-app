import { Separator } from '@app/components/bardo/Separator'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { SidebarNav } from '@app/components/nav/SidebarNav'
import { Routes } from '@app/services/routes.service'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Outlet, useLoaderData, useParams } from '@remix-run/react'

const validateRequest = async (ctx: LoaderFunctionArgs) => {
  const { authProfile, user } = await getAccountInfo(ctx.request)
  if (!user || !authProfile) {
    throw redirect(Routes.logout)
  }
  return { authProfile, user }
}
export const loader = async (ctx: LoaderFunctionArgs) => {
  const { authProfile, user } = await validateRequest(ctx)

  return json({
    authProfile,
    user,
  })
}

export default function UserLayout() {
  const { user, authProfile } = useLoaderData<typeof loader>()
  const params = useParams()
  const sidebarNavItems = [
    {
      title: 'Profile',
      href: `/users/${user.id}`,
    },
    {
      title: 'My Journals',
      href: `/users/${user.id}/journals`,
    },
    {
      title: params.userId && params.id ? 'Edit Journal' : 'New Journal',
      href: params.userId && params.id ? `/users/${user.id}/journals/${params.id}` : `/users/${user.id}/journals/new`,
    },
    {
      title: 'Feed',
      href: '/journals',
    },
  ]

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-indigo-50 p-5">
      <div className="max-w-9xl h-full min-h-[calc(100vh-40px)] w-full rounded-md border border-slate-200 bg-white shadow-md">
        <div className="h-full flex-1 grow space-y-6 p-10 pb-16">
          <div className="space-y-0.5">
            <TypographyParagraph size={'large'} className="text-3xl text-foreground">
              {`Welcom back ${user.name ?? user.email}!`}
            </TypographyParagraph>
            <TypographyParagraph className="text-muted-forground">
              {'manage your account settings, view and add to your journals.'}
            </TypographyParagraph>
          </div>
          <Separator className="my-6" />
          <div className="flex h-full min-h-full flex-1 grow flex-col space-y-8 xl:flex-row xl:space-x-12 xl:space-y-0">
            <aside className="-mx-4 xl:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="min-h-full flex-1 xl:max-w-5xl">
              <Outlet context={{ user, authProfile }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
