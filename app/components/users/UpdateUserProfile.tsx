import { AvatarFallback } from '@radix-ui/react-avatar'
import { Avatar, AvatarImage } from '../bardo/Avatar'
import { ClientOnly } from '../utility/ClientOnly'
import type { User } from '@prisma/client'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../bardo/Tooltip'
import { Icons } from '../bardo/Icons'
import { TypographyParagraph } from '../bardo/typography/TypographyParagraph'
import * as DROPZONE from 'react-dropzone'
import { useState } from 'react'
import { useToast } from '../bardo/toast/use-toast'
import { Label } from '../bardo/Label'

export const UpdateUserProfileImage = ({ user }: { user: User }) => {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(user.picture ?? '')
  const toast = useToast()
  const avatarFallback = () => {
    return user.name?.charAt(0) ?? user.email.charAt(0)
  }
  const { open, getRootProps, getInputProps } = DROPZONE.useDropzone({
    onDrop: async (acceptedFiles: File[], fileRejections, event) => {
      if (fileRejections) {
        toast.toast({ title: 'files rejected', description: fileRejections.map(r => r.errors[0]?.message).join(', ') })
      }
      const newFile = acceptedFiles[0]
      if (!newFile) {
        toast.toast({ title: 'no file chosen', variant: 'destructive' })
        return
      }
      setUploading(true)
      const form = new FormData()
      form.append('file', newFile)
      const res = await fetch('/api/upload/users', { method: 'POST', body: form })
      if (!res.ok || res.status !== 200) {
        const error: { message: string } = await res.json()
        toast.toast({
          title: 'Failed to uplaod image.',
          description: error?.message ?? 'An unexpected server error occured, please try again.',
          variant: 'destructive',
        })
        setUploading(false)
        return
      }
      const data: { staus: number; url: string } = await res.json()
      setImageUrl(data.url)
      setUploading(false)
    },
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpeg', '.webp'],
    },
  })

  return (
    <ClientOnly>
      <div {...getRootProps()} className="group flex w-max cursor-pointer flex-row items-center gap-x-2">
        <button
          className="flex w-max items-center gap-x-2"
          onClick={() => {
            open()
          }}
          disabled={uploading}
        >
          <Avatar className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-md border border-slate-200">
            <AvatarImage src={imageUrl} alt={user.email} className="" />
            <AvatarFallback className="flex h-12 w-12 items-center justify-center rounded-md bg-violet-400 text-white">
              {avatarFallback()}
            </AvatarFallback>
            <div
              className={`
                ${uploading ? 'flex' : 'hidden group-hover:flex'}
                absolute left-0 top-0 z-[1] size-12 rounded-md bg-black/30 backdrop-blur-sm
              `}
            />
            {!uploading && <Upload />}
            {uploading && (
              <div className="absolute left-1/2 top-1/2 z-[2] flex size-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-violet-400 bg-white">
                {/* eslint-disable-next-line react/jsx-pascal-case */}
                <Icons.loader className="size-5 animate-spin text-violet-500" />
              </div>
            )}
          </Avatar>
        </button>
        <Label className="cursor-pointer text-sm text-muted-foreground group-hover:text-violet-500">
          {'Update Image'}
        </Label>
        <input {...getInputProps()} placeholder="hellow" />
      </div>
    </ClientOnly>
  )
}

const Upload = () => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          <div className="absolute left-1/2 top-1/2 z-[2] hidden size-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md border border-violet-400 bg-white group-hover:flex">
            <Icons.Upload className="size-5 text-violet-500" />
          </div>
        </TooltipTrigger>
        <TooltipContent side={'right'} className="hidden bg-violet-800 group-hover:flex">
          <TypographyParagraph size={'extraSmall'} className="text-white">
            {'Upload Image'}
          </TypographyParagraph>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
