import {useGetAccountInfo} from "@multiversx/sdk-dapp/hooks/account/useGetAccountInfo";
import {getChainID} from "@multiversx/sdk-dapp/utils";
import {Address} from "@multiversx/sdk-core";
import {_SmartContract} from "utils/_SmartContract";
import {sendTransactions} from "@multiversx/sdk-dapp/services";

export const _useCreateAgreement = () => {
    const {account} = useGetAccountInfo();

    const getCreateAgreementTransaction = () => {
        return _SmartContract.methods
            .create_agreement([account.address, account.address])
            .withValue(0)
            .withGasLimit(5000000)
            .withChainID(getChainID())
            .withSender(Address.fromString(account.address))
            .buildTransaction()
            .toPlainObject()
    }

    const onCreateAgreement = async () => {
        const createAgreementTransaction = getCreateAgreementTransaction();

        await sendTransactions({
            transactions: createAgreementTransaction,
            transactionsDisplayInfo: {
                processingMessage: 'Processing Cancel transaction',
                errorMessage: 'An error has occurred during Cancel',
                successMessage: 'Cancel transaction successful'
            },
            redirectAfterSign: false
        });
    }

    return {
        getCreateAgreementTransaction,
        onCreateAgreement
    }
}