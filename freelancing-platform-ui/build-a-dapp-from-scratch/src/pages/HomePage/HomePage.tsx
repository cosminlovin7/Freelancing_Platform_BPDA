import {BalanceSection} from "./components/BalanceSection.tsx"
import {
    useGetAccount,
    useGetIsLoggedIn
} from "@multiversx/sdk-dapp/hooks"
import {useNavigate} from "react-router-dom";
import {getChainID, logout} from "@multiversx/sdk-dapp/utils";
import {AgreementSection} from "./components/AgreementSection";
import {AgreementStatusSection} from "./components/AgreementStatusSection";
import {_useCreateAgreement} from "../../hooks/transactions/_useCreateAgreement.ts";
import {WALLET_PROVIDER_TESTNET, WalletProvider} from "@multiversx/sdk-web-wallet-provider/out";
import {_SmartContract} from "../../utils/_SmartContract.ts";
import {Address} from "@multiversx/sdk-core/out";

export const HomePage = () => {
    const isLoggedIn = useGetIsLoggedIn();
    const navigate = useNavigate();
    // const accountInfo = useGetAccountInfo();
    const account = useGetAccount();
    const {onCreateAgreement} = _useCreateAgreement();
    // const {callbackRoute, transactions, error, sessionId, onAbort, hasTransactions, canceledTransactionsMessage} = useSignTransactions();
    //
    // if (hasTransactions) {
    //     console.log(callbackRoute);
    //     console.log(transactions);
    //     console.log(sessionId);
    //     console.log(hasTransactions);
    //     console.log(canceledTransactionsMessage);
    //
    // }

    console.log("is logged in: " + isLoggedIn);
    console.log("account: " + JSON.stringify(account, null, 4));

    const handleLoginButtonCustom = async () => {
        const provider = new WalletProvider(WALLET_PROVIDER_TESTNET);
        const callbackUrl = encodeURIComponent("http://localhost:5173/");
        await provider.login({ callbackUrl });
    }

    const onCreateAgreementWithProvider = async () => {
        const provider = new WalletProvider(WALLET_PROVIDER_TESTNET);
        const callbackUrl = encodeURIComponent("http://localhost:5173/");
        await provider.signTransactions(
            [_SmartContract.methods
                .create_agreement([account.address, account.address])
                .withValue(0)
                .withGasLimit(5000000)
                .withChainID(getChainID())
                .withSender(Address.fromString("erd1swpn0vca5znjv26hj0jdls7f8c0m7qqwkgg9xk7fc7h3jn9ly5us8rjekd"))
                .buildTransaction()],
            { callbackUrl: callbackUrl }
        );
    }

    return (
        <>

        {
            isLoggedIn ? (
                <>
                    <BalanceSection/>
                    <AgreementSection/>
                    <AgreementStatusSection/>
                    <button onClick={() => logout()}>Logout</button>
                    <button onClick={() => navigate("/test")}>Test Button</button>
                    <button onClick={() => onCreateAgreement()}>Create Default Agreement</button>
                    <button onClick={() => onCreateAgreementWithProvider()}>Create Default Agreement with provider</button>
                </>
            ) : (
                <>
                    <button onClick={() => navigate("/unlock")}>Connect</button>
                    <button onClick={() => handleLoginButtonCustom()}>Login</button>
                </>
            )
        }

        </>
    )
}