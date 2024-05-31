import { useEffect, useState } from "react"
import { useAuthData } from "~/AuthContext";
import { authConfig } from "~/authConfig"
import Button from "~/components/Button";

export default function CallbackRoute() {
  const [authCode, setAuthCode] = useState<string>('')

  // Retrieve data from context and setters to manage authentication data
  const { 
    accessToken, 
    setAccessToken, 
    refreshToken, 
    setRefreshToken 
  } = useAuthData();

  // Function to handle access token when received
  const handleAccessToken = (accessTokenData: string | null) => {
    // Separate the access & refresh tokens here if needed
    const accessToken = accessTokenData ?? ''
    const refreshToken = ''
    // Save token data to context
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlCode = urlParams.get('code')

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

      console.log('Request parameters to string:', requestParams.toString())

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
          handleAccessToken(data);
          // Send access token to the plugin
          window.parent.postMessage(
          {
              pluginMessage: {
                message: 'SAVE_ACCESS_TOKEN',
                accessToken,
              },
          }, '*');
      })
      .catch(error => {
          // Handle any errors
          console.error('Error:', error);
      });
    }
  }, [authCode, refreshToken])

  return (
    <div className="flex flex-col gap-4 bg-subtle rounded-xl p-4">
      <p className="w-full text-center">
        You have successfully logged into Bynder.
      </p>

      {refreshToken ? (
        <>
          <h4>Refresh token</h4>
          <code className="break-words max-w-prose">{refreshToken}</code>
        </>
      ) : (
        <>
          <h4>Authorization code</h4>
          <code className="break-words max-w-prose">{authCode}</code>
        </>
      )}

      <h4>Token data from JWT</h4>
      <code className="break-words max-w-prose">{JSON.stringify(accessToken, null, 2)}</code>

      <p className="w-full text-center">You may now close this browser window and return to Figma.</p>
    </div>
  )
}