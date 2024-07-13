import { Outlet } from "@remix-run/react";
import NavBar from "~/components/NavBar";

export default function AssetsLayout() {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen">
            <NavBar />
            
            <Outlet />
        </div>
    )
}