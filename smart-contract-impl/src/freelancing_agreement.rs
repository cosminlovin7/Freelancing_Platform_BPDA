multiversx_sc::imports!();
multiversx_sc::derive_imports!();

use crate::freelancing_agreement_status::AgreementStatus;

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi, Clone)]
pub struct Agreement<M: ManagedTypeApi> {
    pub agreement_id: u32,
    pub employer_address: ManagedAddress<M>,
    pub employee_address: ManagedAddress<M>,
    pub value: BigUint<M>,
    pub project_id: u32,
    pub deadline: u64,
    pub employee_rated: bool
}

impl<M> Agreement<M>
where
    M: ManagedTypeApi,
{
    pub fn set_employee_rated(&mut self) {
        self.employee_rated = true;
    }
}

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi, Clone)]
pub struct AgreementDto<M: ManagedTypeApi> {
    pub agreement_id: u32,
    pub employer_address: ManagedAddress<M>,
    pub employee_address: ManagedAddress<M>,
    pub value: BigUint<M>,
    pub project_id: u32,
    pub deadline: u64,
    pub status: AgreementStatus,
    pub employee_rated: bool
}