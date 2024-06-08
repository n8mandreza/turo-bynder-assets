interface TextInputProps {
    id: string
    label: string
    showLabel?: boolean
    placeholder?: string
    onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function TextInput({id, label, showLabel, placeholder, onInput}: TextInputProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor={id} className={`text-xs font-medium ${showLabel === false ? 'hidden' : ''}`}>
                {label}
            </label>

            <input id={id} type="text" placeholder={placeholder} onInput={onInput} className="w-full px-3 py-2 text-base rounded-lg surface-01 border stroke-01 placeholder:text-02 focus:outline-1 focus:interactive-focus focus:outline"/>
        </div>
    )
}