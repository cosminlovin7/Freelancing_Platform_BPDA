import {useCallback, useEffect, useState} from "react";
import {_AgreementType} from "types/_AgreementType";
import {API_URL} from "../../config";
import {ProxyNetworkProvider} from "@multiversx/sdk-network-providers/out";
import {_SmartContract} from "../../utils/_SmartContract.ts";
import {ResultsParser} from "@multiversx/sdk-core/out";
import {_ResponseAgreementStatusType} from "../../types/_ResponseAgreementStatusType.ts";
import {_ResponseAgreementType} from "../../types/_ResponseAgreementType.ts";
export const _useGetAgreementById = (agreementId:number) => {
    const [queryResult, setQueryResult] = useState<_AgreementType | null | undefined>(null);

    const getAgreementById = useCallback(async (agreementId:number) => {
        try {
            const networkProvider = new ProxyNetworkProvider(API_URL);
            const interaction = _SmartContract.methods.getAgreementById([agreementId]);
            const query = interaction.buildQuery();

            const response = await networkProvider.queryContract(query);

            const {firstValue: agreementResult} = new ResultsParser().parseQueryResponse(response, interaction.getEndpoint());

            if (agreementResult) {
                const agreementDeserialized:_AgreementType = (function(_agreement: _ResponseAgreementType) {
                    return {
                        agreement_id: _agreement.agreement_id.valueOf(),
                        deadline: _agreement.deadline.valueOf(),
                        employee_address: _agreement.employee_address,
                        employer_address: _agreement.employer_address,
                        project_id: _agreement.project_id.valueOf(),
                        value: _agreement.value.valueOf()
                    }
                })(agreementResult.valueOf());

                return agreementDeserialized;
            }

            return null;
        } catch (e) {
            console.warn(e);
        }
    }, []);

    useEffect(() => {
        let mountedComponent = true;

        getAgreementById(agreementId)
            .then((data) => {
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