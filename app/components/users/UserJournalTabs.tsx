import { Tabs, TabsList, TabsTrigger } from '@app/components/bardo/Tabs'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import type { User } from '@prisma/client'
import { Link, useOutletContext, useSearchParams } from '@remix-run/react'

export const UserJournalTabs = () => {
  const { currentUser } = useOutletContext<{ currentUser: User | null }>()
  const userId = currentUser?.id ?? ''
  const [search] = useSearchParams()
  const publicath = `/users/${userId}`
  const draftPath = `/users/${userId}?type=draft`
  const privatePath = `/users/${userId}?type=private`
  const defaultPath = () => {
    const type = search.get('type')
    if (!type) {
      return 'public'
    }
    if (['private', 'draft'].includes(type)) {
      return type
    }
    return 'public'
  }

  return (
    <Tabs value={defaultPath()} className="w-full rounded-md border border-foreground/80 bg-white p-1 md:w-max">
      <TabsList className="grid h-full w-full grid-cols-3 bg-transparent p-0">
        <Link to={publicath} className="col-span-1">
          <TabsTrigger
            value={'public'}
            className="group w-full font-medium data-[state=active]:bg-violet-600 data-[state-active]:text-red-300"
          >
            <TypographyParagraph className="font-medium text-foreground/80 group-data-[state=active]:text-white">
              {'Public Posts'}
            </TypographyParagraph>
          </TabsTrigger>
        </Link>

        <Link to={privatePath} className="col-span-1">
          <TabsTrigger
            value={'private'}
            className="group w-full font-medium data-[state=active]:bg-violet-600 data-[state-active]:text-white"
          >
            <TypographyParagraph className="font-medium text-foreground/80 group-data-[state=active]:text-white">
              {'Private Posts'}
            </TypographyParagraph>
          </TabsTrigger>
        </Link>
        <Link to={draftPath} className="col-span-1">
          <TabsTrigger
            value={'draft'}
            className="group w-full font-medium data-[state=active]:bg-violet-600 data-[state-active]:text-white"
          >
            <TypographyParagraph className="font-medium text-foreground/80 group-data-[state=active]:text-white">
              {'Drafts'}
            </TypographyParagraph>
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  )
}
