import { useContext, useEffect, useState } from "react"
import { AuthContext, AuthProvider, IAuthContext } from "react-oauth2-code-pkce"
import { authConfig } from "~/authConfig"
import Button from "~/components/Button";

export default function CallbackRoute() {
    const [isClient, setIsClient] = useState(false);
    const [authCode, setAuthCode] = useState('')
    const [tokenData, setTokenData] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [refreshToken, setRefreshToken] = useState(null)

    // Set isClient to true when component mounts
    useEffect(() => setIsClient(true), []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const urlCode = urlParams.get('code')

        if (urlCode) {
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

            console.log(requestParams.toString())
    
            fetch(authConfig.tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: requestParams.toString(),
            })
            .then(response => response.json())
            .then(data => {
                // Handle the response data
                console.log('Token response:', data);
                setTokenData(data)
                setAccessToken(data.accessToken)
                setRefreshToken(data.refreshToken)
                // Send access token to the plugin
                window.parent.postMessage(
                {
                    pluginMessage: {
                    message: 'SAVE_ACCESS_TOKEN',
                    accessToken,
                    },
                },
                '*'
                );
            })
            .catch(error => {
                // Handle any errors
                console.error('Error:', error);
            });
        }
    }, [authCode, refreshToken])

    return (
        isClient && (
            <div className="flex flex-col gap-4 bg-subtle rounded-xl p-4">
            {/* <p className="w-full">
              You have successfully logged into Bynder.
            </p> */}
    
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
            <code className="break-words max-w-prose">{JSON.stringify(tokenData, null, 2)}</code>
    
            {/* <p>You may now close this browser window and return to Figma.</p> */}
          </div>
        )
    )
}