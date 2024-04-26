import { AdminAuthService } from '@app/services/auth/auth-server.service'
import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { parse } from 'qs'
import { container } from 'tsyringe'
import { z } from 'zod'
import { render } from '@react-email/render'
import { ResetEmailTemplate } from '@app/fixtures/emails/ResetEmail'
import { emailCLient } from '@app/services/email.service'

const resetSchema = z.object({
  email: z.string().email(),
})

const adminAuth = container.resolve(AdminAuthService)
export const action = async (ctx: ActionFunctionArgs) => {
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
  return json({ success: true })
}

// export const loader = async (ctx: ActionFunctionArgs) => {
//   const html = render(<ResetEmailTemplate email={"Daniel"} passwordResetLink={""}/>);
//   return html
// }

// export default function Page() {
//   const html: string = useLoaderData()
//   return(
//     <div dangerouslySetInnerHTML={{__html: html }}></div>
//   )
// }
