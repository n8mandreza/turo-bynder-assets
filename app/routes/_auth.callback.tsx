import { useContext, useEffect, useState } from "react"
import { AuthContext, AuthProvider, IAuthContext } from "react-oauth2-code-pkce"
import { authConfig } from "~/authConfig"
import Login from "~/components/Login";

export default function CallbackRoute() {
    const [authCode, setAuthCode] = useState('')
    const [isClient, setIsClient] = useState(false);
    const { tokenData, token, login, logOut, idToken, error, loginInProgress }: IAuthContext = useContext(AuthContext)

    // Set isClient to true when component mounts
    useEffect(() => setIsClient(true), []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const paramValue = urlParams.get('code')
        if (paramValue) {
            setAuthCode(paramValue)
        }
    }, [authCode])

    if (loginInProgress) return null
    
    return (
        isClient && (
            <AuthProvider authConfig={authConfig}>
                <div>
                    <h4>Authorization code:</h4>
                    <code className="break-words max-w-prose">{authCode}</code>
                </div>
            </AuthProvider>
        )
    )
}