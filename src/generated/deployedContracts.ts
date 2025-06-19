const deployedContracts = {
  testnet: {
    arbitrumSepolia: {
      HealthDIDRegistry: {
        address: "0x035c3c335C1e027E09307E2af39D66C16ee51554",
        abi: [
          {
            type: "constructor",
            inputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "receive",
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "REGISTRATION_FEE_WEI",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "addAltData",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uris",
                type: "string[]",
                internalType: "string[]",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "addDelegateAddress",
            inputs: [
              {
                name: "_peerAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "addressDidMapping",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "owner",
                type: "address",
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "ipfsUri",
                type: "string",
                internalType: "string",
              },
              {
                name: "hasWorldId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "hasPolygonId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "hasSocialId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "reputationScore",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "contractOwner",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "delegateAddresses",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
              {
                name: "",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getChainID",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getHealthDID",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "tuple",
                internalType: "struct HealthDID",
                components: [
                  {
                    name: "owner",
                    type: "address",
                    internalType: "address",
                  },
                  {
                    name: "healthDid",
                    type: "string",
                    internalType: "string",
                  },
                  {
                    name: "ipfsUri",
                    type: "string",
                    internalType: "string",
                  },
                  {
                    name: "altIpfsUris",
                    type: "string[]",
                    internalType: "string[]",
                  },
                  {
                    name: "hasWorldId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "hasPolygonId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "hasSocialId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "reputationScore",
                    type: "uint256",
                    internalType: "uint256",
                  },
                ],
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "registerDID",
            inputs: [
              {
                name: "_healthDID",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uri",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "removeDelegateAddress",
            inputs: [
              {
                name: "_peerAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "resolveChainId",
            inputs: [
              {
                name: "did",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "pure",
          },
          {
            type: "function",
            name: "transferOwnership",
            inputs: [
              {
                name: "_newOwner",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "updateDIDData",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uri",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "withdraw",
            inputs: [],
            outputs: [],
            stateMutability: "nonpayable",
          },
        ],
        chainId: 421614,
        chainIdHex: "0x0",
        rpcUrl:
          "https://arb-sepolia.g.alchemy.com/v2/BXP3qmrrSWjmqSOJYQitNssCMI4dI_Ke",
        litChainKey: "arbitrumSepolia",
      },
    },
    baseSepolia: {
      HealthDIDRegistry: {
        address: "0x8335cC4991ee1a15F6490E0e5085F56620d6EC45",
        abi: [
          {
            type: "constructor",
            inputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "receive",
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "REGISTRATION_FEE_WEI",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "addAltData",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uris",
                type: "string[]",
                internalType: "string[]",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "addDelegateAddress",
            inputs: [
              {
                name: "_peerAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "addressDidMapping",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "owner",
                type: "address",
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "ipfsUri",
                type: "string",
                internalType: "string",
              },
              {
                name: "hasWorldId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "hasPolygonId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "hasSocialId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "reputationScore",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "contractOwner",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "delegateAddresses",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
              {
                name: "",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getChainID",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getHealthDID",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "tuple",
                internalType: "struct HealthDID",
                components: [
                  {
                    name: "owner",
                    type: "address",
                    internalType: "address",
                  },
                  {
                    name: "healthDid",
                    type: "string",
                    internalType: "string",
                  },
                  {
                    name: "ipfsUri",
                    type: "string",
                    internalType: "string",
                  },
                  {
                    name: "altIpfsUris",
                    type: "string[]",
                    internalType: "string[]",
                  },
                  {
                    name: "hasWorldId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "hasPolygonId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "hasSocialId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "reputationScore",
                    type: "uint256",
                    internalType: "uint256",
                  },
                ],
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "registerDID",
            inputs: [
              {
                name: "_healthDID",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uri",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "removeDelegateAddress",
            inputs: [
              {
                name: "_peerAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "resolveChainId",
            inputs: [
              {
                name: "did",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "pure",
          },
          {
            type: "function",
            name: "transferOwnership",
            inputs: [
              {
                name: "_newOwner",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "updateDIDData",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uri",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "withdraw",
            inputs: [],
            outputs: [],
            stateMutability: "nonpayable",
          },
        ],
        chainId: 84532,
        chainIdHex: "0x0",
        rpcUrl:
          "https://base-sepolia.g.alchemy.com/v2/BXP3qmrrSWjmqSOJYQitNssCMI4dI_Ke",
        litChainKey: "baseSepolia",
      },
    },
    lineaSepolia: {},
    optimismSepolia: {
      HealthDIDRegistry: {
        address: "0x035c3c335C1e027E09307E2af39D66C16ee51554",
        abi: [
          {
            type: "constructor",
            inputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "receive",
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "REGISTRATION_FEE_WEI",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "addAltData",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uris",
                type: "string[]",
                internalType: "string[]",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "addDelegateAddress",
            inputs: [
              {
                name: "_peerAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "addressDidMapping",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "owner",
                type: "address",
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "ipfsUri",
                type: "string",
                internalType: "string",
              },
              {
                name: "hasWorldId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "hasPolygonId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "hasSocialId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "reputationScore",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "contractOwner",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "delegateAddresses",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
              {
                name: "",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getChainID",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getHealthDID",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "tuple",
                internalType: "struct HealthDID",
                components: [
                  {
                    name: "owner",
                    type: "address",
                    internalType: "address",
                  },
                  {
                    name: "healthDid",
                    type: "string",
                    internalType: "string",
                  },
                  {
                    name: "ipfsUri",
                    type: "string",
                    internalType: "string",
                  },
                  {
                    name: "altIpfsUris",
                    type: "string[]",
                    internalType: "string[]",
                  },
                  {
                    name: "hasWorldId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "hasPolygonId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "hasSocialId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "reputationScore",
                    type: "uint256",
                    internalType: "uint256",
                  },
                ],
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "registerDID",
            inputs: [
              {
                name: "_healthDID",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uri",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "removeDelegateAddress",
            inputs: [
              {
                name: "_peerAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "resolveChainId",
            inputs: [
              {
                name: "did",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "pure",
          },
          {
            type: "function",
            name: "transferOwnership",
            inputs: [
              {
                name: "_newOwner",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "updateDIDData",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uri",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "withdraw",
            inputs: [],
            outputs: [],
            stateMutability: "nonpayable",
          },
        ],
        chainId: 11155420,
        chainIdHex: "0x0",
        rpcUrl:
          "https://opt-sepolia.g.alchemy.com/v2/BXP3qmrrSWjmqSOJYQitNssCMI4dI_Ke",
      },
    },
    scrollSepolia: {
      HealthDIDRegistry: {
        address: "0x8335cC4991ee1a15F6490E0e5085F56620d6EC45",
        abi: [
          {
            type: "constructor",
            inputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "receive",
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "REGISTRATION_FEE_WEI",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "addAltData",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uris",
                type: "string[]",
                internalType: "string[]",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "addDelegateAddress",
            inputs: [
              {
                name: "_peerAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "addressDidMapping",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "owner",
                type: "address",
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "ipfsUri",
                type: "string",
                internalType: "string",
              },
              {
                name: "hasWorldId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "hasPolygonId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "hasSocialId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "reputationScore",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "contractOwner",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "delegateAddresses",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
              {
                name: "",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getChainID",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getHealthDID",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "tuple",
                internalType: "struct HealthDID",
                components: [
                  {
                    name: "owner",
                    type: "address",
                    internalType: "address",
                  },
                  {
                    name: "healthDid",
                    type: "string",
                    internalType: "string",
                  },
                  {
                    name: "ipfsUri",
                    type: "string",
                    internalType: "string",
                  },
                  {
                    name: "altIpfsUris",
                    type: "string[]",
                    internalType: "string[]",
                  },
                  {
                    name: "hasWorldId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "hasPolygonId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "hasSocialId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "reputationScore",
                    type: "uint256",
                    internalType: "uint256",
                  },
                ],
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "registerDID",
            inputs: [
              {
                name: "_healthDID",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uri",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "removeDelegateAddress",
            inputs: [
              {
                name: "_peerAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "resolveChainId",
            inputs: [
              {
                name: "did",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "pure",
          },
          {
            type: "function",
            name: "transferOwnership",
            inputs: [
              {
                name: "_newOwner",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "updateDIDData",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uri",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "withdraw",
            inputs: [],
            outputs: [],
            stateMutability: "nonpayable",
          },
        ],
        chainId: 534351,
        chainIdHex: "0x0",
        rpcUrl:
          "https://scroll-sepolia.g.alchemy.com/v2/BXP3qmrrSWjmqSOJYQitNssCMI4dI_Ke",
        litChainKey: "scrollSepolia",
      },
    },
    sepolia: {
      DidHealthDAO: {
        address: "0x3dA72c640E278D7e5a91C18b799186d2e05c7c92",
        abi: [
          {
            type: "constructor",
            inputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "applyForMembership",
            inputs: [
              {
                name: "did",
                type: "string",
                internalType: "string",
              },
              {
                name: "",
                type: "string",
                internalType: "string",
              },
              {
                name: "",
                type: "string",
                internalType: "string",
              },
              {
                name: "ipfsUri",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [],
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "approveMembership",
            inputs: [
              {
                name: "addr",
                type: "address",
                internalType: "address",
              },
              {
                name: "role",
                type: "string",
                internalType: "string",
              },
              {
                name: "orgName",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "getProfile",
            inputs: [
              {
                name: "addr",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "string",
                internalType: "string",
              },
              {
                name: "",
                type: "string",
                internalType: "string",
              },
              {
                name: "",
                type: "string",
                internalType: "string",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "isMember",
            inputs: [
              {
                name: "addr",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "members",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "did",
                type: "string",
                internalType: "string",
              },
              {
                name: "role",
                type: "string",
                internalType: "string",
              },
              {
                name: "orgName",
                type: "string",
                internalType: "string",
              },
              {
                name: "exists",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "owner",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "registrationFee",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "removeMember",
            inputs: [
              {
                name: "addr",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "setRegistrationFee",
            inputs: [
              {
                name: "fee",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "withdraw",
            inputs: [],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "event",
            name: "DaoRegistered",
            inputs: [
              {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "did",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "ipfsUri",
                type: "string",
                indexed: false,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
        ],
        chainId: 11155111,
        chainIdHex: "0xaa36a7",
        rpcUrl:
          "https://eth-sepolia.g.alchemy.com/v2/BXP3qmrrSWjmqSOJYQitNssCMI4dI_Ke",
        litChainKey: "sepolia",
      },
      HealthDIDRegistry: {
        address: "0x66745d3002245db8DEcB0b1c79415C4B8b94c5E4",
        abi: [
          {
            type: "constructor",
            inputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "receive",
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "REGISTRATION_FEE_WEI",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "addAltData",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uris",
                type: "string[]",
                internalType: "string[]",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "addDelegateAddress",
            inputs: [
              {
                name: "_peerAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "addressDidMapping",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "owner",
                type: "address",
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "ipfsUri",
                type: "string",
                internalType: "string",
              },
              {
                name: "hasWorldId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "hasPolygonId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "hasSocialId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "reputationScore",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "contractOwner",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "delegateAddresses",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
              {
                name: "",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getChainID",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getHealthDID",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "tuple",
                internalType: "struct HealthDID",
                components: [
                  {
                    name: "owner",
                    type: "address",
                    internalType: "address",
                  },
                  {
                    name: "healthDid",
                    type: "string",
                    internalType: "string",
                  },
                  {
                    name: "ipfsUri",
                    type: "string",
                    internalType: "string",
                  },
                  {
                    name: "altIpfsUris",
                    type: "string[]",
                    internalType: "string[]",
                  },
                  {
                    name: "hasWorldId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "hasPolygonId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "hasSocialId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "reputationScore",
                    type: "uint256",
                    internalType: "uint256",
                  },
                ],
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "registerDID",
            inputs: [
              {
                name: "_healthDID",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uri",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "removeDelegateAddress",
            inputs: [
              {
                name: "_peerAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "resolveChainId",
            inputs: [
              {
                name: "did",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "pure",
          },
          {
            type: "function",
            name: "transferOwnership",
            inputs: [
              {
                name: "_newOwner",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "updateDIDData",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uri",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "withdraw",
            inputs: [],
            outputs: [],
            stateMutability: "nonpayable",
          },
        ],
        chainId: 11155111,
        chainIdHex: "0xaa36a7",
        rpcUrl:
          "https://eth-sepolia.g.alchemy.com/v2/BXP3qmrrSWjmqSOJYQitNssCMI4dI_Ke",
        litChainKey: "sepolia",
      },
    },
    zksyncSepolia: {
      HealthDIDRegistry: {
        address: "0xCF60Da4A5B0eB7A5068eE0C166dE8138a025B3b8",
        abi: [
          {
            type: "constructor",
            inputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "receive",
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "REGISTRATION_FEE_WEI",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "addAltData",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uris",
                type: "string[]",
                internalType: "string[]",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "addDelegateAddress",
            inputs: [
              {
                name: "_peerAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "addressDidMapping",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "owner",
                type: "address",
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "ipfsUri",
                type: "string",
                internalType: "string",
              },
              {
                name: "hasWorldId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "hasPolygonId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "hasSocialId",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "reputationScore",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "contractOwner",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "delegateAddresses",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
              {
                name: "",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getChainID",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getHealthDID",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "tuple",
                internalType: "struct HealthDID",
                components: [
                  {
                    name: "owner",
                    type: "address",
                    internalType: "address",
                  },
                  {
                    name: "healthDid",
                    type: "string",
                    internalType: "string",
                  },
                  {
                    name: "ipfsUri",
                    type: "string",
                    internalType: "string",
                  },
                  {
                    name: "altIpfsUris",
                    type: "string[]",
                    internalType: "string[]",
                  },
                  {
                    name: "hasWorldId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "hasPolygonId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "hasSocialId",
                    type: "bool",
                    internalType: "bool",
                  },
                  {
                    name: "reputationScore",
                    type: "uint256",
                    internalType: "uint256",
                  },
                ],
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "registerDID",
            inputs: [
              {
                name: "_healthDID",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uri",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "removeDelegateAddress",
            inputs: [
              {
                name: "_peerAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "resolveChainId",
            inputs: [
              {
                name: "did",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "pure",
          },
          {
            type: "function",
            name: "transferOwnership",
            inputs: [
              {
                name: "_newOwner",
                type: "address",
                internalType: "address",
              },
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "updateDIDData",
            inputs: [
              {
                name: "_healthDid",
                type: "string",
                internalType: "string",
              },
              {
                name: "_uri",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "withdraw",
            inputs: [],
            outputs: [],
            stateMutability: "nonpayable",
          },
        ],
        chainId: 300,
        chainIdHex: "0x0",
        rpcUrl:
          "https://zksync-sepolia.g.alchemy.com/v2/BXP3qmrrSWjmqSOJYQitNssCMI4dI_Ke",
      },
    },
  },
  mainnet: {},
} as const;

export default deployedContracts;
