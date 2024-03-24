import { cn } from '@app/utils/ui.utils'
import { Fragment } from 'react'
import { NavLink } from './NavLink'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  return (
    <nav className={cn('flex space-x-2 overflow-x-scroll lg:space-x-0 lg:space-y-1 xl:flex-col', className)} {...props}>
      {items.map(item => {
        return (
          <Fragment key={item.href}>
            {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
            <NavLink link={item} />
          </Fragment>
        )
      })}
    </nav>
  )
}
