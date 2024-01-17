multiversx_sc::imports!();
multiversx_sc::derive_imports!();

use crate::freelancing_agreement::Agreement;
use crate::freelancing_agreement_status::AgreementStatus;
use crate::freelancing_user_role::UserRole;
use crate::freelancing_project::Project;
use crate::freelancing_project_status::ProjectStatus;

#[multiversx_sc::module]
pub trait Storage {
    #[view]
    #[storage_mapper("employee_agreements")]
    fn employee_agreements(&self, employee_addr: usize) -> LinkedListMapper<u32>;

    #[view]
    #[storage_mapper("employer_agreements")]
    fn employer_agreements(&self, employer_addr: usize) -> LinkedListMapper<u32>;

    #[view(getAgreementCounter)]
    #[storage_mapper("agreement_counter")]
    fn agreement_counter(&self) -> SingleValueMapper<u32>;

    #[view(getAgreementById)]
    #[storage_mapper("agreements")]
    fn agreements(&self, agreement_id: &u32) -> SingleValueMapper<Agreement<Self::Api>>;

    #[view(getAgreementStatusById)]
    #[storage_mapper("agreement_status")]
    fn agreement_status(&self, agreement_id: &u32) -> SingleValueMapper<AgreementStatus>;

    #[view(getProjectHasAgreementInProgress)]
    #[storage_mapper("has_project_agreement")]
    fn has_project_agreement(&self, project_id: &u32) -> SingleValueMapper<bool>;

    #[storage_mapper("project_agreements")]
    fn project_agreements(&self, project_id: &u32) -> LinkedListMapper<u32>;

    #[storage_mapper("user_role")]
    fn user_role(&self, user_id: usize) -> SingleValueMapper<UserRole>;

    #[view(getAccountCreationFee)]
    #[storage_mapper("account_creation_fee")]
    fn account_creation_fee(&self) -> SingleValueMapper<BigUint>;

    #[view(getProjectCreationFee)]
    #[storage_mapper("project_creation_fee")]
    fn project_creation_fee(&self) -> SingleValueMapper<BigUint>;

    #[view(getProjectCounter)]
    #[storage_mapper("project_counter")]
    fn project_counter(&self) -> SingleValueMapper<u32>;

    #[storage_mapper("projects")]
    fn projects(&self, project_id: &u32) -> SingleValueMapper<Project<Self::Api>>;

    #[view(getProjectStatus)]
    #[storage_mapper("project_status")]
    fn project_status(&self, project_id: &u32) -> SingleValueMapper<ProjectStatus>;

    #[storage_mapper("user_projects")]
    fn user_projects(&self, user_id: usize) -> LinkedListMapper<u32>;

    #[storage_mapper("user")]
    fn user_mapper(&self) -> UserMapper;

    #[storage_mapper("pending_projects")]
    fn pending_projects(&self) -> LinkedListMapper<u32>;

    #[storage_mapper("user_rating")]
    fn user_rating(&self, user_id: usize) -> SingleValueMapper<u32>;

    #[storage_mapper("counter_user_rating")]
    fn counter_user_rating(&self, user_id: usize) -> SingleValueMapper<u32>;
}