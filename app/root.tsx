import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/styles/tailwind.css?url";
import { useContext, useEffect, useState } from "react";
import { AuthContext, AuthProvider, IAuthContext } from 'react-oauth2-code-pkce'
import { authConfig } from "./authConfig";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

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
  );
}

export default function App() {
  const { token } = useContext(AuthContext)
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate()

  const handleAccessToken = (event: MessageEvent) => {
    if (event?.data?.pluginMessage?.message === 'GET_EXISTING_ACCESS_TOKEN') {
      const token = event?.data?.pluginMessage?.accessToken;
      // Check if that token works
      // and save it to use with network requests
      console.log(token)
    }
  };

  // Set isClient to true when component mounts
  // Ensures access to localStorage
  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    window.addEventListener('message', handleAccessToken);

    // Navigate to _auth.login if accessToken is null
    if (token === null) {
      navigate('/login')
    }

    return () => {
      window.removeEventListener('message', handleAccessToken)
    }
  }, [token])

  return (
    isClient ? (
      <AuthProvider authConfig={authConfig}>
        <Outlet />
      </AuthProvider>
    ) : (
      <Outlet />
    )
  )
}
