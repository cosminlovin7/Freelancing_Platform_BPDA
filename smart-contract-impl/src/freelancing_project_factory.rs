multiversx_sc::imports!();
multiversx_sc::derive_imports!();

use crate::{freelancing_storage, freelancing_project::Project, freelancing_project::ProjectDto, freelancing_agreement::AgreementDto,
     freelancing_user_role::UserRole, freelancing_project_status::ProjectStatus};

#[multiversx_sc::module]
pub trait ProjectFactory: freelancing_storage::Storage {
    #[payable("EGLD")]
    #[endpoint]
    fn create_project(&self, proj_name: ManagedBuffer, proj_description: ManagedBuffer) {
        self.project_counter().update(|id| {
            let user_address = self.blockchain().get_caller();
            
            let user_id = self.user_mapper().get_user_id(&user_address);
            let user_has_no_role = self.user_role(user_id).is_empty();
            if user_has_no_role == true {
                sc_panic!("Cannot create project. User has no role assigned");
            }
            let user_role = self.user_role(user_id).get();

            match user_role {
                UserRole::Visitor => {
                    sc_panic!("Cannot create project. User role is visitor");
                },
                UserRole::Freelancer => {
                    sc_panic!("Cannot create projects as freelancer");
                },
                UserRole::Client => {
                    let project_creation_tax = self.call_value().egld_value().clone_value();
                    require!(
                        project_creation_tax == self.project_creation_fee().get(),
                        "The project creation tax was not matched"
                    );

                    self.projects(id).set(Project {
                        project_id: *id,
                        project_name: proj_name,
                        project_description: proj_description,
                        owner_address: user_address.clone()
                    });

                    self.user_projects(user_id).push_back(*id);

                    self.project_status(id).set(ProjectStatus::PendingAgreement);

                    self.pending_projects().push_back(*id);
                    *id += 1;
                }
            }
        });
    }

    #[view(getUserProjects)]
    fn get_user_projects(&self, user_addr: ManagedAddress) -> MultiValueEncoded<ProjectDto<Self::Api>> {
        let mut result = MultiValueEncoded::new();

        let user_id = self.user_mapper().get_user_id(&user_addr);
        let user_has_no_role = self.user_role(user_id).is_empty();
        if user_has_no_role == true {
            sc_panic!("Cannot get user projects. User has no role");
        }
        let user_role = self.user_role(user_id).get();

        match user_role {
            UserRole::Visitor => {
                sc_panic!("Cannot get user projects. User role is visitor");
            },
            UserRole::Client => {

                for user_project_node in self.user_projects(user_id).iter() {
                    let project = self.projects(user_project_node.get_value_as_ref()).get();
                    let project_status = self.project_status(&project.project_id).get();

                    result.push(ProjectDto {
                        project_id: project.project_id,
                        project_name: project.project_name,
                        project_description: project.project_description,
                        owner_address: project.owner_address,
                        project_status: project_status
                    });
                }

                return result;
            },
            UserRole::Freelancer => {
                sc_panic!("Cannot get user projects.  User role is freelancer");
            }
        }
    }

    #[view(getProjectAgreements)]
    fn get_project_agreements(&self, project_id: u32, user_address: ManagedAddress) -> MultiValueEncoded<AgreementDto<Self::Api>> {
        let mut result = MultiValueEncoded::new();
        let block_timestamp = self.blockchain().get_block_timestamp();

        let user_id = self.user_mapper().get_user_id(&user_address);
        let user_has_no_role = self.user_role(user_id).is_empty();
        if user_has_no_role == true {
            sc_panic!("Cannot get project agreements. User has no role");
        }
        let user_role = self.user_role(user_id).get();

        match user_role {
            UserRole::Visitor => {
                sc_panic!("Cannot get project agreements. User role is visitor");
            },
            UserRole::Freelancer => {
                sc_panic!("Cannot get project agreements. User role is freelancer");
            },  
            UserRole::Client => {

                for project_agreement_node in self.project_agreements(&project_id).iter() {
                    let project_agreement = self.agreements(project_agreement_node.get_value_as_ref()).get();
                    let project_agreement_status = self.agreement_status(&project_agreement.agreement_id).get();
                    
                    if block_timestamp < project_agreement.deadline {
                        result.push(AgreementDto {
                            agreement_id: project_agreement.agreement_id,
                            employer_address: project_agreement.employer_address,
                            employee_address: project_agreement.employee_address,
                            value: project_agreement.value,
                            project_id: project_agreement.project_id,
                            deadline: project_agreement.deadline,
                            status: project_agreement_status,
                            employee_rated: project_agreement.employee_rated
                        });
                    }
                }

                return result;
            }
        }
    }

    #[endpoint]
    fn delete_project(&self, project_id: u32) {
        let mut pending_project_node: Option<LinkedListNode<u32>> = None;

        for ppn in self.pending_projects().iter() {
            let project = self.projects(ppn.get_value_as_ref()).get();

            if project.project_id == project_id {
                pending_project_node = Some(ppn);
                break;
            }
        }

        if let Some(ppn2) = pending_project_node {
            self.pending_projects().remove_node(&ppn2);
        }
    }

    #[view(getPendingProjects)]
    fn get_pending_projects(&self, user_address: ManagedAddress) -> MultiValueEncoded<ProjectDto<Self::Api>> {
        let mut result = MultiValueEncoded::new();

        let user_id = self.user_mapper().get_user_id(&user_address);
        let user_has_no_role = self.user_role(user_id).is_empty();
        if user_has_no_role == true {
            sc_panic!("Cannot get project agreements. User has no role");
        }
        let user_role = self.user_role(user_id).get();
        
        match user_role {
            UserRole::Visitor => {
                sc_panic!("Cannot get project agreements. User role is visitor");
            },
            UserRole::Client => {
                sc_panic!("Cannot get project agreements. User role is client");
            },  
            UserRole::Freelancer => {
                for ppn in self.pending_projects().iter() {
                    let project = self.projects(ppn.get_value_as_ref()).get();
                    let project_status = self.project_status(&project.project_id).get();

                    result.push(ProjectDto {
                        project_id: project.project_id,
                        project_name: project.project_name,
                        project_description: project.project_description,
                        owner_address: project.owner_address,
                        project_status: project_status
                    });
                }

                return result;
            }
        }
    }
}