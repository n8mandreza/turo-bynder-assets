import { useEffect, useState } from "react"
import { useAuthData } from "~/AuthContext";
import { authConfig } from "~/authConfig"
import Button from "~/components/Button";

export default function CallbackRoute() {
  // Retrieve data from context and setters to manage authentication data
  const {
    accessToken,
    refreshToken
  } = useAuthData();
  const [authCode, setAuthCode] = useState<string>('')

  // Establish WebSocket connection
  const webSocket = new WebSocket('wss://turo-bynder-deno-websocket.deno.dev');

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
          console.log('Token response from Bynder:', data);

          // Send access token to the plugin via WebSocket
          webSocket.send(JSON.stringify({
            message: 'SAVE_ACCESS_TOKEN',
            accessToken: data.access_token,
            refreshToken: data.refresh_token
          }));
        })
        .catch(error => {
          // Handle any errors
          console.error('Error:', error);
        });
    }
  }, [authCode])

  return (
    <div className="flex flex-col gap-4 bg-subtle rounded-xl p-4">
      {accessToken && accessToken !== '' ? (
        <>
          <h4>Access token</h4>
          <code className="break-words max-w-prose">{JSON.stringify(accessToken, null, 2)}</code>

          <h4>Refresh token</h4>
          <code className="break-words max-w-prose">{refreshToken}</code>
        </>
      ) : (
        <>
          <h4>Authorization code</h4>
          <code className="break-words max-w-prose">{authCode}</code>
        </>
      )}
    </div>
  )
}