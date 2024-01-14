import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async(ctx: LoaderFunctionArgs) => {
  return 'callback'
}