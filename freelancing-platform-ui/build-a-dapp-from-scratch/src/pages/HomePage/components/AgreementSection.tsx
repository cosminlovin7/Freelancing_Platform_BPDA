import {useEffect, useState} from "react";
import {_useGetAgreementById} from "../../../hooks/queries/_useGetAgreementById.ts";

export const AgreementSection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const sum = _useGetAgreementById(0x01);

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
                                    <div>Agreement ID: {sum.agreement_id}</div>
                                    <div>Employer Address: {sum.employer_address.bech32()}</div>
                                    <div>Employee Address: {sum.employee_address.bech32()}</div>
                                    <div>Project ID: {sum.project_id}</div>
                                    <div>Deadline: {new Date(sum.deadline * 1000).toString()}</div>
                                    <div>Value: {sum.value}</div>
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