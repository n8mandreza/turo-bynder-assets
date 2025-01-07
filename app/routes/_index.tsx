import type { MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useAuthData } from "~/AuthContext";
import ProgressIndicator from "~/components/ProgressIndicator";

export const meta: MetaFunction = () => {
  return [
    { title: "Turo Assets" },
    { name: "description", content: "Turo Bynder x Figma integration" },
  ];
};

export default function Index() {
  const { accessToken, saveAccessToken, resetAccessToken } = useAuthData();

  const [hasCheckedToken, setHasCheckedToken] = useState(false);

  const navigate = useNavigate()

  async function tryAccessToken(accessToken: string) {
    const collectionsEndpoint = `https://assets.turo.com/api/v4/collections?page=1&count=1`

    if (!accessToken) {
      console.error('No access token available.')
      navigate('/login')
    }

    // Fetch collections with Authorization header
    try {
      const response = await fetch(collectionsEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Trying access token')

      // Check if the server response is not ok then throw an error
      if (!response.ok) {
        if (response.status === 401) {
          console.log('Resetting access token')
          resetAccessToken(); // Reset the access token
          setHasCheckedToken(true)
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      saveAccessToken(accessToken)
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  }

  // On load, check if there's an existing access token
  const checkAccessToken = async (event: MessageEvent) => {
    console.log('Message received by UI:', event.data);

    if (event?.data?.pluginMessage?.message === 'GET_EXISTING_ACCESS_TOKEN') {
      const accessToken = event?.data?.pluginMessage?.accessToken;
      console.log('Access token from plugin message', accessToken);
      // Check if that token works
      // and save it to use with network requests
      await tryAccessToken(accessToken);
    }

    console.log('Finishing token check')
    setHasCheckedToken(true);
  };

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
    if (hasCheckedToken && !accessToken) {
      console.log('Redirecting to log in')
      navigate('/login');
    } else if (hasCheckedToken) {
      console.log('Redirecting to search')
      navigate('/collections');
    }
  }, [accessToken, hasCheckedToken, navigate]);

  return (
    <div className="w-screen h-screen flex flex-col relative overflow-scroll">
      <div className="flex flex-col gap-3 items-center justify-center w-full h-full p-4">
        <div className="flex flex-col items-center gap-2">
          <ProgressIndicator/>
          <h4 className="text-lg">Loading...</h4>
          <p className="text-center text-sm text-02 px-4">If you aren't automatically redirected after a few seconds, you may need to log in again.</p>
          <Link to="/login">
            <p className="hover:opacity-60 text-sm cursor-pointer">Go to login</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
