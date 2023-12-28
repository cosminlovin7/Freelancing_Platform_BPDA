import {_SmartContract} from "utils/_SmartContract";
import {useCallback, useEffect, useState} from "react";
import {API_URL} from "config";
import {ProxyNetworkProvider} from "@multiversx/sdk-network-providers";
import {ResultsParser} from "@multiversx/sdk-core";
import {BigUIntValue} from "@multiversx/sdk-core/out";

export const _useGetSumQuery = () => {
    // const {account} = useGetAccountInfo();
    const [queryResult, setQueryResult] = useState<BigUIntValue | undefined>(undefined);

    const getSumQuery = useCallback(async () => {
        try {
            const networkProvider = new ProxyNetworkProvider(API_URL);
            const interaction = _SmartContract.methods.getSum();
            const query = interaction.buildQuery();

            const response = await networkProvider.queryContract(query);

            const {firstValue: sumResult} = new ResultsParser().parseQueryResponse(response, interaction.getEndpoint());

            const sumValue: BigUIntValue = sumResult?.valueOf();
            return sumValue;
        } catch (e) {
            console.warn(e);
        }
    }, []);

    useEffect(() => {
        let mountedComponent = true;

        getSumQuery()
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