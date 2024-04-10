import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import Button from "~/components/Button";
import TextInput from "~/components/TextInput";

export const meta: MetaFunction = () => {
  return [
    { title: "Turo Assets" },
    { name: "description", content: "Turo Bynder x Figma integration" },
  ];
};

interface IAsset {
  name: string
  id: string
  thumbnails: any
}

export default function Index() {
  const { token, tokenData } = useContext(AuthContext)
  const [isClient, setIsClient] = useState(false);

  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [resultsPage, setResultsPage] = useState(1)
  const [resultsCount, setResultsCount] = useState(0)

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    setQuery(event.currentTarget.value)
  }

  async function fetchAssets(query: string, page: number) {
    const assetsEndpoint = `https://assets.turo.com/api/v4/media/?keyword=${query}&page=${page}&total=1`

    return await fetch(assetsEndpoint)
      .then(async (response) => {
        const results = await response.json();
        console.log(results); // Remove later
        setResultsCount(results.total.count);
        
        return results.media.map((result: IAsset) => {
          return {
            name: result.name,
            id: result.id,
            thumbnail: result.thumbnails.webimage
          };
        });
      })
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    let newPage = 1
    setResultsPage(newPage)
    fetchAssets(query, newPage)
      .then(results => {
        setResults(results)
        console.log(query)
      })
  }

  return (
    <div className="w-screen h-screen flex flex-col gap-4 justify-center items-center">
      <h1>Turo Bynder Figma Plugin</h1>
      { token ? (
        <div className="flex flex-col gap-3 max-w-prose justify-start items-start">
          <form className="flex gap-3" onSubmit={handleSearch}>
            <TextInput id="query" label="Search" showLabel={false} placeholder="Search" onInput={handleInputChange} />
            
            <Button label="Search" size="compact" isFormSubmit={true} />
          </form>
          <p>{resultsCount} results</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <h4>You are not logged in</h4>
          <Link to="/login">
            <span className="hover:opacity-60">Go to login</span>
          </Link>
        </div>
      )}
    </div>
  );
}
