import { getAccountInfo } from "@app/utils/server.utils/account.utils";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

const validateRequest = async(ctx: LoaderFunctionArgs) => {
  const { authProfile } = await getAccountInfo(ctx.request);
  return { authProfile }
}
export const loader = async(ctx: LoaderFunctionArgs) => {
  const { authProfile } = await validateRequest(ctx);
  return json({
    authProfile
  })
}

export default function UserPage() {
  const { authProfile } = useLoaderData<typeof loader>()
  return(
    <div className="h-full w-full min-h-screen min-w-screen flex items-center justify-center">
      <pre>
        {JSON.stringify(authProfile, null, 2)}
      </pre>
    </div>
  )
}