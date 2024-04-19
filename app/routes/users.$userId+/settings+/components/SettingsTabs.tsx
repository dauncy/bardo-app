import { Tabs, TabsList, TabsTrigger } from '@app/components/bardo/Tabs'
import { TypographyParagraph } from '@app/components/bardo/typography/TypographyParagraph'
import { Link, useLocation } from '@remix-run/react'

export const SettingsTabs = ({ userId }: { userId: string }) => {
  const { pathname } = useLocation()

  const profilePath = `/users/${userId}/settings`
  const demoPath = `/users/${userId}/settings/demographics`
  const defaultPath = pathname === demoPath ? 'demographics' : 'profile'
  return (
    <Tabs defaultValue={defaultPath} className="w-full rounded-md border border-foreground/80 bg-white p-1 md:w-max">
      <TabsList className="grid h-full w-full grid-cols-2 bg-transparent p-0">
        <Link to={profilePath} className="col-span-1">
          <TabsTrigger
            value={'profile'}
            className="group w-full font-medium data-[state=active]:bg-violet-600 data-[state-active]:text-red-300"
          >
            <TypographyParagraph className="font-medium text-foreground/80 group-data-[state=active]:text-white">
              {'Public Profile'}
            </TypographyParagraph>
          </TabsTrigger>
        </Link>

        <Link to={demoPath} className="col-span-1">
          <TabsTrigger
            value={'demographics'}
            className="group w-full font-medium data-[state=active]:bg-violet-600 data-[state-active]:text-white"
          >
            <TypographyParagraph className="font-medium text-foreground/80 group-data-[state=active]:text-white">
              {'Private Info'}
            </TypographyParagraph>
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  )
}
