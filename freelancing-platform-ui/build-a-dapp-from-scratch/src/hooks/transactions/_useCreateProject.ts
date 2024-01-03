import {useGetAccountInfo} from "@multiversx/sdk-dapp/hooks/account/useGetAccountInfo";
import {getChainID} from "@multiversx/sdk-dapp/utils";
import {Address} from "@multiversx/sdk-core";
import {_SmartContract} from "utils/_SmartContract";
import {sendTransactions} from "@multiversx/sdk-dapp/services";

export const _useCreateProject = () => {
    const {account} = useGetAccountInfo();

    const getCreateProjectTransaction = (project_name: string, project_description: string) => {
        console.log(Buffer.from(project_name, 'utf-8').toString('hex'));

        return _SmartContract.methods
            .create_project([
                Buffer.from(project_name, 'utf-8').toString('hex'),
                Buffer.from(project_description, 'utf-8').toString('hex')
            ])
            .withValue(25 * 10**16)
            .withGasLimit(10000000)
            .withChainID(getChainID())
            .withSender(Address.fromString(account.address))
            .buildTransaction()
            .toPlainObject()
    }

    const onCreateProject = async (project_name: string, project_description: string) => {
        const createProjectTransaction = getCreateProjectTransaction(project_name, project_description);

        await sendTransactions({
            transactions: createProjectTransaction,
            transactionsDisplayInfo: {
                processingMessage: 'Creating project in progress...',
                errorMessage: 'An error has occurred during project creation',
                successMessage: 'Project created successfully'
            },
            redirectAfterSign: false
        });
    }

    return {
        getCreateProjectTransaction,
        onCreateProject
    }
}