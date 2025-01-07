interface ChipProps {
    label: string
    handleClick: () => void
}

export default function Chip({ label, handleClick }: ChipProps) {
    return (
        <div className="flex gap-2 items-center justify-center px-3 py-2 cursor-pointer rounded-lg surface-02 hover:opacity-90 transition-opacity duration-150" onClick={handleClick}>
            <p>{label}</p>
        </div>
    )
}