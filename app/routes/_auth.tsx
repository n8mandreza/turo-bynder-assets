import { Outlet } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function AuthLayout() {
    const [isClient, setIsClient] = useState(false);

    // Set isClient to true when component mounts
    useEffect(() => setIsClient(true), []);

    return (
        isClient && (
            <div className="flex items-center justify-center w-screen h-screen">
                <Outlet/>
            </div>
        )
    )
}