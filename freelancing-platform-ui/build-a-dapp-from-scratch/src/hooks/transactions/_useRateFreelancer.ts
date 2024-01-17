import {useGetAccountInfo} from "@multiversx/sdk-dapp/hooks/account/useGetAccountInfo";
import {getChainID} from "@multiversx/sdk-dapp/utils";
import {Address} from "@multiversx/sdk-core";
import {_SmartContract} from "utils/_SmartContract";
import {sendTransactions} from "@multiversx/sdk-dapp/services";

export const _useRateFreelancer = () => {
    const {account} = useGetAccountInfo();

    const getRateFreelancerTransaction = (agreement_id: number, employee_addr: Address, employee_rating: number) => {
        return _SmartContract.methods
            .rate_employee([agreement_id, employee_addr, employee_rating])
            .withGasLimit(10000000)
            .withChainID(getChainID())
            .withSender(Address.fromString(account.address))
            .buildTransaction()
            .toPlainObject()
    }

    const onRateFreelancer = async (agreement_id: number, employee_addr: Address, employee_rating: number) => {
        const RateFreelancerTransaction = getRateFreelancerTransaction(agreement_id, employee_addr, employee_rating);

        await sendTransactions({
            transactions: RateFreelancerTransaction,
            transactionsDisplayInfo: {
                processingMessage: 'Rating freelancer in progress...',
                errorMessage: 'An error has occurred during freelancer rating',
                successMessage: 'Freelancer rated successfully'
            },
            redirectAfterSign: false
        });
    }

    return {
        getRateFreelancerTransaction,
        onRateFreelancer
    }
}