multiversx_sc::derive_imports!();

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi, Clone)]
pub enum ProjectStatus {
    None,
    PendingAgreement,
    InProgress,
    Completed,
    Aborted
}