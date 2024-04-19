/* eslint-disable react/jsx-pascal-case */
import { Button } from '@app/components/bardo/Button'
import { Icons } from '@app/components/bardo/Icons'
import { Input } from '@app/components/bardo/Input'
import { Label } from '@app/components/bardo/Label'
import { UpdateUserProfileImage } from '@app/components/users/UpdateUserProfileImage'
import { ClientOnly } from '@app/components/utility/ClientOnly'
import type { UserCrudPayload } from '@app/types/users'
import { UserRouteParamsSchema, userCrudSchema } from '@app/types/users'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import { getFormData } from '@app/utils/server.utils/forms.utils'
import { getSearchParams } from '@app/utils/server.utils/search-params.utils'
import type { User } from '@prisma/client'
import { redirect } from '@remix-run/node'
import type { ActionFunctionArgs } from '@remix-run/node'
import { useFetcher, useOutletContext } from '@remix-run/react'
import { useRef } from 'react'
import { prisma } from '@app/db.server'
import { sleep } from '@app/utils/server.utils/async.utils'
import { useToast } from '@app/components/bardo/toast/use-toast'
import { stringify } from 'qs'
import { ZodError } from 'zod'
import { Separator } from '@app/components/bardo/Separator'

const validateRequest = async (ctx: ActionFunctionArgs) => {
  const { authProfile, user } = await getAccountInfo(ctx.request)
  if (!authProfile || !user) {
    throw redirect('/logout')
  }

  return { user, authProfile }
}
export const action = async (ctx: ActionFunctionArgs) => {
  const { userId } = getSearchParams(ctx, UserRouteParamsSchema)
  const { user } = await validateRequest(ctx)
  if (userId !== user.id) {
    return null
  }

  const body = await getFormData(ctx, userCrudSchema)
  await sleep(500)
  switch (body._action) {
    case 'UPDATE_USER':
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: body.data.name,
        },
      })
    default:
      return null
  }
}
export default function UserSettingsPage() {
  const usernameRef = useRef<HTMLInputElement>(null)
  const fetcher = useFetcher()
  const pending = fetcher.state === 'loading' || fetcher.state === 'submitting'
  const { toast } = useToast()
  const { currentUser } = useOutletContext<{ currentUser: User }>()

  const userName = () => {
    if (currentUser.name) {
      return currentUser.name
    }

    let defaultName = `bardo_user`
    if (currentUser.user_id < 10) {
      defaultName += `_00${currentUser.user_id}`
    }

    if (currentUser.user_id < 100) {
      defaultName += `_0${currentUser.user_id}`
    }

    if (currentUser.user_id >= 100) {
      defaultName += `_${currentUser.user_id}`
    }
    return defaultName
  }

  return (
    <div className="flex h-full w-full flex-col gap-y-2 p-5">
      <h1 className="font-foreground font-medium text-2xl">{'Public Profile'}</h1>
      <div className="w-full">
        <p className="mb-2 border-l border-l-2 border-violet-400 pl-4 text-sm font-normal italic text-foreground/60">
          {
            'This is public data. This is how other users will see you on your publicly shared experiences. You can always change or update this stuff later.'
          }
        </p>
      </div>
      <Separator className="mb-6" />

      <div className="flex h-full flex-col pt-8">
        <Label>{'Username'}</Label>
        <Input
          min={1}
          ref={usernameRef}
          required
          defaultValue={userName()}
          className="peer mt-1 focus-visible:border-violet-400 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:bg-violet-100 md:max-w-sm"
          disabled={pending}
        />
        <div className="mt-8">
          <ClientOnly>
            <UpdateUserProfileImage user={currentUser} />
          </ClientOnly>
        </div>
        <Button
          disabled={pending}
          variant={'bardo_primary'}
          className="mt-16 mt-auto flex min-w-40 items-center gap-x-2 peer-invalid:cursor-not-allowed peer-invalid:opacity-40 md:ml-auto md:max-w-sm"
          onClick={() => {
            const username = usernameRef.current?.value?.trim()
            if (!username) {
              return
            }

            const payload: UserCrudPayload = {
              _action: 'UPDATE_USER',
              data: {
                name: username,
              },
            }

            try {
              const verified = userCrudSchema.parse(payload)
              fetcher.submit(stringify(verified), { method: 'POST' })
            } catch (e) {
              if (e instanceof ZodError) {
                const msg = e.errors.map(e => e.message).join(', ')
                toast({ variant: 'destructive', title: 'Failed to update user.', description: msg })
              } else {
                toast({
                  variant: 'destructive',
                  title: 'Failed to update user.',
                  description: 'An unexpected error occurred',
                })
              }
            }
          }}
        >
          {pending && <Icons.loader className="size 4 animate-spin text-white/90" />}
          {'Next'}
        </Button>
      </div>
    </div>
  )
}
