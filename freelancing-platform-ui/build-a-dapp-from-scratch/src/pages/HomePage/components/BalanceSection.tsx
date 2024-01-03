import {FormatAmount} from "@multiversx/sdk-dapp/UI"
import {useGetAccountInfo, useGetNetworkConfig} from "@multiversx/sdk-dapp/hooks"

export const BalanceSection = () => {
    const {account} = useGetAccountInfo();
    const {network} = useGetNetworkConfig();

    return (
        <div>
            Balance: <FormatAmount value={account.balance} egldLabel={network.egldLabel}/>
        </div>
    )
}