import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@app/components/bardo/Card"
import { TypographyParagraph } from "@app/components/bardo/typography/TypographyParagraph"
import { Form, Link, useSubmit } from "@remix-run/react"
import { Button } from "@app/components/bardo/Button"
import { Input } from "@app/components/bardo/Input"
import { Label } from "@app/components/bardo/Label"
import { z, ZodError } from "zod"
import { AuthClient } from "@app/services/auth/auth-client.service"
import { container } from "tsyringe"
import { Routes } from "@app/services/routes.service"
import { Dispatch, SetStateAction, useState } from "react"
import { Icons } from "@app/components/bardo/Icons"
import { AuthStep } from "@app/types/auth"

const authSvc = container.resolve(AuthClient);

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2, 'your password is too short').max(32, 'your passowrd is too long.'),
})


export const SignUpForm = ({ currentEmail, setAuthStep }: { currentEmail: string; setAuthStep: Dispatch<SetStateAction<AuthStep>> }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = useSubmit();

  return(
    <Card className="w-full max-w-sm">
      <CardHeader>
      <Icons.arrowBack 
          onClick={() => setAuthStep(AuthStep.INTIAL)}
          className="h-5 w-5 text-black cursor-pointer" 
          role={'button'}
        />
        <CardTitle className="text-xl">{"Create your account"}</CardTitle>
        <TypographyParagraph className="leading-4 font-light" size={'small'}>{"Enter a password and click Continue to create your account."}</TypographyParagraph>
      </CardHeader>
      <CardContent className="gap-y-2 flex flex-col">
        <Form
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            const formData = new FormData(e.currentTarget);
            const values = Object.fromEntries(formData);

            try {
              const data = signUpSchema.parse(values);
              setLoading(true);
              const userCred = await authSvc.signUpWithEmailAndPassword({ email: data.email, password: data.password });
              const idToken = await userCred.user.getIdToken();
              if (!idToken) {
                throw new Error('no idToken');
              }
              submit({ idToken }, { action: Routes.login })
              
            } catch (e) {
              if (e instanceof ZodError) {
                setError('Enter a valid password')
              } else {
                setError('Something went wrong');
              }
            }
            setLoading(false);
          }}
          className="gap-y-2 flex flex-col"
          navigate={false}
        >
          <Label htmlFor="name">{"email"}</Label>
          <input type={'hidden'} name={'email'} value={currentEmail} />
          <Input type={'email'} name={'email_display'} value={currentEmail} disabled={true} className="bg-violet-200"/>

          <Label 
            className="mt-3"
            htmlFor={'password'}
          >
            {"password"}
          </Label>
          <Input 
            type={'password'} 
            name={'password'} 
            required={true} placeholder="enter password" 
          />

          <Button
            disabled={loading}
            variant={'bardo_primary'} 
            className="mt-3 uppercase peer peer-invalid:opacity-40 peer-invalid:cursor-not-allowed peer-invalid:hover:bg-violet-900 gap-x-2 items-center" 
            type={'submit'}
          > 
            { loading && <Icons.loader className="h-5 w-5 animate-spin text-white/90" />}
            {"Continue"}
          </Button>
          { error && 
            <div className="absolute -bottom-6 inline-flex items-center gap-x-2">
              <Icons.alertCircle className="h-4 w-4 text-red-500"/>
              <TypographyParagraph size={'small'} className="text-red-500">{error}</TypographyParagraph>
            </div>
          }
        </Form>
      </CardContent>
      <CardFooter className="px-10">
        <TypographyParagraph className="text-center font-light" size={'extraSmall'}>
          <span>
            {'By creating an account, you aggree to Bardo\'s'}
          </span>
          <span>{' '}</span>
          <span className="font-medium cursor-pointer hover:underline">
            <Link to={'href'}>
              {'terms of service'}
            </Link>
          </span>
          <span>{' and '}</span>
          <span className="font-medium cursor-pointer hover:underline">
            <Link to={'#'}>
              {'privacy policy'}
            </Link>
          </span>
        </TypographyParagraph>
      </CardFooter>
    </Card>
  )
}