import {BalanceSection} from "./components/BalanceSection.tsx"
import {
    useGetAccount,
    useGetIsLoggedIn
} from "@multiversx/sdk-dapp/hooks"
import {useNavigate} from "react-router-dom";
import {logout} from "@multiversx/sdk-dapp/utils";
import {AgreementSection} from "./components/AgreementSection";
import {AgreementStatusSection} from "./components/AgreementStatusSection";
import {_useCreateAgreement} from "../../hooks/transactions/_useCreateAgreement.ts";
import {EmployeeAgreementsSection} from "./components/EmployeeAgreementsSection.tsx";
import {_useCreateProject} from "../../hooks/transactions/_useCreateProject.ts";
import {UserProjectsSection} from "./components/UserProjectsSection.tsx";

export const HomePage = () => {
    const isLoggedIn = useGetIsLoggedIn();
    const navigate = useNavigate();
    const account = useGetAccount();
    const {onCreateAgreement} = _useCreateAgreement();
    const {onCreateProject} = _useCreateProject();
    console.log("is logged in: " + isLoggedIn);
    console.log("account: " + JSON.stringify(account, null, 4));

    return (
        <>

        {
            isLoggedIn ? (
                <>
                    <BalanceSection/>
                    <AgreementSection/>
                    <AgreementStatusSection/>
                    <EmployeeAgreementsSection/>
                    <UserProjectsSection/>
                    <button onClick={() => logout()}>Logout</button>
                    <button onClick={() => navigate("/test")}>Test Button</button>
                    <button onClick={() => onCreateAgreement()}>Create Default Agreement</button>
                    <button onClick={() => onCreateProject("Test", "test")}>Create Default Project</button>
                </>
            ) : (
                <>
                    <button onClick={() => navigate("/unlock")}>Connect</button>
                </>
            )
        }

        </>
    )
}