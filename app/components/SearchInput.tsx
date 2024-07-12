import MagnifyingGlass from "~/icons/MagnifyingGlass"
import IconButton from "./IconButton"
import CloseCircleFilled from "~/icons/CloseCircleFilled"
import { useState } from "react"

interface SearchInputProps {
    formId: string
    label: string
    placeholder?: string
    value: string
    onInput: (event: React.ChangeEvent<HTMLInputElement>) => void
    onClear: () => void
}

export default function SearchInput({ formId, label, placeholder, value, onInput, onClear }: SearchInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
        <div className={`flex items-center gap-1 w-full px-1 py-1 rounded-lg backdrop-blur-xl surface-02 ${isFocused ? 'interactive-focus' : ''}`}>
            <div className="w-8 h-8 flex items-center justify-center p-2">
                <MagnifyingGlass />
            </div>

            <input
                form={formId}
                type="text"
                aria-label={label}
                placeholder={placeholder}
                value={value}
                onInput={onInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full bg-transparent text-base placeholder:text-02 focus-visible:outline-none"
            />

            {value && (
                <IconButton isSecondary={true} onClick={onClear}>
                    <CloseCircleFilled />
                </IconButton>
            )}
        </div>
    );
}