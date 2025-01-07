import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react"
import { useAuthData } from "~/AuthContext";
import IconButton from "~/components/IconButton";
import Pagination from "~/components/Pagination"
import ProgressIndicator from "~/components/ProgressIndicator";
import SegmentedControl from "~/components/SegmentedControl";
import BackArrow from "~/icons/BackArrow";
import Grid from "~/icons/Grid";
import List from "~/icons/List";
import { CollectionType } from "~/types/BynderTypings"

export default function CollectionsRoute() {
  const { accessToken, resetAccessToken } = useAuthData();
  const navigate = useNavigate()
  
  const [isLoading, setIsLoading] = useState(true)
  const [collections, setCollections] = useState<CollectionType[]>([])
  const [collectionsCount, setCollectionsCount] = useState(0)
  const [collectionsPage, setCollectionsPage] = useState(1)
  const totalPages = collectionsCount / 50
  const [failedImages, setFailedImages] = useState(new Set());
  const [orderBy, setOrderBy] = useState('name')
  const [orderByDirection, setOrderByDirection] = useState('asc')
  const [displayMode, setDisplayMode] = useState('grid')

  async function fetchCollections(page: number, orderBy: string, orderByDirection: string) {
    const collectionsEndpoint = `https://assets.turo.com/api/v4/collections?page=${page}&count=1&minCount=2&orderBy=${orderBy + ' ' + orderByDirection}`

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
    } finally {
      setIsLoading(false);
    }
  }

  function handleNext() {
    setIsLoading(true)
    setCollectionsPage(collectionsPage + 1)
    fetchCollections(collectionsPage + 1, orderBy, orderByDirection)
      .then(results => {
        setCollections(results)
        console.log('Processed results:', results)
      })
  }

  function handlePrev() {
    setIsLoading(true)
    setCollectionsPage(collectionsPage - 1)
    fetchCollections(collectionsPage - 1, orderBy, orderByDirection)
      .then(results => {
        setCollections(results)
        console.log('Processed results:', results)
      })
  }

  function handleOrderByChange(orderBy: string) {
    setIsLoading(true)
    setOrderBy(orderBy)
    fetchCollections(collectionsPage, orderBy, orderByDirection)
      .then(results => {
        setCollections(results)
        console.log('Processed results:', results)
      })
  }

  function handleOrderByDirectionChange(orderByDirection: string) {
    setIsLoading(true)
    setOrderByDirection(orderByDirection)
    fetchCollections(collectionsPage, orderBy, orderByDirection)
      .then(results => {
        setCollections(results)
        console.log('Processed results:', results)
      })
  }

  const handleError = (id: string) => {
    setFailedImages(prev => new Set(prev.add(id)));
  };
  
  useEffect(() => {
    fetchCollections(collectionsPage, orderBy, orderByDirection).then((results) => {
      setCollections(results)
      console.log('Processed results:', results)
    })
  }, [])

  return (
    <div className="flex flex-col overflow-scroll w-full h-full">
      {/* Order and sort controls */}
      <div className="flex gap-2 justify-between px-2 py-2 sticky top-0 left-0 right-0 z-10 surface-sticky border-b stroke-01">
        <SegmentedControl 
          options={[
            {
              label: 'Name', value: 'name', onClick: () => handleOrderByChange('name')
            },
            {
              label: 'Date created', value: 'dateCreated', onClick: () => handleOrderByChange('dateCreated'),
            }
          ]}
          activeValue={orderBy}
        />

        <div className="flex">
          <IconButton icon={
            <div className={`${orderByDirection === 'asc' ? 'rotate-90' : '-rotate-90'}`}>
              <BackArrow />
            </div>
          } onClick={() => handleOrderByDirectionChange(orderByDirection === 'asc' ? 'desc' : 'asc')} />

          <IconButton icon={displayMode === 'grid' ? <Grid /> : <List />} onClick={() => setDisplayMode(displayMode === 'grid' ? 'list' : 'grid')} />
        </div>
      </div>

      {/* Collection display */}
      { isLoading ? (
          <div className="flex flex-col w-full h-full items-center justify-center">
              <ProgressIndicator />
          </div>
      ) : (
        collections && collectionsCount > 0 ? (
          <>
            <div className="flex flex-col gap-4 p-4 relative pb-14">
              <div className="flex justify-between gap-4">
                <p className="text-02 text-sm">Sorted by {orderBy === 'name' ? 'name' : 'date created'}, {orderByDirection === 'asc' ? 'ascending' : 'descending'}</p>
                <p className="text-02 text-sm">{collectionsCount} collections</p>
              </div>

              {displayMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-4">
                  {collections.map((collection) => (
                    <Link key={collection.id} to={`/collections/${collection.id}`} className="hover:opacity-90 transition-opacity duration-150">
                      <div className="flex flex-col gap-1">
                        <div className="overflow-hidden rounded-lg relative aspect-square">
                          <div className="absolute top-1 left-1 surface-material px-2 py-1 rounded-md backdrop-blur-lg">
                            <p className="text-xs">{collection.collectionCount}</p>
                          </div>

                          {failedImages.has(collection.id) ? (
                            <div className="w-full h-full surface-02 flex items-center justify-center">
                              <p className="text-sm text-02 text-center">Image failed to load.</p>
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
              ) : (
                <div className="flex flex-col gap-4">
                  {collections.map((collection) => (
                    <Link key={collection.id} to={`/collections/${collection.id}`} className="group">
                      <div className="flex gap-3 items-center">
                        <div className="overflow-hidden rounded-lg aspect-square w-16 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-150">
                          {failedImages.has(collection.id) ? (
                            <div className="w-full h-full surface-02 flex items-center justify-center">
                              <p className="text-xs text-02 text-center p-1">Image failed to load.</p>
                            </div>
                          ) : (
                            <img className="w-full h-full object-cover" src={collection.thumbnail} onError={() => handleError(collection.id)} />
                          )}
                        </div>

                        <div className="flex gap-2 justify-between items-center border-b stroke-01 group-hover:interactive-stroke-02 group-last:border-b-0 flex-grow h-16 py-2">
                          <p className="text-01 opacity-80 group-hover:opacity-100 transition-opacity duration-150">{collection.name}</p>
                          <p className="text-sm text-02">{collection.collectionCount}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

            </div>

            <div className="absolute bottom-0 left-0 right-0">
              <Pagination
                currentPage={collectionsPage}
                totalPages={totalPages}
                handlePrev={handlePrev}
                handleNext={handleNext}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3 w-full h-full items-center justify-center">
            <p className="px-8 text-center">No collections yet. Create a collection on <a className="interactive-text" href="https://assets.turo.com" target="_blank" rel="noopener noreferrer">assets.turo.com</a></p>
          </div>
        )
      )}
    </div>
  )
}