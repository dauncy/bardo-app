import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@app/components/bardo/Card"
import { TypographyParagraph } from "@app/components/bardo/typography/TypographyParagraph"
import { Form, useSubmit } from "@remix-run/react"
import { Button } from "@app/components/bardo/Button"
import { Input } from "@app/components/bardo/Input"
import { Label } from "@app/components/bardo/Label"
import { z, ZodError } from "zod"
import { AuthClient } from "@app/services/auth/auth-client.service"
import { container } from "tsyringe"
import { Routes } from "@app/services/routes.service"
import { Dispatch, SetStateAction, useState } from "react"
import { AuthStep } from "@app/types/auth"
import { Icons } from "@app/components/bardo/Icons"
import { FirebaseError } from "firebase/app"
import { useToast } from "../bardo/toast/use-toast"

const authSvc = container.resolve(AuthClient)
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2).max(32)
});

const errors: { [key: string]: string } = {
  ['auth/wrong-password']: 'Incorect password.'
}

export const SignInForm = ({ currentEmail, setAuthStep }: { currentEmail: string, setAuthStep: Dispatch<SetStateAction<AuthStep>>, }) => {
  const submit = useSubmit();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  return(
    <Card className="w-full max-w-sm">
      <CardHeader>
        <Icons.arrowBack 
          onClick={() => setAuthStep(AuthStep.INTIAL)}
          className="h-5 w-5 text-black cursor-pointer" 
          role={'button'}
        />
        <CardTitle className="text-xl">{"Login"}</CardTitle>
        <TypographyParagraph className="leading-3 font-light" size={'small'}>{"Enter your password to login to your account."}</TypographyParagraph>
      </CardHeader>
      <CardContent className="gap-y-2 flex flex-col">
        <Form
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            const formData = new FormData(e.currentTarget);
            const values = Object.fromEntries(formData);
            try {
              setLoading(true)
              const data = signInSchema.parse(values);
              const userCred = await authSvc.signInWithEmailAndPassword({ ...data });
              const idToken = await userCred.user.getIdToken();
              if (!idToken) {
                throw new Error('no idToken')
              }
              return submit({ idToken }, { action: Routes.login })
            } catch (e) {
              if (e instanceof FirebaseError) {
                const code = e.code;
                const message = code in errors ? errors[code] : 'Something went wrong.';
                setError(message)
              }

              if (e instanceof ZodError) {
                setError('Enter a valid password.')
              }
            }
            setLoading(false)
          }}
          className="gap-y-2 flex flex-col relative"
          navigate={false}
        >
          <Label htmlFor="name">{"email"}</Label>
          <input type={'hidden'} name={'email'} value={currentEmail} />
          <Input type={'email'} name={'email_display'} value={currentEmail} disabled={true} className="bg-violet-200"/>

          <Label className="mt-3">{"password"}</Label>
          <Input 
            className={`peer`}
            type={'password'} 
            name={'password'} 
            required={true} placeholder="enter password" 
          />

          <Button
            disabled={loading} 
            variant={'bardo_primary'} 
            className="mt-3 uppercase peer peer-invalid:opacity-40 peer-invalid:cursor-not-allowed peer-invalid:hover:bg-violet-900 items-center gap-x-2" 
            type={'submit'}
          >
            { loading && <Icons.loader className="h-5 w-5 animate-spin text-white/90" />}
            {"Sign In"}
          </Button>
          { error && 
            <div className="absolute -bottom-6 inline-flex items-center gap-x-2">
              <Icons.alertCircle className="h-4 w-4 text-red-500"/>
              <TypographyParagraph size={'small'} className="text-red-500">{error}</TypographyParagraph>
            </div>
          }
        </Form>
      </CardContent>
      <CardFooter className="p-0 py-3 px-2 pt-4 pb-6">
        <Button variant={'link'} className="text-blue-500" onClick={async () => {
          await authSvc.onForgotPassword({ email: currentEmail });
          toast({
            title: 'Password reset email sent',
            description: `An email to reset your password has be sent to ${currentEmail}`
          })
        }}>
          {'Forgot password?'}
        </Button>
      </CardFooter>
    </Card>
  )
}