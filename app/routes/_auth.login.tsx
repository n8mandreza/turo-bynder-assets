import { useContext, useEffect, useState } from "react"
import { AuthContext, AuthProvider, IAuthContext } from "react-oauth2-code-pkce"
import { authConfig } from "~/authConfig"

export default function Login() {
    const { tokenData, token, login, logOut, idToken, error }: IAuthContext = useContext(AuthContext)
    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

    return (
        isClient && (
            <AuthProvider authConfig={authConfig}>
                <div className="flex items-center justify-center w-screen h-screen">
                    <p>Login</p>
                </div>
            </AuthProvider>
        )
    )
}