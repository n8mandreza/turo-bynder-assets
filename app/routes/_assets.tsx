import { Link, Outlet, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useAuthData } from "~/AuthContext";
import NavBar from "~/components/NavBar";

export default function AssetsLayout() {
    // const { accessToken, saveAccessToken, resetAccessToken } = useAuthData();
    // const navigate = useNavigate()

    // const [hasCheckedToken, setHasCheckedToken] = useState(false);

    // // On load, check if there's an existing access token
    // const checkAccessToken = (event: MessageEvent) => {
    //     console.log("Message received by UI:", event.data)

    //     if (event?.data?.pluginMessage?.message === 'GET_EXISTING_ACCESS_TOKEN') {
    //         const accessToken = event?.data?.pluginMessage?.accessToken
    //         // Check if that token works
    //         // and save it to use with network requests
    //         console.log('Access token from plugin message', accessToken)
    //         saveAccessToken(accessToken)
    //     }

    //     setHasCheckedToken(true);
    // }

    // useEffect(() => {
    //     window.addEventListener('message', checkAccessToken);
    //     console.log('Added checkAccessToken event listener')

    //     return () => {
    //         window.removeEventListener('message', checkAccessToken)
    //         console.log('Removed checkAccessToken event listener')
    //     }
    // }, [])

    // // Navigate to _auth.login if accessToken is null
    // useEffect(() => {
    //     if (hasCheckedToken && !accessToken) {
    //         navigate('/login');
    //     } else {
    //         navigate('/search');
    //     }
    // }, [accessToken, hasCheckedToken, navigate]);
    
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen pt-8">
            <NavBar />
            
            <Outlet />
        </div>
    )
}