/* eslint-disable react/jsx-pascal-case */
import type { SerializeFrom } from '@remix-run/node'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@app/components/bardo/Card'
import { Separator } from '@app/components/bardo/Separator'
import type { Journal, User } from '@prisma/client'
// import { Popover, PopoverContent, PopoverTrigger } from '@app/components/bardo/Popover'
// import { Icons } from '@app/components/bardo/Icons'
import { Badge } from '@app/components/bardo/Badge'
import { UserAvatar } from '@app/components/users/UserAvatar'
import { JournalBody } from './JournalBody'

// const JournalCardMenu = () => {
//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <div className="absolute right-2 top-2 flex cursor-pointer items-center justify-center">
//           <Icons.more className="size-6 text-violet-400" />
//         </div>
//       </PopoverTrigger>
//       <PopoverContent className="max-w-sm" side="left"></PopoverContent>
//     </Popover>
//   )
// }

export const JournalCard = ({ journal }: { journal: SerializeFrom<Journal & { user: SerializeFrom<User> }> }) => {
  return (
    <Card className="relative w-full cursor-default px-0">
      {/* <JournalCardMenu /> */}
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
      <Separator className="my-3" />
      <CardFooter />
    </Card>
  )
}
