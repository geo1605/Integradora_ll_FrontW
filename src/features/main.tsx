import { SuudaiNavbar } from "../components";
import { Outlet } from "react-router-dom";

export default function Main() {
    return (
        <>
        <SuudaiNavbar />
        <Outlet />
        </>
    )
}