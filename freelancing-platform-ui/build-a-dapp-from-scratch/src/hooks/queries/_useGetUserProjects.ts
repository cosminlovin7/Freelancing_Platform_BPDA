import {useCallback, useEffect, useState} from "react";
import {ProxyNetworkProvider} from "@multiversx/sdk-network-providers/out";
import {API_URL} from "../../config";
import {_SmartContract} from "../../utils/_SmartContract.ts";
import {ResultsParser} from "@multiversx/sdk-core/out";
import {useGetAccountInfo} from "@multiversx/sdk-dapp/hooks";
import {_ProjectDtoType} from "../../types/_ProjectDtoType.ts";
import {_ResponseProjectDtoType} from "../../types/_ResponseProjectDtoType.ts";

export const _useGetUserProjects = () => {
    const {account} = useGetAccountInfo();
    const [queryResult, setQueryResult] = useState<_ProjectDtoType[] | null | undefined>(null);

    const getUserProjects = useCallback(async () => {
        try {
            const networkProvider = new ProxyNetworkProvider(API_URL);
            const interaction = _SmartContract.methods.getUserProjects([account.address]);
            const query = interaction.buildQuery();

            const response = await networkProvider.queryContract(query);

            const {firstValue: userProjectsList} = new ResultsParser().parseQueryResponse(response, interaction.getEndpoint());

            if (userProjectsList) {
                const userProjectsListDeserialized: _ProjectDtoType[] = (function(_userProjectsList: _ResponseProjectDtoType[]) {
                    const _userProjectsListDeserialized: _ProjectDtoType[] = [];

                    console.log(_userProjectsList);

                    _userProjectsList.map((userProject: _ResponseProjectDtoType) => {
                        const _discriminant = (function() {
                            switch(userProject.project_status.name) {
                                case "PendingAgreement":
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

                        _userProjectsListDeserialized.push({
                            project_id: userProject.project_id.valueOf(),
                            project_name: (function(hexString: string) {
                                const hexArray = hexString.match(/.{1,2}/g) || [];
                                const byteValues = hexArray.map(hex => parseInt(hex, 16));
                                return String.fromCharCode(...byteValues);
                            })(userProject.project_name.toString()),
                            project_description: (function(hexString: string) {
                                const hexArray = hexString.match(/.{1,2}/g) || [];
                                const byteValues = hexArray.map(hex => parseInt(hex, 16));
                                return String.fromCharCode(...byteValues);
                            })(userProject.project_description.toString()),
                            owner_address: userProject.owner_address,
                            project_status: {
                                discriminant: _discriminant,
                                name: userProject.project_status.name
                            }
                        })
                    });

                    return _userProjectsListDeserialized;
                })(userProjectsList.valueOf());

                console.log(userProjectsListDeserialized);

                return userProjectsListDeserialized;
            }

            return null;
        } catch (e) {
            console.warn(e);
        }
    }, []);

    useEffect(() => {
        let mountedComponent = true;

        getUserProjects()
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