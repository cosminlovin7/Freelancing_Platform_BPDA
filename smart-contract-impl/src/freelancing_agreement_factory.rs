multiversx_sc::imports!();
multiversx_sc::derive_imports!();

use crate::{freelancing_storage, freelancing_agreement::Agreement, freelancing_agreement::AgreementDto, 
    freelancing_agreement_status::AgreementStatus, freelancing_project_status::ProjectStatus, freelancing_user_role::UserRole};

#[multiversx_sc::module]
pub trait AgreementFactory: freelancing_storage::Storage {
    #[endpoint]
    fn create_agreement(&self, employer_addr: ManagedAddress, proj_id: u32, proposed_value: BigUint) {
        let project_not_exists = self.projects(&proj_id).is_empty();

        if project_not_exists == true {
            sc_panic!("Cannot create agreement. Project does not exist");
        }

        self.agreement_counter().update(|id| {
            let employee_addr = self.blockchain().get_caller();
            // let proposed_value = self.call_value().egld_value().clone_value();

            require!(
                self.has_project_agreement(&proj_id).get() == false,
                "Project already has an agreement in progress"
            );

            let employee_id = self.user_mapper().get_user_id(&employee_addr);
            let employer_id = self.user_mapper().get_user_id(&employer_addr);
            let user_has_no_role = self.user_role(employee_id).is_empty();
            if user_has_no_role == true {
                sc_panic!("Cannot create agreement. User has no role");
            }
            let user_role = self.user_role(employee_id).get();

            match user_role {
                UserRole::Visitor => {
                    sc_panic!("Cannot accept agreement. User role is visitor");
                },
                UserRole::Freelancer => {
                    self.agreements(id).set(Agreement {
                        agreement_id: *id,
                        employer_address: employer_addr.clone(),
                        employee_address: employee_addr.clone(),
                        value: proposed_value * BigUint::from(10u32).pow(18),
                        project_id: proj_id.clone(),
                        deadline: self.blockchain().get_block_timestamp() + 600,
                        employee_rated: false
                    });
        
                    self.employee_agreements(employee_id).push_back(*id);
                    self.employer_agreements(employer_id).push_back(*id);
        
                    self.agreement_status(id).set(AgreementStatus::Proposal);
        
                    self.project_agreements(&proj_id).push_back(*id);
                    // self.has_project_agreement(&proj_id).set(false);
                    *id += 1;
                },
                UserRole::Client => {
                    sc_panic!("Cannot create agreement. User role is client");
                }
            }
        });
    }

    #[payable("EGLD")]
    #[endpoint]
    fn accept_agreement(&self, agreement_id: u32) {
        let block_timestamp = self.blockchain().get_block_timestamp();
        let employer_addr = self.blockchain().get_caller();
        
        let employer_id = self.user_mapper().get_user_id(&employer_addr);
        let user_has_no_role = self.user_role(employer_id).is_empty();
        if user_has_no_role == true {
            sc_panic!("Cannot accept agreement. User has no role");
        }
        let user_role = self.user_role(employer_id).get();
        let accepted_value = self.call_value().egld_value().clone_value();

        match user_role {
            UserRole::Visitor => {
                sc_panic!("Cannot accept agreement. User role is visitor");
            },
            UserRole::Freelancer => {
                sc_panic!("Cannot accept agreement. User role is freelancer");
            },
            UserRole::Client => {
                let agreement_not_found = self.agreements(&agreement_id).is_empty();
                if agreement_not_found == true {
                    sc_panic!("Agreement not found");
                }
                let agreement = self.agreements(&agreement_id).get();

                require!(
                    block_timestamp <= agreement.deadline,
                    "Agreement expired"
                );


                require!(
                    accepted_value == agreement.value,
                    "Offered value doesn't match the agreed value"
                );

                self.agreement_status(&agreement_id).set(AgreementStatus::InProgress);
                self.has_project_agreement(&agreement.project_id).set(true);
                self.project_status(&agreement.project_id).set(ProjectStatus::InProgress);

                for project_agreement_node in self.project_agreements(&agreement.project_id).iter() {
                    let project_agreement = self.agreements(project_agreement_node.get_value_as_ref()).get();

                    if project_agreement.agreement_id != agreement_id {
                        self.agreement_status(&project_agreement.agreement_id).set(AgreementStatus::Declined);
                        // self.send().direct_egld(&project_agreement.employee_address, &project_agreement.value);
                    }
                }

                self.project_agreements(&agreement.project_id).clear();

                let mut pending_project_node: Option<LinkedListNode<u32>> = None;

                for ppn in self.pending_projects().iter() {
                    let project = self.projects(ppn.get_value_as_ref()).get();

                    if project.project_id == agreement.project_id {
                        pending_project_node = Some(ppn);
                        break;
                    }
                }

                if let Some(ppn2) = pending_project_node {
                    self.pending_projects().remove_node(&ppn2);
                }
            }
        }
    }

