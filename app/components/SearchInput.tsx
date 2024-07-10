import MagnifyingGlass from "~/icons/MagnifyingGlass"
import IconButton from "./IconButton"
import CloseCircleFilled from "~/icons/CloseCircleFilled"
import { UseFormRegisterReturn } from "react-hook-form";

interface SearchInputProps {
    formId: string
    label: string
    placeholder?: string
    register: UseFormRegisterReturn; // Use react-hook-form's register return type
    value: string
    // onInput: (event: React.ChangeEvent<HTMLInputElement>) => void
    onClear: () => void
}

export default function SearchInput({ formId, label, placeholder, register, value, onClear }: SearchInputProps) {

    return (
        <div className="flex items-center gap-1 w-full px-1 py-1 rounded-lg backdrop-blur-xl surface-material drop-shadow-xl focus:interactive-focus below-m">
            <div className="w-8 h-8 flex items-center justify-center p-2">
                <MagnifyingGlass />
            </div>

            <input
                form={formId}
                type="text"
                aria-label={label}
                placeholder={placeholder}
                value={value}
                // {onInput={onInput}}
                {...register}
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