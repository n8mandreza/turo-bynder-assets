import { Link, useLocation } from "@remix-run/react";
import Grid from "~/icons/Grid";
import MagnifyingGlass from "~/icons/MagnifyingGlass";

interface NavBarItemProps {
    to: string;
    title: string;
    icon?: React.ReactNode;
}

function NavBarItem({ to, title , icon}: NavBarItemProps) {
    const location = useLocation();
    const currentPath = location.pathname;
    
    return (
        <Link to={to} className={`flex items-center gap-1 py-1 px-2 ${currentPath === to ? "surface-02 text-01" : "surface-transparent text-02"} hover:surface-02 rounded-md transition-colors duration-150`}>
            {icon && icon}

            <p className={`${currentPath === to ? "" : "text-02"}`}>
                {title}
            </p>
        </Link>
    )
}

export default function NavBar() {
    return (
        <div className="flex sticky surface-sticky w-full z-50 gap-3 px-2 py-2 border-b stroke-01 text-sm">
            <NavBarItem to="/search" title="Search" icon={<MagnifyingGlass />} />

            <NavBarItem to="/collections" title="Collections" icon={<Grid />} />
        </div>
    )
}