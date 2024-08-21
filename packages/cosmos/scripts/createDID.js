import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { assertIsDeliverTxSuccess, GasPrice } from "@cosmjs/stargate";

const contractAddress = "tdh021vhndln95yd7rngslzvf6sax6axcshkxqpmpr886ntelh28p9ghuqcr72sh";
const mnemonic = ""; // Replace with your mnemonic
const rpcEndpoint = "https://rpc-testnet.dhealth.dev/"; // Replace with your RPC endpoint
const walletPrefix = "tdh02"; // Replace with your chain prefix (e.g., "cosmos", "wasm", etc.)
const yourAddress = ""; // Replace with your address

async function main() {
  // Step 1: Set up the wallet and client
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: walletPrefix });
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
      uri: "https://example.com"
    }
  }; // Replace with your execute message

  const executionResult = await client.execute(
    yourAddress,
    contractAddress,
    executeMsg,
    "auto"
  );
  assertIsDeliverTxSuccess(executionResult);
  console.log("Transaction successful:", executionResult);
}

main().catch(console.error);