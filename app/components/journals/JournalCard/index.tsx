/* eslint-disable react/jsx-pascal-case */
import type { SerializeFrom } from '@remix-run/node'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@app/components/bardo/Card'
import type { Journal, User } from '@prisma/client'
import { Badge } from '@app/components/bardo/Badge'
import { UserAvatar } from '@app/components/users/UserAvatar'
import { JournalBody } from './JournalBody'
import { Popover, PopoverContent, PopoverTrigger } from '@app/components/bardo/Popover'
import { Icons } from '@app/components/bardo/Icons'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { Separator } from '@app/components/bardo/Separator'
import { Link, useFetcher, useOutletContext } from '@remix-run/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@app/components/bardo/Dialog'
import { Button } from '@app/components/bardo/Button'
import { stringify } from 'qs'

const JournalCardMenu = ({ journalId }: { journalId: string }) => {
  const { user } = useOutletContext<{ user: User }>()
  const fetcher = useFetcher()
  const pending = fetcher.state === 'submitting' || fetcher.state === 'loading'
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="absolute right-2 top-2 flex cursor-pointer items-center justify-center">
          <Icons.more className="size-6 text-slate-200 hover:text-violet-600" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="max-w-[224px] p-0" side="left">
        <Link
          to={`/users/${user.id}/journals/${journalId}`}
          className="group flex w-full cursor-pointer items-center gap-x-2 px-4 py-1.5 text-slate-500 hover:bg-violet-50 hover:text-slate-700"
        >
          <Icons.NotebookPen className="size-4" />
          <TypographyParagraph className="text-slate-500 group-hover:text-slate-700">
            {'Edit Journal'}
          </TypographyParagraph>
        </Link>
        <Separator />
        <Dialog>
          <DialogTrigger asChild>
            <div className="group flex w-full cursor-pointer items-center gap-x-2 px-4 py-1.5 text-slate-500 hover:bg-violet-50 hover:text-slate-700">
              <Icons.Trash className="size-4" />
              <TypographyParagraph className="text-slate-500 group-hover:text-slate-700">
                {'Delete Journal'}
              </TypographyParagraph>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{'Are you sure you want to delete this journal'}</DialogTitle>
            <DialogDescription>{'You will not be able to recover this journal after delting it.'}</DialogDescription>
            <DialogFooter>
              <DialogTrigger asChild>
                <Button variant={'secondary'}>{'Cancel'}</Button>
              </DialogTrigger>
              <Button
                disabled={pending}
                className="flex items-center gap-x-2"
                variant={'destructive'}
                onClick={() => {
                  fetcher.submit(
                    stringify({
                      _action: 'DELETE_JOURNAL',
                      data: {
                        id: journalId,
                      },
                    }),
                    { method: 'POST', action: `/users/${user.id}/journals/${journalId}` },
                  )
                }}
              >
                {pending && <Icons.loader className="size-5 animate-spin text-white/90" />}
                {pending ? 'Deleting...' : 'Delete Journal'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PopoverContent>
    </Popover>
  )
}

export const JournalCard = ({ journal }: { journal: SerializeFrom<Journal & { user: SerializeFrom<User> }> }) => {
  const { user } = useOutletContext<{ user: User }>()
  return (
    <Card className="relative w-full cursor-default px-0">
      {journal.user_id === user.id && <JournalCardMenu journalId={journal.id} />}
      <CardHeader className="flex flex-row gap-x-4 px-8 pb-0">
        <UserAvatar user={journal.user} />
        <div className="flex flex-col gap-y-2">
          <CardTitle>{journal.title}</CardTitle>
          <div className="flex w-full flex-wrap items-center gap-2">
            <Badge className="bg-violet-600">{journal.metadata.modality}</Badge>

            <Badge className="bg-[#92a7c5]">
              <span className="capitalize">{journal.metadata.dosage.toLowerCase()}</span>
              &nbsp;
              <span>{'dosage'}</span>
            </Badge>
            <Badge className="capitalize">{journal.metadata.intention.toLowerCase()}</Badge>

            <Badge className="bg-[#f472b6] capitalize">
              {journal.metadata.setting.toLowerCase().split('_').join(' ')}
            </Badge>
          </div>
          <CardDescription>
            {`Last updated: `}
            <span className="font-medium text-black">
              {new Date(journal.updated_at).toLocaleDateString('en', {
                year: 'numeric',
                day: '2-digit',
                month: 'long',
              })}
            </span>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-y-1 px-8 py-5">
        <JournalBody body={journal.body} id={journal.id} />
      </CardContent>
      <CardFooter />
    </Card>
  )
}
