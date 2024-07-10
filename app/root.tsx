import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react"
import type { LinksFunction } from "@remix-run/node"
import stylesheet from "~/styles/tailwind.css?url"
import { useEffect, useState } from "react"
import { AuthProvider, useAuthData } from "./AuthContext"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="screen-01 text-01 font-sans">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const [isClient, setIsClient] = useState(false);

  // Set client status on mount
  useEffect(() => {setIsClient(true)}, [])

  return (
    isClient ? (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ) : (
      <Outlet />
    )
  )
}