    #[endpoint]
    fn complete_agreement(&self, agreement_id: u32) {
        let agreement_status_not_found = self.agreement_status(&agreement_id).is_empty();
        if agreement_status_not_found == true {
            sc_panic!("Agreement status not found");
        }
        let agreement_status = self.agreement_status(&agreement_id).get();

        let agreement_not_found = self.agreements(&agreement_id).is_empty();
        if agreement_not_found == true {
            sc_panic!("Agreement not found");
        }
        let agreement = self.agreements(&agreement_id).get();

        let employee_addr = self.blockchain().get_caller();
        
        let employee_id = self.user_mapper().get_user_id(&employee_addr);
        let user_has_no_role = self.user_role(employee_id).is_empty();
        if user_has_no_role == true {
            sc_panic!("Cannot complete agreement. User has no role");
        }
        let user_role = self.user_role(employee_id).get();

        match user_role {
            UserRole::Visitor => {
                sc_panic!("Cannot accept agreement. User role is visitor");
            },
            UserRole::Freelancer => {
                match agreement_status {
                    AgreementStatus::None => {
                        sc_panic!("Cannot complete agreement. Agreement has no status");
                    },
                    AgreementStatus::Proposal => {
                        sc_panic!("Cannot complete agreement. Agreement was not accepted yet");
                    },
                    AgreementStatus::InProgress => {
                        self.agreement_status(&agreement_id).set(AgreementStatus::Completed);
                        self.project_status(&agreement.project_id).set(ProjectStatus::Completed);
                        
                        self.send().direct_egld(&agreement.employee_address, &agreement.value);
                    },
                    AgreementStatus::Declined => {
                        sc_panic!("Cannot complete agreement. Agreement was already declined");
                    }
                    AgreementStatus::Completed => {
                        sc_panic!("Agreement already completed");
                    },
                    AgreementStatus::Aborted => {
                        sc_panic!("Cannot complete agreement. Agreement was already aborted");
                    }
                }
            },
            UserRole::Client => {
                sc_panic!("Cannot complete agreement. User role is client");
            }
        }
    }

    #[endpoint]
    fn abort_employer_agreement(&self, agreement_id: u32) {
        let agreement_status_not_found = self.agreement_status(&agreement_id).is_empty();
        if agreement_status_not_found == true {
            sc_panic!("Agreement status not found");
        }
        let agreement_status = self.agreement_status(&agreement_id).get();

        let agreement_not_found = self.agreements(&agreement_id).is_empty();
        if agreement_not_found == true {
            sc_panic!("Agreement not found");
        }
        let agreement = self.agreements(&agreement_id).get();

        let employer_addr = self.blockchain().get_caller();
        
        let employer_id = self.user_mapper().get_user_id(&employer_addr);
        let user_has_no_role = self.user_role(employer_id).is_empty();
        if user_has_no_role == true {
            sc_panic!("Cannot abort agreement. User has no role");
        }
        let user_role = self.user_role(employer_id).get();

        match user_role {
            UserRole::Visitor => {
                sc_panic!("Cannot abort agreement. User role is visitor");
            },
            UserRole::Freelancer => {
                sc_panic!("Cannot abort agreement. User role is freelancer");
            },
            UserRole::Client => {
                match agreement_status {
                    AgreementStatus::None => {
                        sc_panic!("Cannot abort agreement. Agreement has no status.");
                    },
                    AgreementStatus::Proposal => {
                        sc_panic!("Cannot abort agreement. Agreement was not accepted yet");
                    },
                    AgreementStatus::InProgress => {
                        self.agreement_status(&agreement_id).set(AgreementStatus::Aborted);
                        self.pending_projects().push_back(agreement.project_id.clone());
                        self.project_status(&agreement.project_id).set(ProjectStatus::PendingAgreement);
                        self.has_project_agreement(&agreement.project_id).set(false);

                        self.send().direct_egld(&agreement.employer_address, &agreement.value);
                    },
                    AgreementStatus::Declined => {
                        sc_panic!("Cannot abort agreement. Agreement was already declined");
                    }
                    AgreementStatus::Completed => {
                        sc_panic!("Cannot abort agreement. Agreement already completed");
                    },
                    AgreementStatus::Aborted => {
                        sc_panic!("Cannot abort agreement. Agreement was already aborted");
                    }
                }
            }
        }
    }

