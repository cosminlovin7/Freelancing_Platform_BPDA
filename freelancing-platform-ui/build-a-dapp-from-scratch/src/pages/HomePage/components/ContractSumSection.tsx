import {_useGetSumQuery} from "../../../hooks/queries/_useGetSumQuery.ts";
import {useEffect, useState} from "react";

export const ContractSumSection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const sum = _useGetSumQuery();

    useEffect(() => {
        console.log('this is called ');
        if (null != sum) {
            setIsLoading(false);
        }
    }, [sum])

    return (
        <>

            {
                ! isLoading ?
                (
                    <div>
                        {
                            null != sum ? (
                                <>
                                    <div>Contract raised sum: {sum.toString()}</div>
                                </>
                            ) : (
                                <>
                                    <div>Couldn't fetch info about raised sum.</div>
                                </>
                            )
                        }
                    </div>
                ) :
                (
                    <div>
                        Loading...
                    </div>
                )
            }

        </>
    )
}