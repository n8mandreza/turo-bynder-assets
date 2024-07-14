import { Link, useLocation } from "@remix-run/react";

export default function NavBar() {
    const location = useLocation();
    const currentPath = location.pathname;
    
    return (
        <div className="flex sticky surface-sticky w-full z-50 gap-3 px-4 py-2 border-b stroke-01 text-sm">
            <Link to="/search">
                <p className={`hover:opacity-60 ${currentPath === "/search" ? "" : "text-02"}`}>
                    Search
                </p>
            </Link>

            <Link to="/collections">
                <p className={`hover:opacity-60 ${currentPath === "/search" ? "" : "text-02"}`}>
                    Collections
                </p>
            </Link>
        </div>
    )
}