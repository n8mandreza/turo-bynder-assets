import { useEffect, useRef, useState } from "react"
import { useNavigate } from "@remix-run/react"
import { useAuthData } from "~/AuthContext";
import { authConfig } from "~/authConfig"

export default function CallbackRoute() {
  const navigate = useNavigate()
  const [authCode, setAuthCode] = useState<string>('')

  // Prepare WebSocket connection once on component mount
  const webSocketRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    webSocketRef.current = new WebSocket('wss://turo-bynder-deno-websocket.deno.dev');

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close(); // Properly close the WebSocket when the component unmounts
      }
    };
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlCode = urlParams.get('code')

    // Check if there's a code in the URL and if authCode is empty 
    // before setting the value & requesting the accessToken
    if (urlCode && !authCode) {
      setAuthCode(urlCode)

      // Assemble the API token endpoint URL
      const requestParams = new URLSearchParams();
      requestParams.append('client_id', authConfig.clientId);
      requestParams.append('client_secret', String(authConfig.extraTokenParameters?.client_secret) || '');
      requestParams.append('redirect_uri', authConfig.redirectUri);
      requestParams.append('grant_type', 'authorization_code');
      requestParams.append('code', urlCode);
      if (authConfig.scope) {
        requestParams.append('scope', authConfig.scope);
      }

      // Perform POST request to the API token endpoint here
      fetch(authConfig.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestParams.toString(),
      })
        .then(response => response.json())
        .then(data => {
          const { access_token, refresh_token } = data;

          console.log('Token response from Bynder:', data);

          // Send access token to the plugin via WebSocket
          if (webSocketRef.current) {
            webSocketRef.current.send(JSON.stringify({
              message: 'SAVE_ACCESS_TOKEN',
              accessToken: access_token,
              refreshToken: refresh_token
            }));

            // Navigate to /success after sending token data via WebSocket
            navigate('/success');
          }
        })
        .catch(error => {
          // Handle any errors
          console.error('Error:', error);
        });
    }
  }, [authCode])

  return (
    <div className="flex flex-col gap-4 bg-subtle rounded-xl p-4">
      <p>Authenticating...</p>
    </div>
  )
}