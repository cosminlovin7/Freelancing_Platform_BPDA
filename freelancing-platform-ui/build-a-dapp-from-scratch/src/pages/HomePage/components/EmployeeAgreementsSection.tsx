import {useEffect, useState} from "react";
import {_useGetEmployeeAgreements} from "../../../hooks/queries/_useGetEmployeeAgreements.ts";

export const EmployeeAgreementsSection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const employeeAgreementsList = _useGetEmployeeAgreements();

    useEffect(() => {
        if (null != employeeAgreementsList) {
            setIsLoading(false);
        }
    }, [employeeAgreementsList])

    return (
        <>

            {
                ! isLoading ?
                    (
                        <div>
                            {
                                null != employeeAgreementsList ? (
                                    <>
                                        <div>Agreements: #todo</div>
                                        <ul>
                                            {employeeAgreementsList.map((item, index) => (
                                                <li key={index}>{item.agreement_id} [PROJECT ID]:{item.project_id} [STATUS]:{item.status.name}({item.status.discriminant})</li>
                                            ))}
                                        </ul>
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