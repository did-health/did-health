function contractCall(chainId: string): string {
  const contractAddresses: Record<string, string> = {
    "80001": "0x632f4B84921A39c3AF2642Bb491a6E1cb2076a48",
    "84531": "0xE9675f75D9D2C746ef4AB77703fc068d45A753f6",
    "014421": "0xfa343B1755a7197B2164B8cA55CF425AEE6C6efA",
    "534351": "0xfa343B1755a7197B2164B8cA55CF425AEE6C6efA",
    // Add more chainId to contract address mappings as needed
  };

  // Check if the chainId exists in the mappings
  if (contractAddresses.hasOwnProperty(chainId)) {
    return contractAddresses[chainId];
  } else {
    throw new Error(`Contract address not found for chainId: ${chainId}`);
  }
}

function extractChainIdAndCallContract(did: string): [string, string] {
  if (did.length !== 44) {
    throw new Error("Invalid DID string length");
  }

  // Extract the first 2 characters as chainId and the rest as randomString
  //scroll chain id length = 6
  //polygon chain id length = 5
  const chainId = did.substring(0, 6);
  const randomString = did.substring(6);

  // Make a contract call based on the chainId
  const contractAddress = contractCall(chainId);

  // Return a tuple of chainId and contractAddress
  return [chainId, contractAddress];
}

// Example usage:
//   const didString = "010x1234567890abcdef..."; // Replace with your DID string
//   try {
//     const [chainId, contractAddress] = extractChainIdAndCallContract(didString);
//     console.log(`Chain ID: ${chainId}`);
//     console.log(`Contract Address: ${contractAddress}`);
//   } catch (error) {
//     console.error(error.message);
//   }
