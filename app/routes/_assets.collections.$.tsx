import { useNavigate, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useAuthData } from "~/AuthContext";
import ProgressIndicator from "~/components/ProgressIndicator";

export default function CollectionRoute() {
    const { accessToken } = useAuthData();
    const navigate = useNavigate();
    const { $: slug } = useParams();

    const [assets, setAssets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchCollectionMedia(id: string) {
        const collectionEndpoint = `https://assets.turo.com/api/v4/collections/${id}/media`;

        if (!accessToken) {
            console.error('No access token available.');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(collectionEndpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const results = await response.json();
            console.log('Collection fetch response:', results);

            setAssets(results.media.map((result: any) => ({
                id: result.id
            })));
        } catch (error) {
            console.error('Error fetching assets:', error);
            setError('Error fetching collection');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (slug) {
            fetchCollectionMedia(slug);
        }
    }, [slug, accessToken, navigate]);

    if (isLoading) {
        return (
            <div className="flex flex-col w-full h-full items-center justify-center">
                <ProgressIndicator />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col w-full h-full items-center justify-center">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 overflow-scroll w-full h-full">
            {assets && assets.length > 0 ? (
                <div className="flex flex-col p-4 gap-4">
                    {assets.map((asset: any) => (
                        <div key={asset.id}>
                            <p>{asset.id}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-3 w-full h-full items-center justify-center">
                    <p className="px-8 text-center">Unable to retrieve assets or no image assets in collection.</p>
                </div>
            )}
        </div>
    );
}