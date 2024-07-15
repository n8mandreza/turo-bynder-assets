import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { useEffect } from "react";
import { useAuthData } from "~/AuthContext";

// Define the loader function
export const loader: LoaderFunction = async ({ params }) => {
    const { accessToken } = useAuthData()
    const { id } = params;

    if (!id) {
        throw new Response("Not Found", { status: 404 });
    }

    const collectionEndpoint = `https://assets.turo.com/api/v4/collections/${id}/media`;

    const response = await fetch(collectionEndpoint, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Response("Error fetching collection", { status: response.status });
    }

    const results = await response.json();

    return results
};

export default function CollectionRoute() {
    const { accessToken } = useAuthData();
    const navigate = useNavigate();
    const assets = useLoaderData(); // Use the loaded data

    useEffect(() => {
        if (!accessToken) {
            console.error('No access token available.');
            navigate('/login');
        }
    }, [accessToken, navigate]);

    return (
        <div className="flex flex-col gap-4 overflow-scroll w-full h-full">
            {assets && assets.length > 0 ? (
                <div className="flex flex-col p-4 gap-4">
                    {assets.map((asset: any) => (
                        <p key={asset.id}>{asset.id}</p>
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