import MagnifyingGlass from "~/icons/MagnifyingGlass"
import IconButton from "./IconButton"
import CloseCircleFilled from "~/icons/CloseCircleFilled"
import { useState } from "react"

interface SearchInputProps {
    formId: string
    label: string
    placeholder?: string
    value: string
    icon?: boolean
    onInput: (event: React.ChangeEvent<HTMLInputElement>) => void
    onClear: () => void
}

export default function SearchInput({ formId, label, placeholder, value, icon = false, onInput, onClear }: SearchInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
        <div className={`flex items-center gap-2 w-full pl-3 pr-1 py-1 rounded-lg backdrop-blur-xl surface-02 transition-colors duration-150 ${isFocused ? 'interactive-focus' : ''}`}>
            {icon ? (
                <div className={`${isFocused ? 'text-01' : 'text-02'}`}>
                    <MagnifyingGlass />
                </div>
            ) : null}

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
                <IconButton icon={<CloseCircleFilled />} isSecondary={true} onClick={onClear} />
            )}
        </div>
    );
}