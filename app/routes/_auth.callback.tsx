import { useContext, useEffect, useState } from "react"
import { AuthContext, AuthProvider, IAuthContext } from "react-oauth2-code-pkce"
import { authConfig } from "~/authConfig"
import Login from "~/components/Login";

export default function CallbackRoute() {
    const [isClient, setIsClient] = useState(false);

    // Set isClient to true when component mounts
    useEffect(() => setIsClient(true), []);

    return (
        isClient && (
            <AuthProvider authConfig={authConfig}>
                <Login/>
            </AuthProvider>
        )
    )
}