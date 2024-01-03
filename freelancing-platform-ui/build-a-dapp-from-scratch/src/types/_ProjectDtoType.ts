import {Address} from "@multiversx/sdk-core/out";
import {_ProjectStatusType} from "./_ProjectStatusType.ts";

export type _ProjectDtoType = {
    project_id: number,
    project_name: string,
    project_description: string,
    owner_address: Address
    project_status: _ProjectStatusType
}