    #[endpoint]
    fn abort_employee_agreement(&self, agreement_id: u32) {
        let agreement_status_not_found = self.agreement_status(&agreement_id).is_empty();
        if agreement_status_not_found == true {
            sc_panic!("Agreement status not found");
        }
        let agreement_status = self.agreement_status(&agreement_id).get();

        let agreement_not_found = self.agreements(&agreement_id).is_empty();
        if agreement_not_found == true {
            sc_panic!("Agreement not found");
        }
        let agreement = self.agreements(&agreement_id).get();

        let employee_addr = self.blockchain().get_caller();
        
        let employee_id = self.user_mapper().get_user_id(&employee_addr);
        let user_has_no_role = self.user_role(employee_id).is_empty();
        if user_has_no_role == true {
            sc_panic!("Cannot abort agreement. User has no role");
        }
        let user_role = self.user_role(employee_id).get();

        match user_role {
            UserRole::Visitor => {
                sc_panic!("Cannot abort agreement. User role is visitor");
            },
            UserRole::Freelancer => {
                match agreement_status {
                    AgreementStatus::None => {
                        sc_panic!("Cannot abort agreement. Agreement status is none");
                    },
                    AgreementStatus::Proposal => {
                        sc_panic!("Cannot abort agreement. Agreement was not accepted yet");
                    },
                    AgreementStatus::InProgress => {
                        self.agreement_status(&agreement_id).set(AgreementStatus::Aborted);
                        self.pending_projects().push_back(agreement.project_id.clone());
                        self.project_status(&agreement.project_id).set(ProjectStatus::PendingAgreement);
                        self.has_project_agreement(&agreement.project_id).set(false);

                        self.send().direct_egld(&agreement.employer_address, &agreement.value);
                    },
                    AgreementStatus::Declined => {
                        sc_panic!("Cannot abort agreement. Agreement was already declined");
                    }
                    AgreementStatus::Completed => {
                        sc_panic!("Cannot abort agreement. Agreement already completed");
                    },
                    AgreementStatus::Aborted => {
                        sc_panic!("Cannot abort agreement. Agreement was already aborted");
                    }
                }
            },
            UserRole::Client => {
                sc_panic!("Cannot accept agreement. User role is client");
            }
        }
    }

    #[view(getEmployeeAgreements)]
    fn get_employee_agreements(&self, employee_addr: ManagedAddress) -> MultiValueEncoded<AgreementDto<Self::Api>> {
        let mut result = MultiValueEncoded::new();

        let employee_id = self.user_mapper().get_user_id(&employee_addr);
        let user_has_no_role = self.user_role(employee_id).is_empty();
        if user_has_no_role == true {
            sc_panic!("Cannot fetch employee agreements. User has no role");
        }
        let user_role = self.user_role(employee_id).get();

        match user_role {
            UserRole::Visitor => {
                sc_panic!("Cannot fetch employee agreements. User role is visitor");
            },
            UserRole::Freelancer => {

                for employee_agreement_node in self.employee_agreements(employee_id).iter() {
                    let agreement = self.agreements(employee_agreement_node.get_value_as_ref()).get();
                    let agreement_status = self.agreement_status(&agreement.agreement_id).get();
                    
                    result.push(AgreementDto {
                        agreement_id: agreement.agreement_id,
                        employer_address: agreement.employer_address,
                        employee_address: agreement.employee_address,
                        value: agreement.value,
                        project_id: agreement.project_id,
                        deadline: agreement.deadline,
                        status: agreement_status,
                        employee_rated: agreement.employee_rated
                    });
                }

                return result;
            },
            UserRole::Client => {
                sc_panic!("Cannot fetch employee agreements. User role is client");
            }
        }
    }

