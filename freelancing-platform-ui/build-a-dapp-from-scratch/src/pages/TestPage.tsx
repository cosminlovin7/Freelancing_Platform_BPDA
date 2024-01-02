import Navbar from "./ui/Navbar.tsx";
import {useGetIsLoggedIn} from "@multiversx/sdk-dapp/hooks";
export const TestPage = () => {
    const isLoggedIn = useGetIsLoggedIn();
    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} menuList={[{name:"My Projects", url:"/projects"}, {name:"My Agreements", url:"/agreements"}]}/>
        </>
    )
}