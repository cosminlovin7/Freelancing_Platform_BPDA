import {useGetAccountInfo} from "@multiversx/sdk-dapp/hooks/account/useGetAccountInfo";
import {getChainID} from "@multiversx/sdk-dapp/utils";
import {Address} from "@multiversx/sdk-core";
import {_SmartContract} from "utils/_SmartContract";
import {sendTransactions} from "@multiversx/sdk-dapp/services";

export const _useCompleteAgreement = () => {
    const {account} = useGetAccountInfo();

    const getCompleteAgreementTransaction = (agreement_id: number) => {
        return _SmartContract.methods
            .complete_agreement([agreement_id])
            .withGasLimit(10000000)
            .withChainID(getChainID())
            .withSender(Address.fromString(account.address))
            .buildTransaction()
            .toPlainObject()
    }

    const onCompleteAgreement = async (agreement_id: number) => {
        const completeAgreementTransaction = getCompleteAgreementTransaction(agreement_id);

        await sendTransactions({
            transactions: completeAgreementTransaction,
            transactionsDisplayInfo: {
                processingMessage: 'Completing agreement in progress...',
                errorMessage: 'An error has occurred during agreement completance',
                successMessage: 'Agreement completed successfully'
            },
            redirectAfterSign: false
        });
    }

    return {
        getCompleteAgreementTransaction,
        onCompleteAgreement
    }
}