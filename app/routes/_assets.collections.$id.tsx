import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { useAuthData } from "~/AuthContext";

export async function loader({ params }: LoaderFunctionArgs) {
    const { id } = params;
    const { accessToken } = useAuthData();
    const collectionEndpoint = `https://assets.turo.com/api/v4/collections/${id}/media`;

    if (!id) {
        throw new Response("Not Found", { status: 404 });
    }

    if (!accessToken) {
        throw new Response("Unauthorized", { status: 401 });
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
            console.error(`Error fetching collection: ${response.statusText}`);
            throw new Response(`Error fetching collection: ${response.statusText}`, { status: response.status });
        }

        const results = await response.json();

        return results;
    } catch (error) {
        console.error('Error fetching collection:', error);
        throw new Response('Internal Server Error', { status: 500 });
    }
};

export default function CollectionRoute() {
    const { accessToken } = useAuthData();
    const navigate = useNavigate();
    const assets = useLoaderData<typeof loader>(); // Use the loaded data

    useEffect(() => {
        if (!accessToken) {
            console.error('No access token available.');
            navigate('/login');
        }
    }, [accessToken, navigate]);

    return (
        <div className="flex flex-col gap-4 overflow-scroll w-full h-full">
            {assets ? (
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