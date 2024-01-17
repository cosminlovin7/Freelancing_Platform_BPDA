multiversx_sc::derive_imports!();

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi, Clone)]
pub enum UserRole {
    Visitor,
    Freelancer,
    Client
}