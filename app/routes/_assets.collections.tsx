import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react"
import { useAuthData } from "~/AuthContext";
import Pagination from "~/components/Pagination"
import { CollectionType } from "~/types/AssetTypings"

export default function CollectionsRoute() {
  const { accessToken, resetAccessToken } = useAuthData();
  const navigate = useNavigate()
  
  const [collections, setCollections] = useState<CollectionType[]>([])
  const [collectionsCount, setCollectionsCount] = useState(0)
  const [collectionsPage, setCollectionsPage] = useState(1)
  const totalPages = collectionsCount / 50

  async function fetchCollections(page: number) {
    const collectionsEndpoint = `https://assets.turo.com/api/v4/collections?page=${page}&count=1&minCount=1&orderBy=name%20asc`

    if (!accessToken) {
      console.error('No access token available.')
      navigate('/login')
    }

    try {
      const response = await fetch(collectionsEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          resetAccessToken()
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const results = await response.json()
      console.log('Collections fetch response:', results)

      setCollectionsCount(results.count)

      return results.collections.map((result: any) => ({
        name: result.name,
        id: result.id,
        collectionCount: result.collectionCount,
        thumbnail: result.cover.thumbnail
      }))
    } catch (error) {
      console.error('Error fetching assets:', error)
      throw error
    }
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
    <div className="flex flex-col py-4 gap-4 overflow-scroll w-full h-full">
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
            <p className="px-8 text-center">No collections yet. Create a collection on <a className="interactive-text" href="https://assets.turo.com" target="_blank" rel="noopener noreferrer">assets.turo.com</a></p>
        </div>
      )}
    </div>
  )
}