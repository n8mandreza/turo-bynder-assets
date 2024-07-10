import MagnifyingGlass from "~/icons/MagnifyingGlass"
import IconButton from "./IconButton"
import CloseCircleFilled from "~/icons/CloseCircleFilled"

interface SearchInputProps {
    id: string
    label: string
    placeholder?: string
    value: string
    onInput: (event: React.ChangeEvent<HTMLInputElement>) => void
    onClear: () => void
}

export default function SearchInput({ id, label, placeholder, value, onInput, onClear }: SearchInputProps) {

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
                value={value}
                onInput={onInput}
                className="w-full bg-transparent text-base placeholder:text-02 focus-visible:outline-none"
            />

            {value && (
                <IconButton onClick={onClear}>
                    <CloseCircleFilled />
                </IconButton>
            )}
        </div>
    );
}