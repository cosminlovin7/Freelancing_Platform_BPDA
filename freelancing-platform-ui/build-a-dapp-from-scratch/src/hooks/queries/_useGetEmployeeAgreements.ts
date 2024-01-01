import {useCallback, useEffect, useState} from "react";
import {_AgreementType} from "../../types/_AgreementType.ts";
import {ProxyNetworkProvider} from "@multiversx/sdk-network-providers/out";
import {API_URL} from "../../config";
import {_SmartContract} from "../../utils/_SmartContract.ts";
import {ResultsParser} from "@multiversx/sdk-core/out";
import {useGetAccountInfo} from "@multiversx/sdk-dapp/hooks";

export const _useGetEmployeeAgreements = () => {
    const {account} = useGetAccountInfo();
    const [queryResult, setQueryResult] = useState<_AgreementType | null | undefined>(null);

    const getEmployeeAgreements = useCallback(async () => {
        try {
            const networkProvider = new ProxyNetworkProvider(API_URL);
            const interaction = _SmartContract.methods.getEmployeeAgreements([account.address]);
            const query = interaction.buildQuery();

            const response = await networkProvider.queryContract(query);

            const {firstValue: agreementResult} = new ResultsParser().parseQueryResponse(response, interaction.getEndpoint());

            console.log(agreementResult);

            // if (agreementResult) {
            //     const agreementDeserialized:_AgreementType = (function(_agreement:_AgreementType) {
            //         return {
            //             agreement_id: _agreement.agreement_id.valueOf(),
            //             deadline: _agreement.deadline.valueOf(),
            //             employee_address: _agreement.employee_address,
            //             employer_address: _agreement.employer_address,
            //             project_id: _agreement.project_id.valueOf(),
            //             value: _agreement.value.valueOf()
            //         }
            //     })(agreementResult.valueOf());
            //
            //     console.log(agreementDeserialized);
            //
            //     return agreementDeserialized;
            // }

            return null;
        } catch (e) {
            console.warn(e);
        }
    }, []);

    useEffect(() => {
        let mountedComponent = true;

        getEmployeeAgreements()
            .then((data) => {
                console.log('query returned successfully');
                if (mountedComponent) {
                    setQueryResult(data);
                } else {
                    console.warn('query aborted');
                }
            })
            .catch(e => console.warn(e));

        return () => {
            mountedComponent = false;
        }
    }, []);

    return queryResult;
}