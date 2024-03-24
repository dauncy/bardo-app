/* eslint-disable react/jsx-pascal-case */
import { useFetcher } from '@remix-run/react'
import { Button } from '../bardo/Button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '../bardo/Dialog'
import { Icons } from '../bardo/Icons'
import type { UserCrudPayload } from '@app/types/users'
import { stringify } from 'qs'
import { TypographyParagraph } from '../bardo/typography/TypographyParagraph'

export const DeleteAccount = ({ userId }: { userId: string }) => {
  const fetcher = useFetcher()
  const pending = fetcher.state === 'loading' || fetcher.state === 'submitting'
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'destructive'} className="flex w-full">
          {'Delete Account'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <TypographyParagraph size={'medium'}>{'Are you sure you want to delete your account'}</TypographyParagraph>
        </DialogHeader>
        <DialogDescription>
          <TypographyParagraph size={'small'} className="text-muted-foreground">
            {'By deleting your account, you will lose access to all of your posts and data.'}
          </TypographyParagraph>
        </DialogDescription>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant={'secondary'}>{'Cancel'}</Button>
          </DialogTrigger>
          <Button
            disabled={pending}
            variant={'destructive'}
            className="flex items-center gap-x-2"
            onClick={() => {
              const payload: UserCrudPayload = {
                _action: 'DELETE_USER',
              }
              fetcher.submit(stringify(payload), { method: 'POST' })
            }}
          >
            {pending && <Icons.loader className="size-5 animate-spin text-white/90" />}
            {'Delete My Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
