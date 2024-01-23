import { Separator } from '@app/components/bardo/Separator'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { SidebarNav } from '@app/components/nav/SidebarNav'
import { Routes } from '@app/services/routes.service'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'

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
      title: 'New Journal',
      href: `/users/${user.id}/journals/new`,
    },
    {
      title: 'Feed',
      href: '/journals',
    },
  ]

  return (
    <div className="items-cente rjustify-center flex h-screen w-screen bg-violet-50 p-5">
      <div className="max-w-9xl h-[calc(100vh-50px)] w-full rounded-md border border-slate-200 bg-white shadow-md">
        <div className="space-y-6 p-10 pb-16">
          <div className="space-y-0.5">
            <TypographyParagraph size={'large'} className="text-3xl text-foreground">
              {`Welcom back ${user.name ?? user.email}!`}
            </TypographyParagraph>
            <TypographyParagraph className="text-muted-forground">
              {'manage your account settings, view and add to your journals.'}
            </TypographyParagraph>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl xl:max-w-5xl">
              <Outlet context={{ user, authProfile }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
