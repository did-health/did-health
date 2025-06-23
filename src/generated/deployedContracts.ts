const deployedContracts = {
  testnet: {
    arbitrumSepolia: {
      DidHealthDAO: {
        address: "0x2Fe1180A5F8C28912eE68Addf4f8D2bbF24dedD4",
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
        chainId: 421614,
        chainIdHex: "0x0",
        rpcUrl:
          "https://arb-sepolia.g.alchemy.com/v2/BXP3qmrrSWjmqSOJYQitNssCMI4dI_Ke",
        litChainKey: "arbitrum-sepolia",
        graphRpcUrl:
          "https://api.studio.thegraph.com/query/114229/arbitrum-sepolia/version/latest",
      },
      HealthDIDRegistry: {
        address: "0x43D885B44a7Ce01C56E464AC21FB3FE2577bf3A1",
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
        litChainKey: "arbitrum-sepolia",
        graphRpcUrl:
          "https://api.studio.thegraph.com/query/114229/arbitrum-sepolia/version/latest",
      },
    },
    baseSepolia: {
      DidHealthDAO: {
        address: "0x459B34995BcB264cCd648b69EA28B41BeB798Fe8",
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
        chainId: 84532,
        chainIdHex: "0x0",
        rpcUrl:
          "https://base-sepolia.g.alchemy.com/v2/BXP3qmrrSWjmqSOJYQitNssCMI4dI_Ke",
        litChainKey: "base-sepolia",
        graphRpcUrl:
          "https://api.studio.thegraph.com/query/114229/base-sepolia/version/latest",
      },
      HealthDIDRegistry: {
        address: "0x28A74406700F54FFdf21B7c17866aA9dfE5A6D45",
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
        litChainKey: "base-sepolia",
        graphRpcUrl:
          "https://api.studio.thegraph.com/query/114229/base-sepolia/version/latest",
      },
    },
    lineaSepolia: {},
    optimismSepolia: {
      DidHealthDAO: {
        address: "0x43D885B44a7Ce01C56E464AC21FB3FE2577bf3A1",
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
        chainId: 11155420,
        chainIdHex: "0x0",
        rpcUrl:
          "https://opt-sepolia.g.alchemy.com/v2/BXP3qmrrSWjmqSOJYQitNssCMI4dI_Ke",
        litChainKey: "optimism-sepolia",
        graphRpcUrl:
          "https://api.studio.thegraph.com/query/114229/optimism-sepolia/version/latest",
      },
      HealthDIDRegistry: {
        address: "0xdd847306c11E59970c6253f766F85f32062cC244",
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
        litChainKey: "optimism-sepolia",
        graphRpcUrl:
          "https://api.studio.thegraph.com/query/114229/optimism-sepolia/version/latest",
      },
    },
    scrollSepolia: {
      DidHealthDAO: {
        address: "0x459B34995BcB264cCd648b69EA28B41BeB798Fe8",
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
        chainId: 534351,
        chainIdHex: "0x0",
        rpcUrl:
          "https://scroll-sepolia.g.alchemy.com/v2/BXP3qmrrSWjmqSOJYQitNssCMI4dI_Ke",
        litChainKey: "scroll-sepolia",
        graphRpcUrl:
          "https://api.studio.thegraph.com/query/114229/scroll-sepolia/version/latest",
      },
      HealthDIDRegistry: {
        address: "0x28A74406700F54FFdf21B7c17866aA9dfE5A6D45",
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
        litChainKey: "scroll-sepolia",
        graphRpcUrl:
          "https://api.studio.thegraph.com/query/114229/scroll-sepolia/version/latest",
      },
    },
    sepolia: {
      DidHealthDAO: {
        address: "0x125e3D2720f6Ea390068Bf66E3801FC8a8CF454f",
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
        graphRpcUrl:
          "https://api.studio.thegraph.com/query/114229/sepolia/version/latest",
      },
      HealthDIDRegistry: {
        address: "0xA9160f458EEfF7667938Ad0fD0a49c813944f9d2",
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
        graphRpcUrl:
          "https://api.studio.thegraph.com/query/114229/sepolia/version/latest",
      },
    },
    zksyncSepolia: {
      DidHealthDAO: {
        address: "0xBD21CFe33eb75fe878a3Cb3DceDdcd2fb93a0C44",
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
        chainId: 300,
        chainIdHex: "0x0",
        rpcUrl:
          "https://zksync-sepolia.g.alchemy.com/v2/BXP3qmrrSWjmqSOJYQitNssCMI4dI_Ke",
        litChainKey: "zksync-sepolia",
        graphRpcUrl:
          "https://api.studio.thegraph.com/query/114229/zksync-sepolia/version/latest",
      },
      HealthDIDRegistry: {
        address: "0x2Fe1180A5F8C28912eE68Addf4f8D2bbF24dedD4",
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
        litChainKey: "zksync-sepolia",
        graphRpcUrl:
          "https://api.studio.thegraph.com/query/114229/zksync-sepolia/version/latest",
      },
    },
  },
  mainnet: {},
} as const;

export default deployedContracts;
