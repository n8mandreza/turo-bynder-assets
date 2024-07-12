import { ReactNode, useState } from "react";

interface IconButtonProps {
    children: ReactNode;
    isSecondary?: boolean;
    disabled?: boolean;
    onClick: () => void;
}

export default function IconButton({ children, isSecondary = false, disabled = false, onClick }: IconButtonProps) {

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`${disabled ? 'interactive-fg-disabled' : 'hover:opacity-80 hover:surface-01'} ${isSecondary ? 'text-02' : ''} rounded-lg p-2`}
        >
            {children}
        </button>
    )
}