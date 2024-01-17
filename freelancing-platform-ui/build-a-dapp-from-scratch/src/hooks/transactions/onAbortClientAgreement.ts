import {useGetAccountInfo} from "@multiversx/sdk-dapp/hooks/account/useGetAccountInfo";
import {getChainID} from "@multiversx/sdk-dapp/utils";
import {Address} from "@multiversx/sdk-core";
import {_SmartContract} from "utils/_SmartContract";
import {sendTransactions} from "@multiversx/sdk-dapp/services";

export const _useAbortClientAgreement = () => {
    const {account} = useGetAccountInfo();

    const getAbortClientAgreementTransaction = (agreement_id: number) => {
        return _SmartContract.methods
            .abort_employer_agreement([agreement_id])
            .withGasLimit(10000000)
            .withChainID(getChainID())
            .withSender(Address.fromString(account.address))
            .buildTransaction()
            .toPlainObject()
    }

    const onAbortClientAgreement = async (agreement_id: number) => {
        const abortClientAgreementTransaction = getAbortClientAgreementTransaction(agreement_id);

        await sendTransactions({
            transactions: abortClientAgreementTransaction,
            transactionsDisplayInfo: {
                processingMessage: 'Aborting agreement in progress...',
                errorMessage: 'An error has occurred during agreement aborting',
                successMessage: 'Agreement aborted successfully'
            },
            redirectAfterSign: false
        });
    }

    return {
        getAbortClientAgreementTransaction,
        onAbortClientAgreement
    }
}