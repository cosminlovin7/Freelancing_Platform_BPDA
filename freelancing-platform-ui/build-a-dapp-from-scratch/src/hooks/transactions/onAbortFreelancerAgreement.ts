import {useGetAccountInfo} from "@multiversx/sdk-dapp/hooks/account/useGetAccountInfo";
import {getChainID} from "@multiversx/sdk-dapp/utils";
import {Address} from "@multiversx/sdk-core";
import {_SmartContract} from "utils/_SmartContract";
import {sendTransactions} from "@multiversx/sdk-dapp/services";

export const _useAbortFreelancerAgreement = () => {
    const {account} = useGetAccountInfo();

    const getAbortFreelancerAgreementTransaction = (agreement_id: number) => {
        return _SmartContract.methods
            .abort_employee_agreement([agreement_id.toString(16)])
            .withGasLimit(10000000)
            .withChainID(getChainID())
            .withSender(Address.fromString(account.address))
            .buildTransaction()
            .toPlainObject()
    }

    const onAbortFreelancerAgreement = async (agreement_id: number) => {
        const abortFreelancerAgreementTransaction = getAbortFreelancerAgreementTransaction(agreement_id);

        await sendTransactions({
            transactions: abortFreelancerAgreementTransaction,
            transactionsDisplayInfo: {
                processingMessage: 'Accepting agreement in progress...',
                errorMessage: 'An error has occurred during agreement acceptance',
                successMessage: 'Agreement accepted successfully'
            },
            redirectAfterSign: false
        });
    }

    return {
        getAbortFreelancerAgreementTransaction,
        onAbortFreelancerAgreement
    }
}