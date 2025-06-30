const deployedContracts = {
  testnet: {
    arbitrumSepolia: {
      DidHealthDAO: {
        address: "0xa54e4ac0D2DE3F7c34349b80256eEE76bC648c07",
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
                name: "ipfsUri",
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
            name: "hasApplied",
            inputs: [
              {
                name: "",
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
            name: "DAOApplicationApproved",
            inputs: [
              {
                name: "member",
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
                name: "role",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "orgName",
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
          {
            type: "event",
            name: "DaoRegistered",
            inputs: [
              {
                name: "applicant",
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
          {
            type: "event",
            name: "MemberRemoved",
            inputs: [
              {
                name: "member",
                type: "address",
                indexed: true,
                internalType: "address",
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
        address: "0xFF4d69075D459C47fa9C2432ad23f00D4AcF8203",
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
            name: "didExists",
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
            name: "getDidOwner",
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
                type: "address",
                internalType: "address",
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
        address: "0xEc486590247ab4450b0382108685C18082b45276",
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
                name: "ipfsUri",
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
            name: "hasApplied",
            inputs: [
              {
                name: "",
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
            name: "DAOApplicationApproved",
            inputs: [
              {
                name: "member",
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
                name: "role",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "orgName",
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
          {
            type: "event",
            name: "DaoRegistered",
            inputs: [
              {
                name: "applicant",
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
          {
            type: "event",
            name: "MemberRemoved",
            inputs: [
              {
                name: "member",
                type: "address",
                indexed: true,
                internalType: "address",
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
        address: "0x9E48EB941A02482AA33356986e2d2A66259Fa375",
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
            name: "didExists",
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
            name: "getDidOwner",
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
                type: "address",
                internalType: "address",
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
        address: "0x916C6b14234a691962176E980714979789dBc993",
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
                name: "ipfsUri",
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
            name: "hasApplied",
            inputs: [
              {
                name: "",
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
            name: "DAOApplicationApproved",
            inputs: [
              {
                name: "member",
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
                name: "role",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "orgName",
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
          {
            type: "event",
            name: "DaoRegistered",
            inputs: [
              {
                name: "applicant",
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
          {
            type: "event",
            name: "MemberRemoved",
            inputs: [
              {
                name: "member",
                type: "address",
                indexed: true,
                internalType: "address",
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
        address: "0x76ffDB83c3839d5521466E6caB12f3295819A73C",
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
            name: "didExists",
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
            name: "getDidOwner",
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
                type: "address",
                internalType: "address",
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
    polygonPOSAmoy: {
      HealthDIDRegistry: {
        address: "0x1723f8c9dbAc60473dAc6F649F1679A0196ac987",
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
            name: "didExists",
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
            name: "getDidOwner",
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
                type: "address",
                internalType: "address",
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
        chainId: 80001,
        chainIdHex: "0x0",
        graphRpcUrl:
          "https://api.studio.thegraph.com/query/114229/polygon-posamoy/version/latest",
      },
    },
    scrollSepolia: {
      DidHealthDAO: {
        address: "0x9E35829fC997748E332b96eBd48D2c17670cf41e",
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
                name: "ipfsUri",
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
            name: "hasApplied",
            inputs: [
              {
                name: "",
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
            name: "DAOApplicationApproved",
            inputs: [
              {
                name: "member",
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
                name: "role",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "orgName",
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
          {
            type: "event",
            name: "DaoRegistered",
            inputs: [
              {
                name: "applicant",
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
          {
            type: "event",
            name: "MemberRemoved",
            inputs: [
              {
                name: "member",
                type: "address",
                indexed: true,
                internalType: "address",
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
        address: "0xEc486590247ab4450b0382108685C18082b45276",
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
            name: "didExists",
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
            name: "getDidOwner",
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
                type: "address",
                internalType: "address",
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
        address: "0x61F07C2048c947d85A511e0F7d2AFB01fc7B959f",
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
                name: "ipfsUri",
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
            name: "hasApplied",
            inputs: [
              {
                name: "",
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
            name: "DAOApplicationApproved",
            inputs: [
              {
                name: "member",
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
                name: "role",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "orgName",
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
          {
            type: "event",
            name: "DaoRegistered",
            inputs: [
              {
                name: "applicant",
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
          {
            type: "event",
            name: "MemberRemoved",
            inputs: [
              {
                name: "member",
                type: "address",
                indexed: true,
                internalType: "address",
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
        address: "0xB46dc49C051C1D2A1978eCFDFf79eBc4fF6746d2",
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
            name: "didExists",
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
            name: "getDidOwner",
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
                type: "address",
                internalType: "address",
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
        address: "0xFF4d69075D459C47fa9C2432ad23f00D4AcF8203",
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
                name: "ipfsUri",
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
            name: "hasApplied",
            inputs: [
              {
                name: "",
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
            name: "DAOApplicationApproved",
            inputs: [
              {
                name: "member",
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
                name: "role",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "orgName",
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
          {
            type: "event",
            name: "DaoRegistered",
            inputs: [
              {
                name: "applicant",
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
          {
            type: "event",
            name: "MemberRemoved",
            inputs: [
              {
                name: "member",
                type: "address",
                indexed: true,
                internalType: "address",
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
        address: "0xCDd076E8B022942635F84628bC041426E0AE0556",
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
            name: "didExists",
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
            name: "getDidOwner",
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
                type: "address",
                internalType: "address",
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
