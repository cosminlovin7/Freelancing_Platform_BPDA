import {useGetAccountInfo} from "@multiversx/sdk-dapp/hooks/account/useGetAccountInfo";
import {getChainID} from "@multiversx/sdk-dapp/utils";
import {Address} from "@multiversx/sdk-core";
import {_SmartContract} from "utils/_SmartContract";
import {sendTransactions} from "@multiversx/sdk-dapp/services";

export const _useAcceptAgreement = () => {
    const {account} = useGetAccountInfo();

    const getAcceptAgreementTransaction = (agreement_id: number, agreed_value: number) => {
        return _SmartContract.methods
            .accept_agreement([agreement_id])
            .withValue(agreed_value)
            .withGasLimit(10000000)
            .withChainID(getChainID())
            .withSender(Address.fromString(account.address))
            .buildTransaction()
            .toPlainObject()
    }

    const onAcceptAgreement = async (agreement_id: number, agreed_value: number) => {
        const acceptAgreementTransaction = getAcceptAgreementTransaction(agreement_id, agreed_value);

        await sendTransactions({
            transactions: acceptAgreementTransaction,
            transactionsDisplayInfo: {
                processingMessage: 'Accepting agreement in progress...',
                errorMessage: 'An error has occurred during agreement acceptance',
                successMessage: 'Agreement accepted successfully'
            },
            redirectAfterSign: false
        });
    }

    return {
        getAcceptAgreementTransaction,
        onAcceptAgreement
    }
}