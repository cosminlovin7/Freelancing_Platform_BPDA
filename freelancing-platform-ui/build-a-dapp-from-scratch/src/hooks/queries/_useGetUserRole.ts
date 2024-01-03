import {_SmartContract} from "utils/_SmartContract";
import {useCallback, useEffect, useState} from "react";
import {API_URL} from "config";
import {ProxyNetworkProvider} from "@multiversx/sdk-network-providers";
import {ResultsParser} from "@multiversx/sdk-core";
import {useGetAccountInfo} from "@multiversx/sdk-dapp/hooks";
import {_ResponseUserRoleType} from "../../types/_ResponseUserRoleType.ts";
import {_UserRoleType} from "../../types/_UserRoleType.ts";

export const _useGetUserRole = () => {
    const {account} = useGetAccountInfo();
    const [queryResult, setQueryResult] = useState<_UserRoleType | null | undefined>(null);

    const getUserRole = useCallback(async () => {
        try {
            const networkProvider = new ProxyNetworkProvider(API_URL);
            const interaction = _SmartContract.methods.getUserRole([account.address]);
            const query = interaction.buildQuery();

            const response = await networkProvider.queryContract(query);

            const {firstValue: userRoleResult} = new ResultsParser().parseQueryResponse(response, interaction.getEndpoint());

            if (userRoleResult) {
                const userRoleStatusDeserialized: _UserRoleType = (function(_userRole: _ResponseUserRoleType) {
                    const _discriminant = (function() {
                        switch(_userRole.name) {
                            case "Visitor":
                                return 0;
                            case "Freelancer":
                                return 1;
                            case "Client":
                                return 2;
                            default:
                                return -1;
                        }
                    })();

                    return {
                        discriminant: _discriminant,
                        name: _userRole.name
                    }
                })(userRoleResult.valueOf());

                return userRoleStatusDeserialized;
            }
            return null;
        } catch (e) {
            console.warn(e);
        }
    }, []);

    useEffect(() => {
        let mountedComponent = true;

        getUserRole()
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