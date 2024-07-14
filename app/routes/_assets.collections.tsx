import { useEffect, useState } from "react"
import Pagination from "~/components/Pagination"
import { CollectionType } from "~/types/AssetTypings"

export default function CollectionsRoute() {
  const [collections, setCollections] = useState<CollectionType[]>([])
  const [collectionsCount, setCollectionsCount] = useState(0)
  const [collectionsPage, setCollectionsPage] = useState(1)
  const totalPages = collectionsCount / 50

  async function fetchCollections(page: number) {
    const collectionsEndpoint = `https://assets.turo.com/api/v4/collections?page=${page}&count=1&minCount=1&orderBy=name%20asc`

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

  function handleNext() {
    setCollectionsPage(collectionsPage + 1)
    fetchCollections(collectionsPage + 1)
      .then(results => {
        setCollections(results)
        console.log('Processed results:', results)
      })
  }

  function handlePrev() {
    setCollectionsPage(collectionsPage - 1)
    fetchCollections(collectionsPage - 1)
      .then(results => {
        setCollections(results)
        console.log('Processed results:', results)
      })
  }
  
  useEffect(() => {
    fetchCollections(collectionsPage).then((fetchedResults) => {
      setCollections(fetchedResults)
    })
  }, [])

  return (
    <div className="flex flex-col gap-4 overflow-scroll w-full h-full">
      {collections && collectionsCount > 0 ? (
        <>
          <div className="flex flex-col">
            <div className="px-4 flex justify-end">
              <p className="text-02 text-sm">{collectionsCount} collections</p>
            </div>

            <div className="flex flex-col">
              {collections.map((collection) => (
                <div className="flex justify-between gap-2">
                  <p>{collection.name}</p>
                  <p>{collection.collectionCount}</p>
                </div>
              ))}
            </div>
          </div>

          <Pagination
            currentPage={collectionsPage}
            totalPages={totalPages}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        </>
      ) : (
        <div className="flex flex-col gap-3 w-full h-full items-center justify-center">
            <p className="px-8 text-center">No collections yet. Create a collection on <a href="https://assets.turo.com" target="_blank" rel="noopener noreferrer">assets.turo.com</a></p>
        </div>
      )}
    </div>
  )
}