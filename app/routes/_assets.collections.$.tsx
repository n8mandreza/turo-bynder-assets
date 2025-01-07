import { useNavigate, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useAuthData } from "~/AuthContext";
import AssetGrid from "~/components/AssetGrid";
import Pagination from "~/components/Pagination";
import ProgressIndicator from "~/components/ProgressIndicator";

export default function CollectionRoute() {
    const { accessToken } = useAuthData();
    const navigate = useNavigate();
    const params = useParams();
    const collectionId = params['*'];

    console.log('CollectionRoute params:', params);
    console.log('CollectionRoute collectionId:', collectionId);

    const [assets, setAssets] = useState<any[]>([]);
    const [resultsPage, setResultsPage] = useState(1)
    const [resultsCount, setResultsCount] = useState(0)
    const totalPages = resultsCount / 50
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchCollectionMedia(id: string, page: number) {
        const collectionEndpoint = `https://assets.turo.com/api/v4/media/?collectionId=${id}&page=${page}&total=1`;

        // Check for an access token
        if (!accessToken) {
            console.error('No access token available.');
            navigate('/login');
            return;
        }

        try {
            console.log("Fetching collection media...", collectionEndpoint);

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
                id: result.id,
                name: result.name,
                url: result.thumbnails.webimage,
                description: result.description
            })));

            setResultsCount(results.total.count);
        } catch (error) {
            console.error('Error fetching assets:', error);
            setError('Error fetching collection');
        } finally {
            setIsLoading(false);
        }
    }

    function handleNext() {
        setResultsPage(resultsPage + 1)
        if (collectionId) {
            fetchCollectionMedia(collectionId, resultsPage + 1)
        }
    }

    function handlePrev() {
        setResultsPage(resultsPage - 1)
        if (collectionId) {
            fetchCollectionMedia(collectionId, resultsPage - 1)
        }
    }

    useEffect(() => {
        if (collectionId) {
            fetchCollectionMedia(collectionId, 1);
        }
    }, [collectionId, accessToken, navigate]);

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
                <>
                    <div className="flex flex-col pt-4 pb-10">
                        <div className="px-4 flex justify-end">
                            <p className="text-02 text-sm">{resultsCount} results</p>
                        </div>

                        <AssetGrid assets={assets} />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0">
                        <Pagination
                            currentPage={resultsPage}
                            totalPages={totalPages}
                            handlePrev={handlePrev}
                            handleNext={handleNext}
                        />
                    </div>
                </>
            ) : (
                <div className="flex flex-col gap-3 w-full h-full items-center justify-center">
                    <p className="px-8 text-center">Unable to retrieve assets or no image assets in collection.</p>
                </div>
            )}
        </div>
    );
}