import LeftChevron from "~/icons/LeftChevron";
import IconButton from "./IconButton";
import RightChevron from "~/icons/RightChevron";

interface PaginationProps {
    currentPage: number
    totalPages: number
    handlePrev: () => void
    handleNext: () => void
}

export default function Pagination({currentPage, totalPages, handlePrev, handleNext}: PaginationProps) {
    return (
        <div className="surface-sticky border-t stroke-01 flex items-center justify-between w-full px-4 py-1 gap-3">
            <IconButton disabled={currentPage === 1 ? true : false} onClick={handlePrev}>
                <LeftChevron />
            </IconButton>

            <p className="text-sm text-01">{currentPage}</p>

            <IconButton disabled={currentPage >= totalPages ? true : false} onClick={handleNext}>
                <RightChevron />
            </IconButton>
        </div>
    )
}