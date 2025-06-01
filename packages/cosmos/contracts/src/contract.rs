use cosmwasm_std::{entry_point, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, StdError, Addr};
use cosmwasm_std::to_binary;
use cw_storage_plus::{Map};
use crate::msg::{HealthDID, ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::error::ContractError;

const DID_OWNER_ADDRESS_REGISTRY: Map<&str, Addr> = Map::new("did_owner_address_registry");
const ADDRESS_DID_MAPPING: Map<&Addr, HealthDID> = Map::new("address_did_mapping");
const DELEGATE_ADDRESSES: Map<(&Addr, &str), bool> = Map::new("delegate_addresses");

#[entry_point]
pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, StdError> {
    Ok(Response::new().add_attribute("method", "instantiate"))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::RegisterDID { health_did, uri } => try_register_did(deps, env, info, health_did, uri),
        ExecuteMsg::UpdateDIDData { health_did, uri } => try_update_did_data(deps, env, info, health_did, uri),
        ExecuteMsg::AddAltData { health_did, uris } => try_add_alt_data(deps, env, info, health_did, uris),
        ExecuteMsg::AddDelegateAddress { peer_address, health_did } => try_add_delegate_address(deps, env, info, peer_address, health_did),
        ExecuteMsg::RemoveDelegateAddress { peer_address, health_did } => try_remove_delegate_address(deps, env, info, peer_address, health_did),
        ExecuteMsg::TransferOwnership { new_address, health_did } => try_transfer_ownership(deps, env, info, new_address, health_did),
    }
}

fn try_register_did(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    health_did: String,
    uri: String,
) -> Result<Response, ContractError> {
    if DID_OWNER_ADDRESS_REGISTRY.has(deps.storage, &health_did) {
        return Err(ContractError::DidAlreadyExists {});
    }

    // let chain_id = resolve_chain_id(&health_did)?;
    // if chain_id != get_chain_id() {
    //     return Err(ContractError::IncorrectChainId {});
    // }

    DID_OWNER_ADDRESS_REGISTRY.save(deps.storage, &health_did, &info.sender)?;
    let new_did = HealthDID {
        owner: info.sender.clone(),
        delegate_addresses: vec![],
        health_did: health_did.clone(),
        ipfs_uri: uri,
        alt_ipfs_uris: vec![],
        reputation_score: 10,
        has_world_id: false,
        has_polygon_id: false,
        has_social_id: false,
    };
    ADDRESS_DID_MAPPING.save(deps.storage, &info.sender, &new_did)?;

    Ok(Response::new().add_attribute("method", "register_did"))
}

fn try_update_did_data(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    health_did: String,
    uri: String,
) -> Result<Response, ContractError> {
    let owner = DID_OWNER_ADDRESS_REGISTRY.load(deps.storage, &health_did)?;
    if owner != info.sender {
        return Err(ContractError::Unauthorized {});
    }

    let mut did = ADDRESS_DID_MAPPING.load(deps.storage, &owner)?;
    did.ipfs_uri = uri;
    ADDRESS_DID_MAPPING.save(deps.storage, &owner, &did)?;

    Ok(Response::new().add_attribute("method", "update_did_data"))
}

fn try_add_alt_data(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    health_did: String,
    uris: Vec<String>,
) -> Result<Response, ContractError> {
    let owner = DID_OWNER_ADDRESS_REGISTRY.load(deps.storage, &health_did)?;
    if owner != info.sender {
        return Err(ContractError::Unauthorized {});
    }

    let mut did = ADDRESS_DID_MAPPING.load(deps.storage, &owner)?;
    did.alt_ipfs_uris.extend(uris);
    ADDRESS_DID_MAPPING.save(deps.storage, &owner, &did)?;

    Ok(Response::new().add_attribute("method", "add_alt_data"))
}

fn try_add_delegate_address(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    peer_address: Addr,
    health_did: String,
) -> Result<Response, ContractError> {
    let owner = DID_OWNER_ADDRESS_REGISTRY.load(deps.storage, &health_did)?;
    if owner != info.sender {
        return Err(ContractError::Unauthorized {});
    }

    DELEGATE_ADDRESSES.save(deps.storage, (&peer_address, &health_did), &true)?;

    Ok(Response::new().add_attribute("method", "add_delegate_address"))
}

