import { useContext, useEffect, useState } from "react"
import { AuthContext, AuthProvider, IAuthContext } from "react-oauth2-code-pkce"
import { authConfig } from "~/authConfig"
import Login from "~/components/Login";

function LoginInfo() {
    const { tokenData, token, idTokenData, login, logOut, error, loginInProgress, idToken } = useContext(AuthContext)

    if (loginInProgress) return null

    return (
        <>
            {error && (
                <p>An error occurred during authentication: {error}</p>
            )}
            {token ? (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                        <h4>Access Token</h4>
                        <code className="break-words max-w-prose">{token}</code>
                    </div>

                    {authConfig.decodeToken && (
                        <div className="flex flex-col gap-3">
                            <h4>Login information from Access Token</h4>
                            <code className="break-words max-w-prose">
                                {JSON.stringify(tokenData, null, 2)}
                            </code>
                        </div>
                    )}
                </div>
            ) : (
                <div className="fled flex-col gap-4">
                    <p>You are not logged in</p>
                    <button className="surface-01 border stroke-01 rounded-lg px-3 py-2" onClick={() => login('state')}>Login</button>
                </div>
            )}
        </>
    )
}

export default function LoginRoute() {
    const [isClient, setIsClient] = useState(false);

    // Set isClient to true when component mounts
    useEffect(() => setIsClient(true), []);

    return (
        isClient && (
            <AuthProvider authConfig={authConfig}>
                <LoginInfo/>
            </AuthProvider>
        )
    )
}