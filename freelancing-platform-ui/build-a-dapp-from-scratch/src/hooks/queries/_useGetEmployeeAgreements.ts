import {useCallback, useEffect, useState} from "react";
import {ProxyNetworkProvider} from "@multiversx/sdk-network-providers/out";
import {API_URL} from "../../config";
import {_SmartContract} from "../../utils/_SmartContract.ts";
import {ResultsParser} from "@multiversx/sdk-core/out";
import {useGetAccountInfo} from "@multiversx/sdk-dapp/hooks";
import {_AgreementDtoType} from "../../types/_AgreementDtoType.ts";
import {_ResponseAgreementDtoType} from "../../types/_ResponseAgreementDtoType.ts";

export const _useGetEmployeeAgreements = () => {
    const {account} = useGetAccountInfo();
    const [queryResult, setQueryResult] = useState<_AgreementDtoType[] | null | undefined>(null);

    const getEmployeeAgreements = useCallback(async () => {
        try {
            const networkProvider = new ProxyNetworkProvider(API_URL);
            const interaction = _SmartContract.methods.getEmployeeAgreements([account.address]);
            const query = interaction.buildQuery();

            const response = await networkProvider.queryContract(query);

            const {firstValue: employeeAgreementsList} = new ResultsParser().parseQueryResponse(response, interaction.getEndpoint());

            if (employeeAgreementsList) {
                const employeeAgreementsListDeserialized: _AgreementDtoType[] = (function(_employeeAgreementsList: _ResponseAgreementDtoType[]) {
                    const _employeeAgreementsListDeserialized: _AgreementDtoType[] = [];

                    _employeeAgreementsList.map((employeeAgreement: _ResponseAgreementDtoType) => {
                        const _discriminant = (function() {
                            switch(employeeAgreement.status.name) {
                                case "Proposal":
                                    return 0;
                                case "InProgress":
                                    return 1;
                                case "Declined":
                                    return 2;
                                case "Completed":
                                    return 3;
                                case "Aborted":
                                    return 4;
                                default:
                                    return -1;
                            }
                        })();

                        _employeeAgreementsListDeserialized.push({
                            agreement_id: employeeAgreement.agreement_id.valueOf(),
                            deadline: employeeAgreement.deadline.valueOf(),
                            employee_address: employeeAgreement.employee_address,
                            employer_address: employeeAgreement.employer_address,
                            project_id: employeeAgreement.project_id.valueOf(),
                            value: employeeAgreement.value.valueOf(),
                            status: {
                                discriminant: _discriminant,
                                name: employeeAgreement.status.name
                            }
                        })
                    });

                    return _employeeAgreementsListDeserialized;
                })(employeeAgreementsList.valueOf());

                console.log(employeeAgreementsListDeserialized);

                return employeeAgreementsListDeserialized;
            }

            return null;
        } catch (e) {
            console.warn(e);
        }
    }, []);

    useEffect(() => {
        let mountedComponent = true;

        getEmployeeAgreements()
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