import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
let isHydrating = true

export const ClientOnly = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const [isHydrated, setIsHydrated] = useState(!isHydrating)

  useEffect(() => {
    isHydrating = false
    setIsHydrated(true)
  }, [])

  if (isHydrated) {
    return <>{children}</>
  } else {
    return <div />
  }
}
