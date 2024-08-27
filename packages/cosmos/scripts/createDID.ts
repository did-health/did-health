import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";

const contractAddress =
  "tdh021657pee2jhf4jk8pq6yq64e758ngvum45gl866knmjkd83w6jgn3svzwyq7";
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
    wallet,
    {
      gasPrice: GasPrice.fromString(`0.0025utdhp`),
    }
  );

  // Step 2: Execute the contract
  const executeMsg = {
    RegisterDID: {
      health_did: "did:health:example:org",
      uri: "https://example.com",
    },
  }; // Replace with your execute message

  const executionResult = await client.execute(
    yourAddress,
    contractAddress,
    executeMsg,
    "auto"
  );
  console.log("Transaction result:", executionResult);
}

main().catch(console.error);
