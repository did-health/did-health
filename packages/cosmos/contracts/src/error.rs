use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("DID already exists")]
    DidAlreadyExists {},

    #[error("Incorrect Chain Id in DID")]
    IncorrectChainId {},

    #[error("This address isn't a delegate address")]
    NotDelegateAddress {},

    #[error("Cannot transfer ownership to existing owner")]
    CannotTransferToSelf {},

    #[error("Input string too short")]
    InputTooShort {},

    #[error("Not a valid number")]
    InvalidNumber {},

    // Add any other custom errors you like here.
    // Look at https://docs.rs/thiserror/1.0.21/thiserror/ for details.
}