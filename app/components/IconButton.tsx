import { ReactNode, useState } from "react";

interface IconButtonProps {
    icon: ReactNode;
    isSecondary?: boolean;
    disabled?: boolean;
    onClick: () => void;
}

export default function IconButton({ icon, isSecondary = false, disabled = false, onClick }: IconButtonProps) {

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`${disabled ? 'interactive-fg-disabled' : 'hover:opacity-80 hover:surface-01'} ${isSecondary ? 'text-03' : ''} rounded-lg p-2`}
        >
            {icon && icon}
        </button>
    )
}