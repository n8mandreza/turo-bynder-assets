import { Link } from "@remix-run/react";

export default function NavBar() {
    return (
        <div className="flex fixed surface-sticky top-0 left-0 right-0 z-50 gap-3 px-4 py-2 border-b stroke-01 text-sm">
            <Link to="/search">
                <p className="hover:opacity-60">Search</p>
            </Link>

            <p className="text-02 pointer-events-none">
                Collections (WIP)
            </p>
        </div>
    )
}