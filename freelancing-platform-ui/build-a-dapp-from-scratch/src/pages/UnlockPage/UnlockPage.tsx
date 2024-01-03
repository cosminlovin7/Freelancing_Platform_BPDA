import {
    ExtensionLoginButton,
    WebWalletLoginButton
} from "@multiversx/sdk-dapp/UI";
import {useNavigate} from "react-router-dom";
import {useGetIsLoggedIn} from "@multiversx/sdk-dapp/hooks";

export const UnlockPage = () => {
    const navigate = useNavigate();
    const isLoggedIn = useGetIsLoggedIn();

    // useEffect(() => {
    //     // Function to be triggered after 3 seconds
    //     const delayedFunction = () => {
    //         // Your logic here
    //         navigate("/");
    //     };
    //
    //     let timeoutId: NodeJS.Timeout | null = null;
    //     if (isLoggedIn) {
    //         // Set a timeout for 5 seconds
    //         timeoutId = setTimeout(delayedFunction, 3000);
    //     }
    //
    //     // Clear the timeout if the component unmounts before 3 seconds
    //     return () => {
    //         if (null != timeoutId) {
    //             clearTimeout(timeoutId);
    //         }
    //     }
    // }, []);

    return (
        <div>
            <div>
                {
                    isLoggedIn ?
                        (
                            <div>
                                You are already logged in! Redirecting...
                            </div>
                        )
                        : (
                            <>
                                <h2>Login with:</h2>
                                <ExtensionLoginButton
                                    loginButtonText="DeFi Wallet"
                                    callbackRoute="/v2"
                                    onLoginRedirect={() => {
                                        navigate("/v2");
                                    }}
                                />
                                <WebWalletLoginButton
                                    loginButtonText="Web Wallet"
                                    callbackRoute="/v2"
                                />
                            </>
                        )
                }
            </div>
        </div>
    )
}