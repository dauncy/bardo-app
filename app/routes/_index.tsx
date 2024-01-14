import { AuthForm } from "@app/components/auth/AuthForm";
import { Button } from "@app/components/bardo/Button";
import { TypographyParagraph } from "@app/components/bardo/typography/TypographyParagraph";
import { AuthClient } from "@app/services/auth/auth-client.service";
import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Link, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { container } from 'tsyringe'
import { stringify } from "qs";
import { Routes } from "@app/services/routes.service";
import { AdminAuthService } from "@app/services/auth/auth-server.service";
import { Card, CardContent, CardHeader } from "@app/components/bardo/Card";
import { Icons } from "@app/components/bardo/Icons";

const authSvc = container.resolve(AuthClient);

export const meta: MetaFunction = () => {
  return [
    { title: "Bardo" },
    { name: "description", content: "Psychedilic journal" },
  ];
};

export const loader = async(ctx: LoaderFunctionArgs) => {
  const adminAuth = container.resolve(AdminAuthService);
  const isAuthenticated = await adminAuth.isAuthenticated(ctx.request);
  if (isAuthenticated) {
    return redirect(Routes.users)
  }
  return null;
}

export default function Index() {
  const submit = useSubmit();
  const [checkingAuth, setCheckingAuth] = useState(false);

  useEffect(() => {
    async function onRedirect() {
      setCheckingAuth(true)
      const user = await authSvc.getRedirectRes();
      const idToken = await user?.user?.getIdToken();
      if (!idToken) {
        setCheckingAuth(false)
        return;
      }
      return submit({ idToken }, { action: Routes.login })
    }
    onRedirect();
  }, [])
  return (
    <div className="h-screen w-screen reltaive bg-neutral-50">
      <div className="mx-auto max-w-screen-2xl w-full flex h-full flex-col md:flex-row items-stretch">
        <div className="h-full flex-1 flex bg-violet-200 w-full items-center justify-center flex-col gapy-4">
          <div className="flex flex-col mt-0 md:mt-auto ">
            <h1 className="uppercase text-5xl font-bold">{"Bardo App"}</h1>
            <TypographyParagraph size={'large'} className="ml-1">{"Psychedelic journal"}</TypographyParagraph>
          </div>
          
          <div className="hidden md:flex items-center gap-x-4 mt-auto">
            <Link to={'#'}>
              <Button variant={'link'}>
                <TypographyParagraph size={'extraSmall'}>{'Privacy Policy'}</TypographyParagraph>
              </Button>
            </Link>
            <Link to={'#'}>
              <Button variant={'link'}>
                <TypographyParagraph size={'extraSmall'}>{'Privacy Policy'}</TypographyParagraph>
              </Button>
            </Link>
          </div>
        </div>
        <div className="h-full flex-1  w-full flex items-center justify-center py-0 pt-5 md:pt-0 pb-2 md:pb-0 md:py-5 px-4 bg-violet-200 md:bg-transparent flex-col">
          <AuthForm />
          <div className="flex md:hidden gap-x-4 mt-auto">
            <Link to={'#'}>
              <Button variant={'link'}>
                <TypographyParagraph size={'extraSmall'}>{'Privacy Policy'}</TypographyParagraph>
              </Button>
            </Link>
            <Link to={'#'}>
              <Button variant={'link'}>
                <TypographyParagraph size={'extraSmall'}>{'Privacy Policy'}</TypographyParagraph>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {
        checkingAuth && 
          <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-2 flex items-center justify-center">
            <Card className="animate-in zoom-in max-w-md w-full min-h-[250px flex items-center justify-center py-5 px-4">
              <CardContent className="flex gap-x-4 p-0 items-center">
                <Icons.loader className="h-8 w-8 text-violet-600 animate-spin"/>
                <TypographyParagraph size={'large'}>{'Signing in...'}</TypographyParagraph>
              </CardContent>
            </Card>
          </div>
      }
    </div>
  );
}
