import { useNavigate } from "@remix-run/react"
import { useEffect } from "react"
import { useAuthData } from "~/AuthContext"
import { authConfig } from "~/authConfig"
import Button from "~/components/Button"

export default function LoginRoute() {
    const { accessToken } = useAuthData();
    const navigate = useNavigate();
    const authorizationEndpoint = `${authConfig.authorizationEndpoint}?client_id=${authConfig.clientId}&scope=${authConfig.scope}&redirect_uri=${authConfig.redirectUri}&response_type=code&state=${authConfig.state}`

    // Redirect to the root once accessToken is available
    useEffect(() => {
        if (accessToken) {
            console.log('Login route', accessToken)
            navigate("/")
        }
    }, [accessToken, navigate])

    return (
        <div className="flex flex-col gap-4 items-center">
            <p>You are not logged in</p>
            <Button label="Log in to Bynder" onClick={() => window.open(authorizationEndpoint, '_blank')}/>
        </div>
    )
}