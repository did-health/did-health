import * as LitJsSdk from '@lit-protocol/lit-node-client';

const client = new LitJsSdk.LitNodeClient([]);
const chain = "ethereum";

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

  async encryptFile(file: any) {
    console.log('connecting to lit');
    if (!this.litNodeClient) {
        console.log("awaiting connect")
        await this.connect();

    }
    console.log('checking auth sign message on chain' + chain)
    
    try{
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
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
        console.log('error' + e )
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