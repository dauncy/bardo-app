/* eslint-disable react/jsx-pascal-case */
import { ClientOnly } from '../utility/ClientOnly'
import { Button } from '../bardo/Button'
import { Icons } from '../bardo/Icons'
import { useState } from 'react'
import type { z } from 'zod'
import type { adminActionSchema } from '@app/types/admin'

const FILENAME = {
  EXPORT_USERS: 'bardo_users',
  EXPORT_JOURNALS: 'bardo_journals',
}
export const DownloadButton = ({ type }: { type: 'EXPORT_USERS' | 'EXPORT_JOURNALS' }) => {
  const [loading, setLoading] = useState(false)
  const handleDownload = async () => {
    setLoading(true)
    const date = new Date().toLocaleDateString('en-US', { dateStyle: 'short' }).split('/').join('-')
    const filename = `${FILENAME[type]}_${date}.csv`

    const data: z.infer<typeof adminActionSchema> = {
      _action: type,
    }
    const res = await fetch('/api/admin/export', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename // specify the filename here
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setLoading(false)
    return
  }
  return (
    <ClientOnly>
      <Button
        onClick={async () => {
          await handleDownload()
        }}
        disabled={loading}
        variant={'ghost'}
        className="disabled:hover-none gap-x-2 text-violet-600 hover:text-violet-800 disabled:cursor-not-allowed"
      >
        {loading ? <Icons.loader className="animate-spin" /> : <Icons.DownloadCloud />}

        {loading ? 'Downloading...' : 'Download'}
      </Button>
    </ClientOnly>
  )
}
