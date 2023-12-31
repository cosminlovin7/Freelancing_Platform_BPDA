import {useCallback, useEffect, useState} from "react";
import {ProxyNetworkProvider} from "@multiversx/sdk-network-providers/out";
import {API_URL} from "../../config";
import {_SmartContract} from "../../utils/_SmartContract.ts";
import {ResultsParser} from "@multiversx/sdk-core/out";
import {_AgreementStatusType} from "../../types/_AgreementStatusType.ts";

export const _useGetAgreementStatusById = (agreementId:number) => {
    const [queryResult, setQueryResult] = useState<_AgreementStatusType | null | undefined>(null);

    const getAgreementStatusById = useCallback(async (agreementId:number) => {
        try {
            const networkProvider = new ProxyNetworkProvider(API_URL);
            const interaction = _SmartContract.methods.getAgreementStatusById([agreementId]);
            const query = interaction.buildQuery();

            const response = await networkProvider.queryContract(query);

            const {firstValue: agreementStatusResult} = new ResultsParser().parseQueryResponse(response, interaction.getEndpoint());

            if (agreementStatusResult) {
                const agreementStatusDeserialized:_AgreementStatusType = (function(_agreementStatus) {
                    const _discriminant = (function() {
                        switch(_agreementStatus.name) {
                            case "Proposal":
                                return 0;
                            case "InProgress":
                                return 1;
                            case "Completed":
                                return 2;
                            case "Aborted":
                                return 3;
                            default:
                                return -1;
                        }
                    })();

                    return {
                        discriminant: _discriminant,
                        name: _agreementStatus.name
                    }
                })(agreementStatusResult.valueOf());

                console.log(agreementStatusDeserialized);

                return agreementStatusDeserialized;
            }

            return null;
        } catch (e) {
            console.warn(e);
        }
    }, []);

    useEffect(() => {
        let mountedComponent = true;

        getAgreementStatusById(agreementId)
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