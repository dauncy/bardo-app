/* eslint-disable react/jsx-pascal-case */
import { DownloadButton } from '@app/components/admin/DownloadButton'
import { StatisticsChart } from '@app/components/admin/StatisticsChart'
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/bardo/Card'
import { Icons } from '@app/components/bardo/Icons'
import { MainNav } from '@app/components/nav/MainNav'
import { prisma } from '@app/db.server'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import { json, redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

const validateRequest = async (ctx: LoaderFunctionArgs) => {
  const { user, authProfile } = await getAccountInfo(ctx.request)
  if (!user || !authProfile) {
    throw redirect('/')
  }

  return { user }
}

type DateRange = { start: Date; end: Date }

const getStartOfMonth = (date: Date) => {
  const today = new Date(date)
  today.setDate(1) // Set the date to the first day of the month
  return today
}

const getEndOfMonth = (date: Date) => {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return lastDay
}

const getMonthsAgo = (numMonths: number) => {
  const today = new Date()
  today.setMonth(today.getMonth() - numMonths)
  return today
}

const getJournals = async (range: DateRange) => {
  const count = await prisma.journal.count({
    where: {
      AND: [{ created_at: { lte: range.end } }, { created_at: { gte: range.start } }],
    },
  })
  return {
    month: range.start.getMonth(),
    count,
  }
}

const getUsers = async (range: DateRange) => {
  const count = await prisma.user.count({
    where: {
      AND: [{ created_at: { lte: range.end } }, { created_at: { gte: range.start } }],
    },
  })
  return {
    month: range.start.getMonth(),
    count,
  }
}

const getAggregatedJournals = async () => {
  const currentMonth = new Date().getMonth()
  const sortedMonths = Array.from({ length: 12 }, (_, i) => (currentMonth + i) % 12)
  const currentIndex = sortedMonths.indexOf(currentMonth)

  // Move current month to the end of the array
  if (currentIndex !== -1) {
    sortedMonths.splice(currentIndex, 1)
    sortedMonths.push(currentMonth)
  }

  return await Promise.all(
    sortedMonths.map(async num => {
      if (num === 0) {
        const endDate = getEndOfMonth(new Date())
        return await getJournals({ start: getStartOfMonth(getMonthsAgo(num)), end: endDate })
      } else {
        const startDate = getStartOfMonth(getMonthsAgo(num))
        const endDate = getEndOfMonth(getMonthsAgo(num))
        return await getJournals({ start: startDate, end: endDate })
      }
    }),
  )
}

const getAggregatedUsers = async () => {
  const currentMonth = new Date().getMonth()
  const sortedMonths = Array.from({ length: 12 }, (_, i) => (currentMonth + i) % 12)
  const currentIndex = sortedMonths.indexOf(currentMonth)

  // Move current month to the end of the array
  if (currentIndex !== -1) {
    sortedMonths.splice(currentIndex, 1)
    sortedMonths.push(currentMonth)
  }

  return await Promise.all(
    sortedMonths.map(async num => {
      if (num === 0) {
        const endDate = getEndOfMonth(new Date())
        return await getUsers({ start: getStartOfMonth(getMonthsAgo(num)), end: endDate })
      } else {
        const startDate = getStartOfMonth(getMonthsAgo(num))
        const endDate = getEndOfMonth(getMonthsAgo(num))
        return await getUsers({ start: startDate, end: endDate })
      }
    }),
  )
}

const MONTH: { [key: number]: string } = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
}
export const loader = async (ctx: LoaderFunctionArgs) => {
  const { user } = await validateRequest(ctx)
  const currentDate = new Date()
  const lastMonthDate = new Date(currentDate)
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)

  const { totalUsers, usersThisMonth, totalJournals, journalsThisMonth } = await prisma.$transaction(async tx => {
    const totalUsers = await prisma.user.count()

    const usersThisMonth = await prisma.user.count({
      where: {
        created_at: {
          gte: lastMonthDate,
          lte: currentDate,
        },
      },
    })

    const totalJournals = await prisma.journal.count()

    const journalsThisMonth = await prisma.journal.count({
      where: {
        created_at: {
          gte: lastMonthDate,
          lte: currentDate,
        },
      },
    })

    return {
      totalUsers,
      usersThisMonth,
      totalJournals,
      journalsThisMonth,
    }
  })

  const [journalStats, userStats] = await Promise.all([getAggregatedJournals(), getAggregatedUsers()])
  const currentMonth = new Date().getMonth()
  const sortedMonths = Array.from({ length: 12 }, (_, i) => (currentMonth + i) % 12)
  const currentIndex = sortedMonths.indexOf(currentMonth)

  // Move current month to the end of the array
  if (currentIndex !== -1) {
    sortedMonths.splice(currentIndex, 1)
    sortedMonths.push(currentMonth)
  }
  const journal_stats = []
  const user_stats = []
  const a = sortedMonths
  for (let i = 0; i < a.length; i++) {
    const j_stat = journalStats.find(s => s.month === a[i])
    const u_stat = userStats.find(u => u.month === a[i])
    if (j_stat) {
      journal_stats.push(j_stat)
    }

    if (u_stat) {
      user_stats.push(u_stat)
    }
  }
  return json({
    currentUser: user,
    totalJournals,
    totalUsers,
    usersThisMonth,
    journalsThisMonth,
    userStats: user_stats.map(s => {
      return {
        name: MONTH[s.month],
        total: s.count,
      }
    }),
    journalStats: journal_stats.map(s => {
      return {
        name: MONTH[s.month],
        total: s.count,
      }
    }),
  })
}

export default function AdminPage() {
  const { currentUser, totalJournals, totalUsers, usersThisMonth, journalsThisMonth, journalStats, userStats } =
    useLoaderData<typeof loader>()
  return (
    <div className="relative flex h-max min-h-full w-full min-w-full flex-col">
      <MainNav user={currentUser} />
      <div className="size full flex min-h-full flex-1 flex-col items-center bg-violet-50 px-4  pt-[66px]">
        <div className="mx-auto flex min-h-full w-full max-w-7xl flex-1 flex-col gap-y-4 py-5 md:px-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card className="rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">{'Total Users'}</CardTitle>
                <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                  <Icons.Users className="size-4 text-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{totalUsers}</div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">{'Users this month'}</CardTitle>
                <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                  <Icons.UserPlus className="size-4 text-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{`+${usersThisMonth}`}</div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">{'Total Journals'}</CardTitle>
                <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                  <Icons.archive className="size-4 text-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{totalJournals}</div>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">{'Journals this month'}</CardTitle>
                <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                  <Icons.NotebookPen className="size-4 text-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{`+${journalsThisMonth}`}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid h-max min-h-full w-full flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="h-max min-h-full flex-1 rounded-xl">
              <CardHeader className="flex w-full flex-row items-center justify-between">
                <CardTitle>{'User Statistics'}</CardTitle>
                <DownloadButton type={'EXPORT_USERS'} />
              </CardHeader>
              <CardContent className="pl-2">
                <StatisticsChart stats={userStats} />
              </CardContent>
            </Card>
            <Card className="h-max min-h-full flex-1 rounded-xl">
              <CardHeader className="flex w-full flex-row items-center justify-between">
                <CardTitle>{'Journal Statistics'}</CardTitle>
                <DownloadButton type={'EXPORT_JOURNALS'} />
              </CardHeader>
              <CardContent className="pl-2">
                <StatisticsChart stats={journalStats} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
