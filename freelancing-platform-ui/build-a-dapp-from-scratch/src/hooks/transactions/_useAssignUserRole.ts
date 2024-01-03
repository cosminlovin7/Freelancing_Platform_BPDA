import {useGetAccountInfo} from "@multiversx/sdk-dapp/hooks/account/useGetAccountInfo";
import {getChainID} from "@multiversx/sdk-dapp/utils";
import {Address} from "@multiversx/sdk-core";
import {_SmartContract} from "utils/_SmartContract";
import {sendTransactions} from "@multiversx/sdk-dapp/services";

export const _useAssignUserRole = () => {
    const {account} = useGetAccountInfo();

    const getAssignUserRoleTransaction = (user_role: number) => {
        switch (user_role) {
            case 0:
                console.warn('bad logic')
                break;
            case 1:
                return _SmartContract.methods
                    .create_freelancer_account()
                    .withValue(25 * 10**15)
                    .withGasLimit(10000000)
                    .withChainID(getChainID())
                    .withSender(Address.fromString(account.address))
                    .buildTransaction()
                    .toPlainObject();
            case 2:
                return _SmartContract.methods
                    .create_client_account()
                    .withValue(25 * 10**15)
                    .withGasLimit(10000000)
                    .withChainID(getChainID())
                    .withSender(Address.fromString(account.address))
                    .buildTransaction()
                    .toPlainObject();
            default:
                console.warn("bad logic");
                break;
        }
    }

    const onAssignUserRole = async (user_role: number) => {
        const assignUserRoleTransaction = getAssignUserRoleTransaction(user_role);

        await sendTransactions({
            transactions: assignUserRoleTransaction,
            transactionsDisplayInfo: {
                processingMessage: 'Assigning role in progress...',
                errorMessage: 'An error has occurred during role assign',
                successMessage: 'Role assigned successfully'
            },
            redirectAfterSign: false
        });
    }

    return {
        getAssignUserRoleTransaction,
        onAssignUserRole
    }
}