fn try_remove_delegate_address(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    peer_address: Addr,
    health_did: String,
) -> Result<Response, ContractError> {
    let owner = DID_OWNER_ADDRESS_REGISTRY.load(deps.storage, &health_did)?;
    if owner != info.sender {
        return Err(ContractError::Unauthorized {});
    }

    if !DELEGATE_ADDRESSES.has(deps.storage, (&peer_address, &health_did)) {
        return Err(ContractError::NotDelegateAddress {});
    }

    DELEGATE_ADDRESSES.save(deps.storage, (&peer_address, &health_did), &false)?;

    Ok(Response::new().add_attribute("method", "remove_delegate_address"))
}


fn try_transfer_ownership(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    new_address: Addr,
    health_did: String,
) -> Result<Response, ContractError> {
    let owner = DID_OWNER_ADDRESS_REGISTRY.load(deps.storage, &health_did)?;
    if owner != info.sender {
        return Err(ContractError::Unauthorized {});
    }

    if new_address == info.sender {
        return Err(ContractError::CannotTransferToSelf {});
    }

    DID_OWNER_ADDRESS_REGISTRY.save(deps.storage, &health_did, &new_address)?;

    let mut did = ADDRESS_DID_MAPPING.load(deps.storage, &info.sender)?;
    did.owner = new_address.clone();
    ADDRESS_DID_MAPPING.save(deps.storage, &new_address, &did)?;

    Ok(Response::new().add_attribute("method", "transfer_ownership"))
}

#[entry_point]
pub fn query(
    deps: Deps,
    _env: Env,
    msg: QueryMsg,
) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetHealthDID { health_did } => to_binary(&query_health_did(deps, health_did)?),
    }
}

fn query_health_did(deps: Deps, health_did: String) -> StdResult<HealthDID> {
    let owner = DID_OWNER_ADDRESS_REGISTRY.load(deps.storage, &health_did)?;
    let did = ADDRESS_DID_MAPPING.load(deps.storage, &owner)?;
    Ok(did)
}

fn resolve_chain_id(did: &str) -> Result<u64, ContractError> {
    if did.len() < 6 {
        return Err(ContractError::InputTooShort {});
    }

    let did_bytes = did.as_bytes();
    let mut chain_id_uint = 0u64;

    for i in 0..6 {
        let char_value = did_bytes[i] as u8;
        if char_value < 48 || char_value > 57 {
            return Err(ContractError::InvalidNumber {}); // ASCII values for 0-9
        }
        chain_id_uint = chain_id_uint * 10 + (char_value - 48) as u64; // converting ASCII to integer and accumulating
    }

    Ok(chain_id_uint)
}

fn get_chain_id() -> u64 {
    use cosmwasm_std::from_slice;
    let chain_id = "dhealth-testnet-2";
    chain_id.parse().unwrap_or(0)
}

fn string_to_bytes32(source: &str) -> Binary {
    let mut result = [0u8; 32];
    let bytes = source.as_bytes();
    let length = if bytes.len() > 32 { 32 } else { bytes.len() };
    result[..length].copy_from_slice(&bytes[..length]);
    Binary::from(result)
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{from_binary, Addr};

    #[test]
    fn test_register_did() {
        let mut deps = mock_dependencies(&[]);
        let info = mock_info("creator", &[]);
        let msg = InstantiateMsg {};

        let res = instantiate(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
        assert_eq!(0, res.messages.len());

        let msg = ExecuteMsg::RegisterDID {
            health_did: "123456".to_string(),
            uri: "ipfs://example".to_string(),
        };

        let res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());

        let msg = QueryMsg::GetHealthDID {
            health_did: "123456".to_string(),
        };

        let bin = query(deps.as_ref(), mock_env(), msg).unwrap();
        let did: HealthDID = from_binary(&bin).unwrap();
        assert_eq!(did.health_did, "123456");
    }
}
