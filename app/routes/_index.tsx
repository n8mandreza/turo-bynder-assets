import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
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
  const { accessToken } = useAuthData();

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
                <div className="px-4 py-2">
                  <p className="text-02">{resultsCount} results</p>
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
        <div className="flex flex-col gap-3 items-center justify-center w-full h-full">
          <h4>You are not logged in</h4>
          <Link to="/login">
            <Button label="Go to login"/>
          </Link>
        </div>
      )}
    </div>
  );
}
