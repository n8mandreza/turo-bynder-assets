import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate
} from "@remix-run/react"
import type { LinksFunction } from "@remix-run/node"
import stylesheet from "~/styles/tailwind.css?url"
import { useContext, useEffect, useState } from "react"
import AuthContext, { AuthProvider, useAuthData } from "./AuthContext"

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
      <body className="bg text font-sans">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const { 
    accessToken, 
    setAccessToken, 
    refreshToken, 
    setRefreshToken 
  } = useAuthData();
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate()

  // On load, check if there's an existing access token
  const handleAccessToken = (event: MessageEvent) => {
    if (event?.data?.pluginMessage?.message === 'GET_EXISTING_ACCESS_TOKEN') {
      const accessToken = event.data.pluginMessage.accessToken
      // Check if that token works
      // and save it to use with network requests
      console.log('Existing access token', accessToken)
      setAccessToken(accessToken)
    }
  }

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)

    // Create a WebSocket connection
    const webSocket = new WebSocket('wss://turo-bynder-deno-websocket.deno.dev')

    // Save token data from WebSocket message to app context
    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Token data via WebSocket', data)
      if (data.message === 'SAVE_ACCESS_TOKEN') {
        // Handle the SAVE_ACCESS_TOKEN message
        const accessToken = data.accessToken
        const refreshToken = data.refreshToken
        setAccessToken(accessToken)
        setRefreshToken(refreshToken)
      }
    }
  }, [])

  // Navigate to _auth.login if accessToken is null
  // useEffect(() => {
  //   if (!accessToken) {
  //     navigate('/login')
  //   }
  // }, [accessToken])

  useEffect(() => {
    window.addEventListener('message', handleAccessToken);

    return () => {
      window.removeEventListener('message', handleAccessToken)
    }
  }, [])

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
