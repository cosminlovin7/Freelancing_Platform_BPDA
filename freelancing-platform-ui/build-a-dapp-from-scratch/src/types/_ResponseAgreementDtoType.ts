import {Address} from "@multiversx/sdk-core/out";
import {_ResponseAgreementStatusType} from "./_ResponseAgreementStatusType.ts";

export type _ResponseAgreementDtoType = {
    agreement_id: number,
    employer_address: Address,
    employee_address: Address,
    value: number,
    project_id: number,
    deadline: number,
    status: _ResponseAgreementStatusType
}