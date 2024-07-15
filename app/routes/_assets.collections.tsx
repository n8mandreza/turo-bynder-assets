import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react"
import { useAuthData } from "~/AuthContext";
import AlertBanner from "~/components/AlertBanner";
import Pagination from "~/components/Pagination"
import ProgressIndicator from "~/components/ProgressIndicator";
import { CollectionType } from "~/types/AssetTypings"

export default function CollectionsRoute() {
  const { accessToken, resetAccessToken } = useAuthData();
  const navigate = useNavigate()
  
  const [hasFetchedCollections, setHasFetchedCollections] = useState(false)
  const [collections, setCollections] = useState<CollectionType[]>([])
  const [collectionsCount, setCollectionsCount] = useState(0)
  const [collectionsPage, setCollectionsPage] = useState(1)
  const totalPages = collectionsCount / 50
  const [failedImages, setFailedImages] = useState(new Set());

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

  const handleError = (id: string) => {
    setFailedImages(prev => new Set(prev.add(id)));
  };
  
  useEffect(() => {
    fetchCollections(collectionsPage).then((results) => {
      setCollections(results)
      setHasFetchedCollections(true)
      console.log('Processed results:', results)
    })
  }, [])

  return (
    <div className="flex flex-col gap-4 overflow-scroll w-full h-full">
      {hasFetchedCollections ? (
        collections && collectionsCount > 0 ? (
          <>
            <div className="flex flex-col gap-4 p-4">
              <AlertBanner
                title="This area of the plugin is WIP"
                message="At the moment, the plugin can only view collections. Work is still in progress to enable fetching the assets of each collection."
              />

              <div className="flex justify-end">
                <p className="text-02 text-sm">{collectionsCount} collections</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {collections.map((collection) => (
                  <Link key={collection.id} to={`/collections/${collection.id}`}>
                    <div className="flex flex-col gap-1">
                      <div className="overflow-hidden rounded-lg relative aspect-square">
                        <div className="absolute top-1 left-1 surface-material px-2 py-1 rounded-md backdrop-blur-xl">
                          <p className="text-xs">{collection.collectionCount}</p>
                        </div>

                        {failedImages.has(collection.id) ? (
                          <div className="w-full h-full surface-02 flex items-center justify-center">
                            <p className="text-sm text-02">Image failed to load.</p>
                          </div>
                        ) : (
                          <img className="w-full h-full object-cover" src={collection.thumbnail} onError={() => handleError(collection.id)} />
                        )}
                      </div>

                      <p className="text-xs text-02">{collection.name}</p>
                    </div>
                  </Link>
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
        )
      ) : (
        <div className="flex flex-col w-full h-full items-center justify-center">
          <ProgressIndicator />
        </div>
      )}
    </div>
  )
}