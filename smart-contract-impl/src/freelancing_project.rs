multiversx_sc::imports!();
multiversx_sc::derive_imports!();

use crate::freelancing_project_status::ProjectStatus;

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi, Clone)]
pub struct Project<M: ManagedTypeApi> {
    pub project_id: u32,
    pub project_name: ManagedBuffer<M>,
    pub project_description: ManagedBuffer<M>,
    pub owner_address: ManagedAddress<M>,
}

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi, Clone)]
pub struct ProjectDto<M: ManagedTypeApi> {
    pub project_id: u32,
    pub project_name: ManagedBuffer<M>,
    pub project_description: ManagedBuffer<M>,
    pub owner_address: ManagedAddress<M>,
    pub project_status: ProjectStatus
}