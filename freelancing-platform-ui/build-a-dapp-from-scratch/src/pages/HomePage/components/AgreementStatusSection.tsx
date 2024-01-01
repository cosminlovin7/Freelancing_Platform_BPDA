import {useEffect, useState} from "react";
import {_useGetAgreementStatusById} from "../../../hooks/queries/_useGetAgreementStatusById.ts";

export const AgreementStatusSection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const agreementStatusById = _useGetAgreementStatusById(0x00);

    useEffect(() => {
        if (null != agreementStatusById) {
            setIsLoading(false);
        }
    }, [agreementStatusById])

    return (
        <>

            {
                ! isLoading ?
                    (
                        <div>
                            {
                                null != agreementStatusById ? (
                                    <>
                                        <div>Agreement Status: {agreementStatusById.name}({agreementStatusById.discriminant})</div>
                                    </>
                                ) : (
                                    <>
                                        <div>Couldn't fetch info about raised agreement status.</div>
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