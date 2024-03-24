/* eslint-disable react/jsx-pascal-case */
import { Button } from '@app/components/bardo/Button'
import { Icons } from '@app/components/bardo/Icons'
import { Input } from '@app/components/bardo/Input'
import { Label } from '@app/components/bardo/Label'
import { Popover, PopoverContent, PopoverTrigger } from '@app/components/bardo/Popover'
import { Separator } from '@app/components/bardo/Separator'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { DeleteAccount } from '@app/components/users/DeleteAccount'
import { UpdateUserProfileImage } from '@app/components/users/UpdateUserProfile'
import { ClientOnly } from '@app/components/utility/ClientOnly'
import { prisma } from '@app/db.server'
import { AuthClient } from '@app/services/auth/auth-client.service'
import type { DecodedClaims } from '@app/services/auth/auth-server.service'
import { Routes } from '@app/services/routes.service'
import type { RequestCtx } from '@app/types'
import type { UserCrudPayload } from '@app/types/users'
import { userCrudSchema } from '@app/types/users'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import { sleep } from '@app/utils/server.utils/async.utils'
import { getFormData } from '@app/utils/server.utils/forms.utils'
import type { User } from '@prisma/client'
import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect as serverRedirect } from '@remix-run/node'
import { useFetcher, useOutletContext } from '@remix-run/react'
import { stringify } from 'qs'
import { useRef } from 'react'
import { container } from 'tsyringe'

const validateRequest = async (ctx: RequestCtx) => {
  const { user, authProfile } = await getAccountInfo(ctx.request)
  if (!user || !authProfile) {
    throw serverRedirect(Routes.logout)
  }
  return { user, authProfile }
}

export const action = async (ctx: ActionFunctionArgs) => {
  const { user } = await validateRequest(ctx)
  const body = await getFormData(ctx, userCrudSchema)
  switch (body._action) {
    case 'UPDATE_USER':
      await sleep(500)
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: body.data.name,
        },
      })
      break
    case 'DELETE_USER':
      await prisma.user.delete({ where: { id: user.id } })
      return serverRedirect(Routes.logout)
  }
  return null
}
export default function UserPage() {
  const data = useOutletContext<{ user: User; authProfile: DecodedClaims }>()
  const usernameRef = useRef<HTMLInputElement>(null)
  const fetcher = useFetcher()
  const pending = fetcher.state === 'loading' || fetcher.state === 'submitting'
  return (
    <div className="flex h-full flex-1 grow flex-col gap-y-8">
      <div className="flex flex-col gap-y-2">
        <Label>{'Email'}</Label>
        <Input
          value={data.user.email}
          className="w-full max-w-sm cursor-not-allowed border border-slate-300 bg-violet-100"
          disabled={true}
        />
      </div>

      <div className="flex flex-col gap-y-2">
        <Label>{'Username'}</Label>
        <Input
          ref={usernameRef}
          defaultValue={data.user?.name ?? ''}
          placeholder="enter your username"
          className="w-full max-w-sm border border-slate-300"
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <Label>{'Profile Image'}</Label>
        <ClientOnly>
          <UpdateUserProfileImage user={data.user} />
        </ClientOnly>
      </div>
      <Button
        disabled={pending}
        variant={'bardo_primary'}
        className="flex w-full max-w-sm items-center gap-x-2"
        onClick={() => {
          const username = usernameRef.current?.value?.trim()
          if (!username || username === data.user.name) {
            return
          }

          const payload: UserCrudPayload = {
            _action: 'UPDATE_USER',
            data: {
              name: username,
            },
          }
          fetcher.submit(stringify(payload), { method: 'POST' })
        }}
      >
        {pending && <Icons.loader className="size-5 animate-spin text-white/90" />}
        {'Update Account'}
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={'outline'} className="w-full max-w-sm">
            {'Danger Zone'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <div
            className="group flex w-full cursor-pointer items-center gap-x-2 px-4 py-1.5 text-muted-foreground hover:bg-violet-50 hover:text-violet-500"
            onClick={async () => {
              await container.resolve(AuthClient).signOut()
              fetcher.submit({}, { method: 'GET', action: Routes.logout })
            }}
          >
            <Icons.logout className="size-5" />
            <TypographyParagraph size={'small'} className="text-muted-foreground group-hover:text-violet-500">
              {'Sign Out'}
            </TypographyParagraph>
          </div>
          <Separator />
          <DeleteAccount userId={data.user.id} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