    #[view(getEmployerAgreements)]
    fn get_employer_agreements(&self, employer_addr: ManagedAddress) -> MultiValueEncoded<AgreementDto<Self::Api>> {
        let mut result = MultiValueEncoded::new();

        let employer_id = self.user_mapper().get_user_id(&employer_addr);
        let user_has_no_role = self.user_role(employer_id).is_empty();
        if user_has_no_role == true {
            sc_panic!("Cannot fetch employer agreements. User has no role");
        }
        let user_role = self.user_role(employer_id).get();

        match user_role {
            UserRole::Visitor => {
                sc_panic!("Cannot fetch employer agreements. User role is visitor");
            },
            UserRole::Client => {

                for employer_agreement_node in self.employer_agreements(employer_id).iter() {
                    let agreement = self.agreements(employer_agreement_node.get_value_as_ref()).get();
                    let agreement_status = self.agreement_status(&agreement.agreement_id).get();

                    if agreement_status != AgreementStatus::Proposal && agreement_status != AgreementStatus::Declined {
                        result.push(AgreementDto {
                            agreement_id: agreement.agreement_id,
                            employer_address: agreement.employer_address,
                            employee_address: agreement.employee_address,
                            value: agreement.value,
                            project_id: agreement.project_id,
                            deadline: agreement.deadline,
                            status: agreement_status,
                            employee_rated: agreement.employee_rated
                        });
                    }
                }

                return result;
            },
            UserRole::Freelancer => {
                sc_panic!("Cannot fetch employer agreements. User role is freelancer");
            }
        }
    }

    #[endpoint]
    fn rate_employee(&self, agreement_id: u32, employee_addr: ManagedAddress, employee_rating: u32) {
        let employee_id = self.user_mapper().get_user_id(&employee_addr);
        let user_has_no_role = self.user_role(employee_id).is_empty();
        if user_has_no_role == true {
            sc_panic!("Cannot rate freelancer. User has no role");
        }
        let user_role = self.user_role(employee_id).get();

        match user_role {
            UserRole::Visitor => {
                sc_panic!("Cannot rate freelancer. User role is visitor");
            },
            UserRole::Client => {
                sc_panic!("Cannot rate freelancer. User role is client");
            },
            UserRole::Freelancer => {
                let agreement_not_exist = self.agreements(&agreement_id).is_empty();
                if agreement_not_exist == true {
                    sc_panic!("Agreement does not exist");
                }
                let agreement = self.agreements(&agreement_id).get();

                let agreement_status_not_exist = self.agreement_status(&agreement_id).is_empty();
                if agreement_status_not_exist == true {
                    sc_panic!("Agreement status does not exist");
                }
                let agreement_status = self.agreement_status(&agreement_id).get();

                match agreement_status {
                    AgreementStatus::None => {
                        sc_panic!("Cannot rate agreement. Agreement status: none");
                    }
                    AgreementStatus::Proposal => {
                        sc_panic!("Cannot rate agreement. Agreement status: proposal");
                    },
                    AgreementStatus::InProgress => {
                        sc_panic!("Cannot rate agreement. Agreement status: in progress");
                    },
                    AgreementStatus::Declined => {
                        sc_panic!("Cannot rate agreement. Agreement status: declined");
                    },
                    AgreementStatus::Completed => {
                        
                        if agreement.employee_rated == false{
                            self.user_rating(employee_id).update(|rating| {
                                *rating += employee_rating;
                            });

                            self.counter_user_rating(employee_id).update(|counter| {
                                *counter += 1;
                            });

                            self.agreements(&agreement_id).update(|a| {
                                a.employee_rated = true;
                            });
                        } else {
                            sc_panic!("Employee already rated");
                        }
                    },
                    AgreementStatus::Aborted => {
                        sc_panic!("Cannot rate agreement. Agreement status: aborted");
                    }
                }
            }
        }
    }
}