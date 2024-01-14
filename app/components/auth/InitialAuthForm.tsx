import { AuthClient } from "@app/services/auth/auth-client.service";
import { AuthStep } from "@app/types/auth";
import { Form } from "@remix-run/react";
import { Button } from "app/components/bardo/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "app/components/bardo/Card";
import { Label } from "app/components/bardo/Label";
import { Separator } from "app/components/bardo/Separator";
import { TypographyParagraph } from "app/components/bardo/typography/TypographyParagraph";
import { Dispatch, SetStateAction, useState } from "react";
import { container } from "tsyringe";
import { Icons } from "@app/components/bardo/Icons";
import { Input } from "@app/components/bardo/Input";
import { z, ZodError } from "zod";

const authSvc = container.resolve(AuthClient);
const emailSchema = z.object({ email: z.string().email() });

export const InitialAuthForm = ({ 
  setAuthStep,
  setCurrentEmail, 
}: { 
  setAuthStep: Dispatch<SetStateAction<AuthStep>>,
  setCurrentEmail: Dispatch<SetStateAction<string>>
}) => {
  const [error, setError] = useState('');

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{"Login or Sign up"}</CardTitle>
        <TypographyParagraph className="leading-3 font-light" size={'small'}>{"Enter your email to continue to bardo"}</TypographyParagraph>
      </CardHeader>
      <CardContent className="gap-y-2 flex flex-col">
        <Form 
          className="flex flex-col gap-y-1 relative" 
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const { email: maybeEmail } = Object.fromEntries(formData);

            try {
              const { email } = emailSchema.parse({ email: maybeEmail });
              const exists = await authSvc.checkEmailExists({ email });
              if (exists) {
                setAuthStep(AuthStep.SIGN_IN);
              } else {
                setAuthStep(AuthStep.SIGN_UP);
              }
              setCurrentEmail(email);
            } catch (e) {
              if (e instanceof ZodError) {
                setError('Enter a valid email')
              }
              return;
            }
          }}
          navigate={false}
        >
          <div className="flex-col gap-y-3 w-full flex h-full">
            <Label 
              className="peer peer-[&:not(:placeholder-shown):not(:focus):invalid]:text-red-500" 
              htmlFor="email"
            >
              {"email"}
            </Label>
            <Input 
              name="email"
              type={'email'}
              className="peer"
              required={true}
              placeholder={'hello@bardo.app'}
            />
            
            <Button className="uppercase py-5 mt-3 peer-invalid:opacity-40 peer-invalid:hover:bg-violet-800 peer-invalid:cursor-not-allowed" variant={'bardo_primary'} type={'submit'}>{"Continue"}</Button>
          </div>
        </Form>
        
        <Separator  className="flex my-5"/>
        <Button 
          variant={'secondary'} 
          className="gap-x-2 items-center py-5" 
          onClick={async () => {
            const authSvc = container.resolve(AuthClient);
            await authSvc.signInWithGoogle()
          }}>
          <Icons.google className="h-5 w-5"/>
          {"Continue with Google"}
        </Button>
      </CardContent>
    </Card>
  )
}