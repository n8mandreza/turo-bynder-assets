import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";

export const meta: MetaFunction = () => {
  return [
    { title: "Turo Assets" },
    { name: "description", content: "Turo Bynder x Figma integration" },
  ];
};

interface ICollection {
  name: string
  id: string
  collectionCount: number
  cover: any
  thumbnail: string
}

export default function Index() {
  const { token, tokenData } = useContext(AuthContext)
  const [isClient, setIsClient] = useState(false);
  const [collections, setCollections] = useState<ICollection[]>([])
  const [collectionsCount, setCollectionsCount] = useState(0)
  const [collectionsPage, setCollectionsPage] = useState(1)

  async function fetchCollections(page: number) {
    const collectionsEndpoint = `https://assets.turo.com/api/v4/collections?page=${page}&count=1`

    return await fetch(collectionsEndpoint)
      .then((response) => {
        return response.json()
          .then(results => {
            console.log(results) // Remove later
            setCollectionsCount(results.count)

            return results.map((result: ICollection) => {
              return {
                name: result.name,
                id: result.id,
                collectionCount: result.collectionCount,
                thumbnail: result.cover.thumbnail
              }
            })
          })
      })
  }

  useEffect(() => {
    fetchCollections(collectionsPage).then((fetchedResults) => {
      setCollections(fetchedResults)
    })
  }, [])

  return (
    <div className="w-screen h-screen flex flex-col gap-4 justify-center items-center">
      <h1>Turo Bynder Figma Plugin</h1>
      { token ? (
          <div className="flex flex-col gap-3 max-w-prose justify-start items-start">
            <h4>Login information from Access Token</h4>
            <code className="break-words max-w-prose">
                {JSON.stringify(tokenData, null, 2)}
            </code>

            <h4>Collections</h4>
            <code>{collectionsCount}</code>
        </div>
      ) : (
        <h4>You are not logged in</h4>
      )}
    </div>
  );
}
