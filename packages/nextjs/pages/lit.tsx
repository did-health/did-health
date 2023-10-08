import * as LitJsSdk from '@lit-protocol/lit-node-client';
const client = new LitJsSdk.LitNodeClient([]);
//const client = new LitJsSdk.LitNodeClient();
let chain = "";
import { useAccount, useNetwork } from "wagmi";


//Not used yet, but we need to get the chain id
const chainIdToName = {
    "0x1": "ethereum",
    "0x89": "polygon",
    "0xfa": "fantom",
    "0x64": "xdai",
    "0x38": "bsc",
    "0xa4b1": "arbitrum",
    "0xa86a": "avalanche",
    "0xa869": "fuji",
    "0x19020000": "harmony",
    "0x13881": "mumbai",
    "0x5": "goerli",
    "0x76": "cronos",
    "0xa": "optimism",
    "0xa4b0": "celo",
    "0x4ea64484": "aurora",
    "0x30d7": "eluvio",
    "0xac87": "alfajores",
    "0x2165": "evmos",
    "0x2166": "evmosTestnet",
    "0x61": "bscTestnet",
    "0x507": "moonbeam",
    "0x505": "moonriver",
    "0x2b": "moonbaseAlpha",
    "0x1cd": "filecoin",
    "0x153": "hyperspace",
    "0x7e5": "sepolia",
    "0x2c": "scrollAlphaTestnet",
    "0x13": "zksync",
    "0xbca": "zksyncTestnet",
    "0x108c": "chronicleTestnet",
    "0x1a4": "zkEvm",
    "0x539": "mantleTestnet",
    "0x6f": "mantle",
    "0x2011": "klaytn",
    "0x17": "publicGoodsNetwork",
    "0x65": "solana",
    "0x67": "solanaDevnet",
    "0xa928": "kyve",
    "0x369": "evmosCosmosTestnet",
    "0x3e8": "juno"
};


// Checks if the user has at least 0 ETH
const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain,
    method: "eth_getBalance",
    parameters: [":userAddress", "latest"],
    returnValueTest: {
      comparator: ">=",
      value: "0",
    },
  },
];

class Lit {
  litNodeClient: LitJsSdk.LitNodeClient | undefined;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  getChainName(chainId: string): string | undefined {
    const key = chainId as keyof typeof chainIdToName;
    return chainIdToName[key];
}
  async encryptFile(file: any, chainIdString: any, authSig: any) {
    console.log('connecting to lit');
    if (!this.litNodeClient) {
        console.log("awaiting connect")
        await this.connect();

    }
  
    try{
        console.log('actually doing enc')
        const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({ file });
  
        if (symmetricKey === undefined) {
        throw new Error('Symmetric key is undefined'); // Handle the case where symmetricKey is undefined
        }
        console.log('saving enc key')
        const encryptedSymmetricKey = await this.litNodeClient?.saveEncryptionKey({
        accessControlConditions: accessControlConditions,
        symmetricKey: symmetricKey,
        authSig,
        chain,
        });
        
        console.log("returning key")
        if (encryptedSymmetricKey !== undefined) {
        return {
            encryptedFile: encryptedFile,
            encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey as Uint8Array, "base16")
        };
        } else {
        console.log('no key');
        return {
            encryptedFile: null, // Assuming encryptedFile can be null
            encryptedSymmetricKey: null
        };
        }
    }
    catch(e){
        console.log('error' + JSON.stringify(e) )
        return {
            encryptedFile: null, // Assuming encryptedFile can be null
            encryptedSymmetricKey: null
        };
    }
    
  }

  async decryptFile(encryptedFile: any, encryptedSymmetricKey: any) {
    if (!this.litNodeClient) {
      await this.connect();
    }
  
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
  
    const symmetricKey = await this.litNodeClient?.getEncryptionKey({
      accessControlConditions: accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig
    });
  
    if (symmetricKey !== undefined) {
      const decryptedFile = await LitJsSdk.decryptFile({
        file: encryptedFile, // Fix: Using the argument 'encryptedFile' here
        symmetricKey
      });
  
      return decryptedFile;
    } else {
      throw new Error('Symmetric key is undefined');
    }
  }

  
}

export default new Lit();