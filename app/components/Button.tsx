interface ButtonProps {
    label: string
    type?: 'primary' | 'outline'
    fullWidth?: boolean
    size?: 'regular' | 'compact'
    disabled?: boolean
    onClick?: () => void
    isFormSubmit?: boolean
}
  
export default function Button(
    {label, type = 'outline', fullWidth, size = 'regular', disabled = false, onClick, isFormSubmit = false}: ButtonProps) {
    const buttonProps = isFormSubmit ? { type: "submit" as const, disabled } : { type: "button" as const, onClick, disabled };

    return (
        <button
        {...buttonProps}
        className={`font-semibold rounded-lg
        ${type === "outline" ? " surface-01 border stroke-01" : " interactive-01 text-white"}
        ${fullWidth ? " w-full" : ""} 
        ${size === "compact" ? " text-xs py-2 px-3" : " text-base py-2 px-3"}
        ${disabled ? " interactive-disabled" : " hover:opacity-80"}`}
        >
            {label}
        </button>
    )
}