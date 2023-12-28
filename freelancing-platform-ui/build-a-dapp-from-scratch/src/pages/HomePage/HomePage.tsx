import {BalanceSection} from "./components/BalanceSection.tsx"
import {useGetAccount, useGetIsLoggedIn} from "@multiversx/sdk-dapp/hooks"
import {useNavigate} from "react-router-dom";
import {logout} from "@multiversx/sdk-dapp/utils";
import {ContractSumSection} from "./components/ContractSumSection.tsx";

export const HomePage = () => {
    const isLoggedIn = useGetIsLoggedIn();
    const navigate = useNavigate();
    // const accountInfo = useGetAccountInfo();
    const account = useGetAccount();

    console.log("is logged in: " + isLoggedIn);
    console.log("account: " + JSON.stringify(account, null, 4));

    return (
        <>

            {
                isLoggedIn ? (
                    <>
                        <BalanceSection/>
                        <ContractSumSection/>
                        <button onClick={() => logout()}>Logout</button>
                        <button onClick={() => navigate("/test")}>Test Button</button>
                    </>
                ) : (
                    <button onClick={() => navigate("/unlock")}>Connect</button>
                )
            }

        </>
    )
}