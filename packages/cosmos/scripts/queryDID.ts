import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

const contractAddress = "tdh021657pee2jhf4jk8pq6yq64e758ngvum45gl866knmjkd83w6jgn3svzwyq7";
const rpcEndpoint = "https://rpc-testnet.dhealth.dev/"; // Replace with your RPC endpoint

async function main() {
  // Create a CosmWasm client to interact with the chain
  const client = await CosmWasmClient.connect(rpcEndpoint);

  // Define the query message for the contract
  const queryMsg = {
    GetHealthDID: {
      health_did: "did:health:example:org"
    }
  }

  // Query the contract with the provided message
  const result = await client.queryContractSmart(contractAddress, queryMsg);
  console.log("Query result:", result);
  return result;
}

main().catch(console.error);