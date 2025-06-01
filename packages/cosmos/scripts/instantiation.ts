import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

const smartContractCodeId = 12;
const mnemonic = ""; // Replace with your mnemonic
const rpcEndpoint = "https://rpc-testnet.dhealth.dev/"; // Replace with your RPC endpoint
const walletPrefix = "tdh02"; // Replace with your chain prefix (e.g., "cosmos", "wasm", etc.)
const yourAddress = ""; // Replace with your address

async function main() {
  // Step 1: Set up the wallet and client
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: walletPrefix,
  });
  const client = await SigningCosmWasmClient.connectWithSigner(
    rpcEndpoint,
    wallet
  );

  // Step 2: Instantiate the contract
  const initMsg = {}; // Replace with your initialization message
  const label = "DID-Health";
  const instantiateFee = {
    amount: [{ denom: "utdhp", amount: "50000" }], // Adjust based on your network
    gas: "200000",
  };

  const instantiateResult = await client.instantiate(
    yourAddress,
    smartContractCodeId,
    initMsg,
    label,
    instantiateFee
  );
  if (instantiateResult.contractAddress) {
    console.log("Contract Address:", instantiateResult.contractAddress);
  }
}

main().catch(console.error);
