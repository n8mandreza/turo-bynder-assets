import type { MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useAuthData } from "~/AuthContext";
import Button from "~/components/Button";
import Search from "~/components/Search";

export const meta: MetaFunction = () => {
  return [
    { title: "Turo Assets" },
    { name: "description", content: "Turo Bynder x Figma integration" },
  ];
};

export default function Index() {
  const { accessToken, saveAccessToken } = useAuthData();
  const navigate = useNavigate()

  const [hasCheckedToken, setHasCheckedToken] = useState(false);

  // On load, check if there's an existing access token
  const checkAccessToken = (event: MessageEvent) => {
    console.log("Message received by UI:", event.data)

    if (event?.data?.pluginMessage?.message === 'GET_EXISTING_ACCESS_TOKEN') {
      const accessToken = event?.data?.pluginMessage?.accessToken
      // Check if that token works
      // and save it to use with network requests
      console.log('Access token from plugin message', accessToken)
      saveAccessToken(accessToken)
    }

    setHasCheckedToken(true);
  }

  useEffect(() => {
    window.addEventListener('message', checkAccessToken);
    console.log('Added checkAccessToken event listener')

    return () => {
      window.removeEventListener('message', checkAccessToken)
      console.log('Removed checkAccessToken event listener')
    }
  }, [])
  
  // Navigate to _auth.login if accessToken is null
  useEffect(() => {
    if (!accessToken && hasCheckedToken) {
      navigate('/login');
    }
  }, [accessToken, hasCheckedToken, navigate]);

  return (
    <div className="w-screen h-screen flex flex-col relative overflow-scroll">
      { accessToken ? (
        <Search accessToken={accessToken}/>
      ) : (
        <div className="flex flex-col gap-3 items-center justify-center w-full h-full p-4">
          <div className="flex flex-col items-center gap-2">
            <h4 className="text-lg">Loading...</h4>
            <p className="text-center text-sm text-02">If you aren't automatically redirected after a few seconds, click the button to log in.</p>
          </div>

          <Link to="/login">
            <Button label="Go to login"/>
          </Link>
        </div>
      )}
    </div>
  );
}
