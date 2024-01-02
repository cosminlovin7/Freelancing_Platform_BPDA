import {Address} from "@multiversx/sdk-core/out";
import {_AgreementStatusType} from "./_AgreementStatusType.ts";

export type _AgreementDtoType = {
    agreement_id: number,
    employer_address: Address,
    employee_address: Address,
    value: number,
    project_id: number,
    deadline: number,
    status: _AgreementStatusType
}