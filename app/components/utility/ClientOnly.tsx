import { useHydrated } from '@app/utils/client.utils/use-hydrated'
import { ReactNode } from 'react'

export const ClientOnly = ({ children, fallback = null }: { children: () => ReactNode; fallback?: ReactNode }) => {
  return useHydrated() ? <>{children()}</> : <>{fallback}</>
}
