import { Link, useLocation } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { buttonVariants } from '../bardo/Button'
import { cn } from '@app/utils/ui.utils'

export const NavLink = ({ link }: { link: { href: string; title: string } }) => {
  const linkRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  useEffect(() => {
    if (location.pathname === link.href) {
      linkRef?.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }
  }, [location.pathname, link.href])
  return (
    <div
      ref={linkRef}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        location.pathname === link.href
          ? 'bg-violet-400/90 text-white/90 hover:bg-violet-400/90 hover:text-white/90'
          : 'hover:bg-transparent hover:underline',
        'justify-start px-0 py-0',
      )}
    >
      <Link className="w-full px-4 py-2" to={link.href}>
        {link.title}
      </Link>
    </div>
  )
}
