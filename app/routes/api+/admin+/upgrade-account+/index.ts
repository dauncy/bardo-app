import { Config } from '@app/config/configuration'
import { prisma } from '@app/db.server'
import { UserRole } from '@prisma/client'
import { type ActionFunctionArgs, json } from '@remix-run/node'
import { container } from 'tsyringe'
import { z } from 'zod'

const upgradeAccountSchema = z.object({
  user_id: z.string(),
  role: z.enum([UserRole.admin, UserRole.authenticated]),
})

const config = container.resolve(Config)
export const action = async (ctx: ActionFunctionArgs) => {
  const API_KEY = ctx.request.headers.get('x-bardo-api-key')
  if (API_KEY !== config.bardo.api_key) {
    return json({ message: 'Unauthorized ' }, { status: 403 })
  }
  const body = await ctx.request.json()
  const { user_id, role } = upgradeAccountSchema.parse(body)
  try {
    const updated = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        roles: {
          push: role,
        },
      },
    })

    return json({ user: updated }, { status: 200 })
  } catch (e) {
    return json({ message: 'Failed to upgrade account', error: e }, { status: 500 })
  }
}
