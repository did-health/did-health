import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import fs from "fs";

// Configuration
const rpcEndpoint =
  process.env.RPC_ENDPOINT ?? "https://rpc-testnet.dhealth.dev";
const mnemonic =
  process.env.MNEMONIC ??
  "fantasy rabbit scene want speed document pet dash venture midnight pumpkin order chef payment wrist switch enemy hire fruit lend mushroom obtain burst wrist";
const addressPrefix = process.env.ADDRESS_PREFIX ?? "tdh02";
let wasmFilePath = "./contracts/artifacts/did_health_cosmos.wasm";
if (!fs.existsSync(wasmFilePath)) {
  wasmFilePath = wasmFilePath.replace(".wasm", "-aarch64.wasm");
}
const gasPrice = GasPrice.fromString(process.env.GAS_PRICE ?? "0.025utdhp");

async function main() {
  // Load the wallet from mnemonic
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: addressPrefix,
  });
  const [firstAccount] = await wallet.getAccounts();

  console.log(`Wallet address: ${firstAccount.address}`);

  // Create a client to interact with the blockchain
  const client = await SigningCosmWasmClient.connectWithSigner(
    rpcEndpoint,
    wallet,
    { gasPrice }
  );

  // Read Wasm binary
  const wasmCode = fs.readFileSync(wasmFilePath);

  // Upload the contract
  const uploadReceipt = await client.upload(
    firstAccount.address,
    wasmCode,
    "auto"
  );
  console.log(`Upload succeeded. Code ID: ${uploadReceipt.codeId}`);

  // Instantiate the contract
  const initMsg = {}; // Adjust with your contract's init message
  const contract = await client.instantiate(
    firstAccount.address,
    uploadReceipt.codeId,
    initMsg,
    "MyContract",
    "auto"
  );
  console.log(`Contract instantiated at address: ${contract.contractAddress}`);
}

main().catch(console.error);
