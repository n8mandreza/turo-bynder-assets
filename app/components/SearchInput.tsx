import MagnifyingGlass from "~/icons/MagnifyingGlass"

export interface SearchInputProps {
    id: string
    label: string
    placeholder?: string
    onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SearchInput({ id, label, placeholder, onInput }: SearchInputProps) {
    return (
        <div className="flex item-center gap-3 w-full px-3 py-2 rounded-lg backdrop-blur-xl surface-material drop-shadow-xl focus:interactive-focus below-m">
            <MagnifyingGlass />

            <input id={id} type="text" aria-label={label} placeholder={placeholder} onInput={onInput} className="w-full bg-transparent text-base placeholder:text-02 focus-visible:outline-none" />
        </div>
    )
}