import { useNavigate } from "@remix-run/react"
import { useEffect, useRef } from "react"
import { useAuthData } from "~/AuthContext"
import { authConfig } from "~/authConfig"
import Button from "~/components/Button"

export default function LoginRoute() {
    const {
        accessToken,
        saveAccessToken,
        refreshToken,
        saveRefreshToken
    } = useAuthData();
    const navigate = useNavigate();
    const authorizationEndpoint = `${authConfig.authorizationEndpoint}?client_id=${authConfig.clientId}&scope=${authConfig.scope}&redirect_uri=${authConfig.redirectUri}&response_type=code&state=${authConfig.state}`
    // WebSocket as a ref
    const webSocketRef = useRef<WebSocket | null>(null);

    // Function to save token data to context when received
    const handleTokenData = (accessTokenData: string | null, refreshTokenData: string | null) => {
        // Separate the access & refresh tokens here if needed
        const accessToken = accessTokenData ?? ''
        const refreshToken = refreshTokenData ?? ''
        // Save token data to context
        saveAccessToken(accessToken);
        saveRefreshToken(refreshToken);
    };

    // Get data from WebSocket
    useEffect(() => {
        // Create a WebSocket connection
        const webSocket = new WebSocket('wss://turo-bynder-deno-websocket.deno.dev')
        webSocketRef.current = webSocket

        // Save token data from WebSocket message to app context
        webSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Token data via WebSocket', data)

            if (data.message === 'SAVE_ACCESS_TOKEN') {
                const { accessToken, refreshToken } = data

                console.log('Sending access token to context', accessToken)
                handleTokenData(accessToken, refreshToken)
            }
        }

        // Cleanup function to close WebSocket on component unmount or reconfiguration
        return () => {
            console.log("Closing WebSocket connection");
            webSocket.close();
        };
    }, [saveAccessToken, saveRefreshToken])

    // Redirect to the root once accessToken is available via AuthContext
    useEffect(() => {
        if (accessToken) {
            // TODO: Add another message to confirm token receipt via WebSocket
            // to trigger redirect to success page in browser
            navigate("/")
        }
    }, [accessToken, navigate])

    return (
        <div className="login-bg w-screen h-screen p-10 flex items-center justify-center">
            <div className="flex flex-col w-full gap-4 p-6 surface-material backdrop-blur-xl rounded-2xl items-center">
                <h1 className="text-3xl text-01 font-bold text-center">Turo Assets</h1>
                <p className="text-base text-01 text-center">Easily access Turo’s extensive library of professional photography and illustrations, directly from Figma.</p>
                <Button label="Log in to Bynder" fullWidth onClick={() => window.open(authorizationEndpoint, '_blank')}/>
            </div>
        </div>
    )
}