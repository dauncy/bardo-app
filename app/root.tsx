import 'reflect-metadata'
import type { LinksFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import styles from './tailwind.css'
import { ClientOnly } from '@app/components/utility/ClientOnly'
import { Toaster } from '@app/components/bardo/toast/Toaster'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  {
    rel: 'icon',
    href: '/logo.png',
    type: 'image/png',
  },
]

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <ClientOnly>
          <Toaster />
        </ClientOnly>
      </body>
    </html>
  )
}
