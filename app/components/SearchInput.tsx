import { useEffect, useState } from "react"
import MagnifyingGlass from "~/icons/MagnifyingGlass"
import IconButton from "./IconButton"
import CloseCircleFilled from "~/icons/CloseCircleFilled"

export interface SearchInputProps {
    id: string
    label: string
    placeholder?: string
    value: string
    onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SearchInput({ id, label, placeholder, value, onInput }: SearchInputProps) {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        if (onInput) {
            onInput(event);
        }
    };

    const clearInput = () => {
        setInputValue('');
        if (onInput) {
            // Create a synthetic event to pass to the onInput handler
            const syntheticEvent = {
                target: { value: '' },
                currentTarget: { value: '' },
                preventDefault: () => {}, // Add a dummy preventDefault function
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            onInput(syntheticEvent);
        }
    };

    return (
        <div className="flex items-center gap-1 w-full px-1 py-1 rounded-lg backdrop-blur-xl surface-material drop-shadow-xl focus:interactive-focus below-m">
            <div className="w-8 h-8 flex items-center justify-center p-2">
                <MagnifyingGlass />
            </div>

            <input
                id={id}
                type="text"
                aria-label={label}
                placeholder={placeholder}
                value={inputValue}
                onInput={handleInputChange}
                className="w-full bg-transparent text-base placeholder:text-02 focus-visible:outline-none"
            />

            {inputValue && (
                <IconButton onClick={clearInput}>
                    <CloseCircleFilled />
                </IconButton>
            )}
        </div>
    );
}