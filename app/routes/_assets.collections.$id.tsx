import { useLocation, useNavigate, useParams } from "@remix-run/react";
import { useEffect, useState } from "react"
import { useAuthData } from "~/AuthContext";

export default function CollectionRoute() {
    const { accessToken, resetAccessToken } = useAuthData();
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams()

    const [assets, setAssets] = useState<any>([])

    async function fetchCollectionMedia(id: string) {
        const collectionEndpoint = `https://assets.turo.com/api/v4/collections/${id}/media`

        if (!accessToken) {
            console.error('No access token available.')
            navigate('/login')
        }

        try {
            const response = await fetch(collectionEndpoint, {
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
            console.log('Collection fetch response:', results)

            return results.collections.map((result: any) => ({
                id: result.id
            }))
        } catch (error) {
            console.error('Error fetching assets:', error)
            throw error
        }
    }

    useEffect(() => {
        console.log(location.pathname)
        
        if (id) {
            fetchCollectionMedia(id).then((fetchedResults) => {
                setAssets(fetchedResults)
            })
        }
    }, [id])

    return (
        <div className="flex flex-col gap-4 overflow-scroll w-full h-full">
            {assets && assets.length > 0 ? (
                <div className="flex flex-col p-4 gap-4">
                    {assets.map((asset: any) => (
                        <p>{asset.id}</p>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-3 w-full h-full items-center justify-center">
                    <p className="px-8 text-center">Unable to retrieve assets or no image assets in collection.</p>
                </div>
            )}
        </div>
    )
}