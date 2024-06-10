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
  const { accessToken, saveAccessToken } = useAuthData();
  const [isClient, setIsClient] = useState(false);

  // On load, check if there's an existing access token
  const checkAccessToken = (event: MessageEvent) => {
    if (event.data.pluginMessage.message === 'GET_EXISTING_ACCESS_TOKEN') {
      const accessToken = event.data.pluginMessage.accessToken
      // Check if that token works
      // and save it to use with network requests
      console.log('Existing access token', event.data.pluginMessage)
      saveAccessToken(accessToken)
    }
  }

  useEffect(() => {
    window.addEventListener('message', checkAccessToken);
    console.log('Access token checked', accessToken)

    return () => {
      window.removeEventListener('message', checkAccessToken)
      console.log('Removed checkAccessToken event listener')
    }
  }, [])

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
