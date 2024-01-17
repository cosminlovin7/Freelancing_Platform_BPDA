import {useGetAccountInfo} from "@multiversx/sdk-dapp/hooks/account/useGetAccountInfo";
import {getChainID} from "@multiversx/sdk-dapp/utils";
import {Address} from "@multiversx/sdk-core";
import {_SmartContract} from "utils/_SmartContract";
import {sendTransactions} from "@multiversx/sdk-dapp/services";

export const _useCreateAgreement = () => {
    const {account} = useGetAccountInfo();

    const getCreateAgreementTransaction = (employer_addr: Address, project_id: number, offered_value: number) => {
        return _SmartContract.methods
            .create_agreement([employer_addr, project_id, offered_value])
            .withValue(0)
            .withGasLimit(10000000)
            .withChainID(getChainID())
            .withSender(Address.fromString(account.address))
            .buildTransaction()
            .toPlainObject()
    }

    const onCreateAgreement = async (employer_addr: Address, project_id: number, offered_value: number) => {
        const createAgreementTransaction = getCreateAgreementTransaction(employer_addr, project_id, offered_value);

        await sendTransactions({
            transactions: createAgreementTransaction,
            transactionsDisplayInfo: {
                processingMessage: 'Creating agreement in progress...',
                errorMessage: 'An error has occurred during agreement creation',
                successMessage: 'Agreement created successfully'
            },
            redirectAfterSign: false
        });
    }

    return {
        getCreateAgreementTransaction,
        onCreateAgreement
    }
}