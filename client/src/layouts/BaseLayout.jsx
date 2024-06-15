import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function BaseLayout() {
    return (
        <>
            <Navbar />
            <div className="mainContentFrame">
                <Outlet />
            </div>
        </>
    )
}