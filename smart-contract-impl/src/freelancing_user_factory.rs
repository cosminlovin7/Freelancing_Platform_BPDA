multiversx_sc::imports!();
multiversx_sc::derive_imports!();

use crate::{freelancing_storage, freelancing_user_role::UserRole};

#[multiversx_sc::module]
pub trait UserFactory: freelancing_storage::Storage {
    #[payable("EGLD")]
    #[endpoint]
    fn create_freelancer_account(&self) {
        let user_address = self.blockchain().get_caller();
        let user_id = self.user_mapper().get_or_create_user(&user_address);
        let user_has_no_role = self.user_role(user_id).is_empty();
        let account_creation_tax = self.call_value().egld_value().clone_value();

        if user_has_no_role == true {
            require!(
                account_creation_tax == self.account_creation_fee().get(),
                "The account creation tax was not matched"
            );
            
            self.user_role(user_id).set(UserRole::Freelancer);
            self.user_rating(user_id).set(0u32);
            self.counter_user_rating(user_id).set(0u32);
        } else {
            sc_panic!("The user already has a role assigned");
        }
    }

    #[payable("EGLD")]
    #[endpoint]
    fn create_client_account(&self) {
        let user_address = self.blockchain().get_caller();
        let user_id = self.user_mapper().get_or_create_user(&user_address);
        let user_has_no_role = self.user_role(user_id).is_empty();
        let account_creation_tax = self.call_value().egld_value().clone_value();

        if user_has_no_role == true {
            require!(
                account_creation_tax == self.account_creation_fee().get(),
                "The account creation tax was not matched"
            );

            self.user_role(user_id).set(UserRole::Client);
        } else {
            sc_panic!("The user already has a role assigned");
        }
    }

    #[view(getUserRole)]
    fn get_user_role(&self, user_address: ManagedAddress) -> UserRole {
        let user_id = self.user_mapper().get_user_id(&user_address);
        let user_has_no_role = self.user_role(user_id).is_empty();

        if user_has_no_role == true {
            sc_panic!("The user has no role assigned");
        }
        let user_role = self.user_role(user_id).get();
        
        return user_role;
    }

    #[view(getUserRating)]
    fn get_user_rating(&self, user_address: ManagedAddress) -> u32 {
        let user_id = self.user_mapper().get_user_id(&user_address);
        let user_has_no_role = self.user_role(user_id).is_empty();

        if user_has_no_role == true {
            sc_panic!("The user has no role assigned");
        }
        let user_role = self.user_role(user_id).get();
        
        match user_role {
            UserRole::Visitor => {
                sc_panic!("Cannot fetch user rating for visitor");
            }, 
            UserRole::Client => {
                sc_panic!("Cannot fetch user rating for client");
            },
            UserRole::Freelancer => {
                let user_has_no_rating = self.user_rating(user_id).is_empty();

                if user_has_no_rating == true {
                    sc_panic!("The freelancer has no rating assigned");
                }
                let user_rating = self.user_rating(user_id).get();

                return user_rating;
            }
        }
    }

    #[view(getUserRatingCounter)]
    fn get_user_rating_counter(&self, user_address: ManagedAddress) -> u32 {
        let user_id = self.user_mapper().get_user_id(&user_address);
        let user_has_no_role = self.user_role(user_id).is_empty();

        if user_has_no_role == true {
            sc_panic!("The user has no role assigned");
        }
        let user_role = self.user_role(user_id).get();
        
        match user_role {
            UserRole::Visitor => {
                sc_panic!("Cannot fetch user rating for visitor");
            }, 
            UserRole::Client => {
                sc_panic!("Cannot fetch user rating for client");
            },
            UserRole::Freelancer => {
                let user_has_no_rating = self.user_rating(user_id).is_empty();

                if user_has_no_rating == true {
                    sc_panic!("The freelancer has no rating assigned");
                }
                let counter_user_rating = self.counter_user_rating(user_id).get();

                return counter_user_rating;
            }
        }
    }
}