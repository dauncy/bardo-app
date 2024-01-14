import { authenticateSchema } from "@app/types/auth";
import { getSearchParams } from "@app/utils/server.utils/search-params.utils";
import { LoaderFunctionArgs } from "@remix-run/node";
import { container } from "tsyringe";
import { AdminAuthService } from '@app/services/auth/auth-server.service'


export const loader = async(ctx: LoaderFunctionArgs) => {
  const adminAuth = container.resolve(AdminAuthService);
  return await adminAuth.authenticate(ctx.request)
}