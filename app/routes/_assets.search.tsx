import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useAuthData } from "~/AuthContext";
import Button from "~/components/Button";
import AssetGrid from "~/components/AssetGrid";
import AssetType from "~/types/AssetType";
import SearchInput from "~/components/SearchInput";
import IconButton from "~/components/IconButton";
import LeftChevron from "~/icons/LeftChevron";
import RightChevron from "~/icons/RightChevron";
import Chip from "~/components/Chip";

export default function Search() {
    const { accessToken, resetAccessToken } = useAuthData();

    const [query, setQuery] = useState('')
    const [results, setResults] = useState<AssetType[] | null>(null)
    const [resultsPage, setResultsPage] = useState(1)
    const [resultsCount, setResultsCount] = useState(0)
    const totalPages = resultsCount / 50

    async function fetchAssets(query: string, page: number) {
        const assetsEndpoint = `https://assets.turo.com/api/v4/media/?keyword=${query}&page=${page}&total=1`

        if (!accessToken) {
            console.error('No access token available.')
            return;
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
        }
    }

    // Update query as user types
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setQuery(event.currentTarget.value)
    }

    function handleClearInput() {
        setQuery('');
    }

    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
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
        <div className="flex flex-col relative overflow-scroll w-full h-full">
            <div className="flex flex-col gap-3 sticky z-10 left-0 top-0 right-0 p-4 border-b-1 stroke-01">
                <form className="flex w-full gap-3" onSubmit={handleSearch}>
                    <SearchInput
                        id="query" 
                        label="Search" 
                        placeholder="Search assets" 
                        value={query}
                        onInput={handleInputChange} 
                        onClear={handleClearInput}
                    />

                    {/* <Button label="Search" size="compact" isFormSubmit={true} /> */}
                </form>
            </div>

            {results ? (
                <>
                    <div className="flex flex-col">
                        <div className="px-4 py-2 flex justify-end">
                            <p className="text-02 text-sm">{resultsCount} results</p>
                        </div>

                        <AssetGrid assets={results} />
                    </div>

                    <div className="flex items-center justify-between w-full p-4 gap-3">
                        <IconButton disabled={resultsPage === 1 ? true : false} onClick={handlePrev}>
                            <LeftChevron />
                        </IconButton>

                        <p className="text-base text-01">{resultsPage}</p>

                        <IconButton disabled={resultsPage >= totalPages ? true : false} onClick={handleNext}>
                            <RightChevron />
                        </IconButton>
                    </div>
                </>
            ) : (
                <div className="flex flex-col gap-4 px-4 w-full h-full">
                    <p>Nothing yet. Search for something.</p>

                    <div className="flex gap-3 flex-wrap">
                        <Chip label="abstract" handleClick={() => handleChipClick("abstract")} />
                        <Chip label="Audi" handleClick={() => handleChipClick("Audi")} />
                        <Chip label="BMW" handleClick={() => handleChipClick("BMW")} />
                        <Chip label="convertible" handleClick={() => handleChipClick("convertible")} />
                        <Chip label="exotic" handleClick={() => handleChipClick("exotic")} />
                        <Chip label="hero" handleClick={() => handleChipClick("hero")} />
                        <Chip label="Porsche" handleClick={() => handleChipClick("Porsche")} />
                        <Chip label="SUV" handleClick={() => handleChipClick("SUV")} />
                        <Chip label="Toyota" handleClick={() => handleChipClick("Toyota")} />
                    </div>
                </div>
            )}
        </div> 
    );
}