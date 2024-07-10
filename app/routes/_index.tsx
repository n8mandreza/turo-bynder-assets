import type { MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { useAuthData } from "~/AuthContext";
import Button from "~/components/Button";
import AssetGrid from "~/components/AssetGrid";
import AssetType from "~/types/AssetType";
import SearchInput from "~/components/SearchInput";
import IconButton from "~/components/IconButton";
import LeftChevron from "~/icons/LeftChevron";
import RightChevron from "~/icons/RightChevron";

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
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AssetType[] | null>(null)
  const [resultsPage, setResultsPage] = useState(1)
  const [resultsCount, setResultsCount] = useState(0)
  const totalPages = resultsCount / 50

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    setQuery(event.currentTarget.value)
  }

  async function fetchAssets(query: string, page: number) {
    const assetsEndpoint = `https://assets.turo.com/api/v4/media/?keyword=${query}&page=${page}&total=1`

    if (!accessToken) {
      console.error('No access token available.')
      return;
    }

    // Fetch assets with Authorization header
    try {
      const response = await fetch(assetsEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if the server response is not ok then throw an error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results = await response.json();
      console.log('Fetch response', results);

      setResultsCount(results.total.count);

      // Process and return the transformed array of results
      return results.media.map((result: any) => ({
        name: result.name,
        id: result.id,
        url: result.thumbnails.webimage
      }));
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    let newPage = 1
    setResultsPage(newPage)
    fetchAssets(query, newPage)
      .then(results => {
        setResults(results)
        console.log('Processed results:', results)
      })
  }

  function handleNext() {
    setResultsPage(resultsPage + 1)
    fetchAssets(query, resultsPage + 1)
      .then(results => {
        setResults(results)
        console.log('Processed results:', results)
      })
  }

  function handlePrev() {
    setResultsPage(resultsPage - 1)
    fetchAssets(query, resultsPage - 1)
      .then(results => {
        setResults(results)
        console.log('Processed results:', results)
      })
  }

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
        <>
          <div className="flex flex-col gap-3 sticky z-10 left-0 top-0 right-0 p-4 border-b-1 stroke-01">
            <form className="flex w-full gap-3" onSubmit={handleSearch}>
              <SearchInput id="query" label="Search" placeholder="Search" onInput={handleInputChange} />
              
              {/* <Button label="Search" size="compact" isFormSubmit={true} /> */}
            </form>
          </div>

          { results ? (
            <>
              <div className="flex flex-col">
                <div className="px-4 py-2 flex justify-end">
                  <p className="text-02 text-sm">{resultsCount} results</p>
                </div>

                <AssetGrid assets={results}/>
              </div>

              <div className="flex items-center justify-between w-full p-4 gap-3">
                <IconButton disabled={resultsPage === 1 ? true : false} onClick={handlePrev}>
                  <LeftChevron />
                </IconButton>

                <p className="text-base text-01">{resultsPage}</p>

                <IconButton disabled={resultsPage >= totalPages ? true : false} onClick={handleNext}>
                  <RightChevron />
                </IconButton>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <p>Nothing yet. Search for something.</p>
            </div>
          )}

        </>
      ) : (
        <div className="flex flex-col gap-3 items-center justify-center w-full h-full p-4">
          <div className="flex flex-col items-center gap-2">
            <h4 className="text-lg">Checking for access token...</h4>
            <p className="text-center text-02">If you aren't automatically redirected after a few seconds, click the button to log in.</p>
          </div>

          <Link to="/login">
            <Button label="Go to login"/>
          </Link>
        </div>
      )}
    </div>
  );
}
