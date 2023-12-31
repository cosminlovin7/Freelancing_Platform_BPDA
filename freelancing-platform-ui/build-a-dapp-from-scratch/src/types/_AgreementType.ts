import {Address} from "@multiversx/sdk-core/out";

export type _AgreementType = {
    agreement_id: number,
    employer_address: Address,
    employee_address: Address,
    value: number,
    project_id: number,
    deadline: number
}