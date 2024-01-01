import {useEffect, useState} from "react";
import {_useGetEmployeeAgreements} from "../../../hooks/queries/_useGetEmployeeAgreements.ts";

export const EmployeeAgreementsSection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const agreements = _useGetEmployeeAgreements();

    useEffect(() => {
        console.log('this is called ');
        if (null != agreements) {
            setIsLoading(false);
        }
    }, [agreements])

    return (
        <>

            {
                ! isLoading ?
                    (
                        <div>
                            {
                                null != agreements ? (
                                    <>
                                        <div>Agreements: #todo</div>
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