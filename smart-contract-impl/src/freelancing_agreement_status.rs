multiversx_sc::derive_imports!();

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi, Clone, PartialEq)]
pub enum AgreementStatus {
    None,
    Proposal,
    InProgress,
    Declined,
    Completed,
    Aborted
}