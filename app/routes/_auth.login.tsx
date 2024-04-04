import { useContext, useEffect, useState } from "react"
import { AuthContext, AuthProvider, IAuthContext } from "react-oauth2-code-pkce"
import { authConfig } from "~/authConfig"

export default function Login() {
    const { tokenData, token, login, logOut, idToken, error }: IAuthContext = useContext(AuthContext)
    const [isClient, setIsClient] = useState(false);

    // Set isClient to true when component mounts
    useEffect(() => setIsClient(true), []);

    return (
        isClient && (
            <AuthProvider authConfig={authConfig}>
                <div className="flex items-center justify-center w-screen h-screen">
                    <button className="surface-01 border stroke-01 rounded-lg" onClick={() => login()}>Login</button>
                </div>
            </AuthProvider>
        )
    )
}