import { Routes } from '@app/services/routes.service'
import { getAccountInfo } from '@app/utils/server.utils/account.utils'
import type { ActionFunctionArgs, NodeOnDiskFile } from '@remix-run/node'
import os from 'node:os'
import path from 'path'
import { promises as fs } from 'fs'
import {
  json,
  redirect,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  unstable_createFileUploadHandler,
  unstable_composeUploadHandlers,
} from '@remix-run/node'
import axios from 'axios'
import { container } from 'tsyringe'
import { Config } from '@app/config/configuration'
import { prisma } from '@app/db.server'

const validateRequest = async (ctx: ActionFunctionArgs) => {
  const { authProfile, user } = await getAccountInfo(ctx.request)
  if (!user || !authProfile) {
    throw redirect(Routes.logout)
  }
  return { authProfile, user }
}

export const action = async (ctx: ActionFunctionArgs) => {
  const config = container.resolve(Config)
  const { user } = await validateRequest(ctx)
  const osTempDir = os.tmpdir()
  try {
    const tempDir = await fs.mkdtemp(path.join(osTempDir, `/${user.id}`))
    const formData = await unstable_parseMultipartFormData(
      ctx.request,
      unstable_composeUploadHandlers(
        unstable_createFileUploadHandler({
          // Limit file upload to images
          filter({ contentType }) {
            return contentType.includes('image')
          },
          // Store the images in the public/img folder
          directory: tempDir,
          // By default, `unstable_createFileUploadHandler` adds a number to the file
          // names if there's another with the same name; by disabling it, we replace
          // the old file
          avoidFileConflicts: false,
          // Use the actual filename as the final filename
          file({ filename }) {
            return filename
          },
          // Limit the max size to 10MB
          maxPartSize: 10 * 1024 * 1024,
        }),
        unstable_createMemoryUploadHandler(),
      ),
    )

    const files = formData.getAll('file') as NodeOnDiskFile[]
    const fileToUpload = files[0]
    if (!fileToUpload) {
      return json({ message: 'bad request' }, { status: 500 })
    }

    const sanitized = fileToUpload.name.split(' ').join('-').toLowerCase()
    const buffer = await fs.readFile(fileToUpload.getFilePath())
    const url = `${config.r2.base_url}/images/users/${user.id}/${sanitized}`
    const res = await axios.put(url, buffer, {
      headers: {
        'X-Bardo-Auth-Key': config.r2.access_key,
      },
      maxBodyLength: 200000000,
    })
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        picture: url,
      },
    })
    return json({ status: res.status, url })
  } catch (e) {
    console.error(e)
    return json({ message: 'Unable to uplaod Image' }, { status: 500 })
  }
}
