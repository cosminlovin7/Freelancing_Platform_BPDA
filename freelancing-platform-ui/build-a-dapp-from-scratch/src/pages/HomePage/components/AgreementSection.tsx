import {useEffect, useState} from "react";
import {_useGetAgreementById} from "../../../hooks/queries/_useGetAgreementById.ts";

export const AgreementSection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const agreement = _useGetAgreementById(0x01);

    useEffect(() => {
        if (null != agreement) {
            setIsLoading(false);
        }
    }, [agreement])

    return (
        <>

            {
                ! isLoading ?
                (
                    <div>
                        {
                            null != agreement ? (
                                <>
                                    <div>Agreement ID: {agreement.agreement_id}</div>
                                    <div>Employer Address: {agreement.employer_address.bech32()}</div>
                                    <div>Employee Address: {agreement.employee_address.bech32()}</div>
                                    <div>Project ID: {agreement.project_id}</div>
                                    <div>Deadline: {new Date(agreement.deadline * 1000).toString()}</div>
                                    <div>Value: {agreement.value}</div>
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