import MagnifyingGlass from "~/icons/MagnifyingGlass"

export interface SearchInputProps {
    id: string
    label: string
    placeholder?: string
    onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SearchInput({ id, label, placeholder, onInput }: SearchInputProps) {
    return (
        <div className="flex gap-3 w-full">
            <MagnifyingGlass />

            <input id={id} type="text" aria-label={label} placeholder={placeholder} onInput={onInput} className="w-full px-3 py-2 text-base rounded-lg backdrop-blur-xl surface-material drop-shadow-xl placeholder:text-02 focus:interactive-focus below-m" />
        </div>
    )
}