import { useEffect, useState } from "react"
import { useAuthData } from "~/AuthContext";
import { authConfig } from "~/authConfig"
import Button from "~/components/Button";

export default function CallbackRoute() {
  const [authCode, setAuthCode] = useState<string>('')

  // Establish WebSocket connection
  const webSocket = new WebSocket('ws://turo-bynder-deno-websocket.deno.dev');

  // Retrieve data from context and setters to manage authentication data
  const { 
    accessToken, 
    setAccessToken, 
    refreshToken,
    setRefreshToken 
  } = useAuthData();

  // Function to handle access token when received
  const handleAccessToken = (accessTokenData: string | null, refreshTokenData: string | null) => {
    // Separate the access & refresh tokens here if needed
    const accessToken = accessTokenData ?? ''
    const refreshToken = refreshTokenData ?? ''
    // Save token data to context
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlCode = urlParams.get('code')

    // Check if there's a code in the URL and if authCode is empty 
    // before setting the value & requesting the accessToken
    if (urlCode && !authCode) {
      setAuthCode(urlCode)

      // Perform POST request to the API token endpoint here
      const requestParams = new URLSearchParams();
      requestParams.append('client_id', authConfig.clientId);
      requestParams.append('client_secret', String(authConfig.extraTokenParameters?.client_secret) || '');
      requestParams.append('redirect_uri', authConfig.redirectUri);
      if (refreshToken) {
        requestParams.append('grant_type', 'refresh_token');
        requestParams.append('refresh_token', refreshToken)
      } else {
        requestParams.append('grant_type', 'authorization_code');
        requestParams.append('code', urlCode);
      }
      if (authConfig.scope) {
        requestParams.append('scope', authConfig.scope);
      }

      // console.log('Request parameters to string:', requestParams.toString())

      fetch(authConfig.tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
      },
        body: requestParams.toString(),
      })
      .then(response => response.json())
      .then(data => {
          // Handle the response data (save to AuthContext)
          console.log('Token response:', data);
          handleAccessToken(data.accessToken, data.refreshToken);
          // Send access token to the plugin via WebSocket
          webSocket.send(JSON.stringify({
            message: 'SAVE_ACCESS_TOKEN',
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
          }));
      })
      .catch(error => {
          // Handle any errors
          console.error('Error:', error);
      });
    }
  }, [authCode, refreshToken, setAccessToken, setRefreshToken])

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