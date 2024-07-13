import { useEffect, useState } from "react"
import { CollectionType } from "~/types/AssetTypings"

export default function CollectionsRoute() {
  const [collections, setCollections] = useState<CollectionType[]>([])
  const [collectionsCount, setCollectionsCount] = useState(0)
  const [collectionsPage, setCollectionsPage] = useState(1)

  async function fetchCollections(page: number) {
    const collectionsEndpoint = `https://assets.turo.com/api/v4/collections?page=${page}&count=1`

    return await fetch(collectionsEndpoint)
      .then(async (response) => {
        const results = await response.json();
        console.log(results);
        setCollectionsCount(results.count);
        
        return results.map((result: CollectionType) => {
          return {
            name: result.name,
            id: result.id,
            collectionCount: result.collectionCount,
            thumbnail: result.cover.thumbnail
          };
        });
      })
  }
  
  useEffect(() => {
    fetchCollections(collectionsPage).then((fetchedResults) => {
      setCollections(fetchedResults)
    })
  }, [])

  return (
    <>
      <h4>Collections</h4>
      <code>{collectionsCount}</code>
    </>
  )
}