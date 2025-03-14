import { useState } from "react";
import { useAuthData } from "~/AuthContext";
import Button from "~/components/Button";
import AssetGrid from "~/components/AssetGrid";
import { AssetType } from "~/types/BynderTypings";
import SearchInput from "~/components/SearchInput";
import Chip from "~/components/Chip";
import { useNavigate } from "@remix-run/react";
import { searchTerms } from "~/data/searchTerms";
import Pagination from "~/components/Pagination";
import ProgressIndicator from "~/components/ProgressIndicator";

export default function Search() {
    const { accessToken, resetAccessToken } = useAuthData();
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<AssetType[] | null>(null)
    const [resultsPage, setResultsPage] = useState(1)
    const [resultsCount, setResultsCount] = useState(0)
    const totalPages = resultsCount / 50

    async function fetchAssets(query: string, page: number) {
        const assetsEndpoint = `https://assets.turo.com/api/v4/media/?keyword=${query}&page=${page}&total=1`

        setIsLoading(true);

        if (!accessToken) {
            console.error('No access token available.')
            navigate('/login')
        }

        // Fetch assets with Authorization header
        try {
            const response = await fetch(assetsEndpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            // Check if the server response is not ok then throw an error
            if (!response.ok) {
                if (response.status === 401) {
                    resetAccessToken(); // Reset the access token
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const results = await response.json();
            console.log('Fetch response', results);

            setResultsCount(results.total.count);

            // Process and return the transformed array of results
            return results.media.map((result: any) => ({
                name: result.name,
                id: result.id,
                url: result.thumbnails.webimage
            }));
        } catch (error) {
            console.error('Error fetching assets:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    // Update query as user types
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        console.log('Input changed:', event.currentTarget.value);
        setQuery(event.currentTarget.value)
    }

    // Clear input
    function handleClearInput() {
        setQuery('');
        setResults(null)
    }

    // Handle form submission
    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        console.log("Submitted query:", query)
        setResultsPage(1)
        fetchAssets(query, 1)
            .then(results => {
                setResults(results)
                console.log('Processed results:', results)
            })
            .catch(error => console.error('Error in handleSearch:', error))
    }

    function handleNext() {
        setResultsPage(resultsPage + 1)
        fetchAssets(query, resultsPage + 1)
            .then(results => {
                setResults(results)
                console.log('Processed results:', results)
            })
    }

    function handlePrev() {
        setResultsPage(resultsPage - 1)
        fetchAssets(query, resultsPage - 1)
            .then(results => {
                setResults(results)
                console.log('Processed results:', results)
            })
    }

    function handleChipClick(label: string) {
        setQuery(label);
        setResultsPage(1);
        fetchAssets(label, 1)
            .then(results => {
                setResults(results);
                console.log('Processed results:', results);
            })
    }

    return (
        <div className="flex flex-col gap-4 overflow-scroll w-full h-full pb-10">
            <div className="flex flex-col gap-3 sticky z-10 left-0 top-0 right-0 px-4 py-3 border-b-[1px] surface-sticky stroke-01">
                <form id="search" className="flex w-full gap-3" onSubmit={handleSearch}>
                    <SearchInput
                        formId="search" 
                        label="Search"
                        placeholder="Search assets" 
                        value={query}
                        onInput={handleInputChange} 
                        onClear={handleClearInput}
                    />

                    <Button label="Search" size="compact" isFormSubmit={true} />
                </form>
            </div>

            { isLoading ? (
                <div className="flex flex-col w-full h-full items-center justify-center">
                    <ProgressIndicator />
                </div>
            ) : (
                results ? (
                    <>
                        <div className="flex flex-col">
                            <div className="px-4 flex justify-end">
                                <p className="text-02 text-sm">{resultsCount} results</p>
                            </div>

                            <AssetGrid assets={results} />
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
                    <div className="flex flex-col gap-4 px-4 w-full h-full">
                        <p>Nothing yet. Search for something.</p>

                        <div className="flex gap-3 flex-wrap">
                            {searchTerms.map((searchTerm: string) => (
                                <Chip label={searchTerm} handleClick={() => handleChipClick(searchTerm)} />
                            ))}
                        </div>
                    </div>
                )
            )}
        </div> 
    );
}