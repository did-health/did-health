use cosmwasm_std::{Addr};
use cosmwasm_schema::{cw_serde, QueryResponses};
use serde::{Deserialize, Serialize};
use schemars::JsonSchema;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct HealthDID {
  pub owner: Addr,
  pub delegate_addresses: Vec<Addr>,
  pub health_did: String,
  pub ipfs_uri: String,
  pub alt_ipfs_uris: Vec<String>,
  pub reputation_score: u8,
  pub has_world_id: bool,
  pub has_polygon_id: bool,
  pub has_social_id: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum ExecuteMsg {
  RegisterDID { health_did: String, uri: String },
  UpdateDIDData { health_did: String, uri: String },
  AddAltData { health_did: String, uris: Vec<String> },
  AddDelegateAddress { peer_address: Addr, health_did: String },
  RemoveDelegateAddress { peer_address: Addr, health_did: String },
  TransferOwnership { new_address: Addr, health_did: String },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum QueryMsg {
  GetHealthDID { health_did: String },
}
