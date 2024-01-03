import {Address} from "@multiversx/sdk-core/out";
import {_ResponseProjectStatusType} from "./_ResponseProjectStatusType.ts";

export type _ResponseProjectDtoType = {
    project_id: number,
    project_name: Uint8Array,
    project_description: Uint8Array,
    owner_address: Address
    project_status: _ResponseProjectStatusType
}