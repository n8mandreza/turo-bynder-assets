import { useEffect, useState } from "react"
import Pagination from "~/components/Pagination"
import { CollectionType } from "~/types/AssetTypings"

export default function CollectionsRoute() {
  const [collections, setCollections] = useState<CollectionType[]>([])
  const [collectionsCount, setCollectionsCount] = useState(0)
  const [collectionsPage, setCollectionsPage] = useState(1)
  const totalPages = collectionsCount / 50

  async function fetchCollections(page: number) {
    const collectionsEndpoint = `https://assets.turo.com/api/v4/collections?page=${page}&count=1&minCount=1`

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
    <>
      <h4 className="text-lg">Collections</h4>
      
      {collections ? (
        <>
          <div className="flex flex-col">
            <div className="px-4 flex justify-end">
              <p className="text-02 text-sm">{collectionsCount} collections</p>
            </div>

            {/* List collections here */}
          </div>

          <Pagination
            currentPage={collectionsPage}
            totalPages={totalPages}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        </>
      ) : (
        null
      )}

    </>
  )
}