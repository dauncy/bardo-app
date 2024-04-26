import { AdminAuthService } from '@app/services/auth/auth-server.service'
import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { parse } from 'qs'
import { container } from 'tsyringe'
import { z } from 'zod'
import { render } from '@react-email/render'
import { ResetEmailTemplate } from '@app/fixtures/emails/ResetEmail'
import { emailCLient } from '@app/services/email.service'
import { LoggerStore } from '@app/services/logger.service'

const resetSchema = z.object({
  email: z.string().email(),
})

const logger = LoggerStore.getLogger('ResetPasswordAPI')
const adminAuth = container.resolve(AdminAuthService)
export const action = async (ctx: ActionFunctionArgs) => {
  try {
    const body = await ctx.request.text()
    const formD = parse(body)
    const { email } = resetSchema.parse(formD)
    const link = await adminAuth.getPasswordResetLink({ email })
    const html = render(<ResetEmailTemplate email={email} passwordResetLink={link} />)

    await emailCLient.sendEmail({
      From: 'noreply@bardo.app',
      To: email,
      Subject: 'Bardo App - password reset request',
      HtmlBody: html,
    })
    return json({ success: true, error: null })
  } catch (e: any) {
    logger.error({ e }, 'Failed to send password reset email')
    return json({ success: false, error: e?.message ?? 'unexpected server error' })
  }
}
