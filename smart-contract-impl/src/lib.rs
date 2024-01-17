#![no_std]

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

mod freelancing_agreement;
mod freelancing_agreement_factory;
mod freelancing_agreement_status;
mod freelancing_storage;
mod freelancing_user_role;
mod freelancing_user_factory;
mod freelancing_project;
mod freelancing_project_factory;
mod freelancing_project_status;

#[multiversx_sc::contract]
pub trait FreelancingSmartContract:
    freelancing_storage::Storage
    + freelancing_agreement_factory::AgreementFactory
    + freelancing_user_factory::UserFactory
    + freelancing_project_factory::ProjectFactory
{
    #[init]
    fn init(&self) {
        self.agreement_counter().set(0u32);
        self.project_counter().set(0u32);
        self.account_creation_fee().set(BigUint::from(25000000000000000u64));
        self.project_creation_fee().set(BigUint::from(25000000000000000u64));
    }
}
