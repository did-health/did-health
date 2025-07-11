const deployedContracts = {
  testnet: {
    arbitrumSepolia: {
      DidHealthDAO: {
        address: "0x2b65881234035147502f4502Db0CADe81F63332f",
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
        address: "0x6C33f20390AE25B154a5Bed60D59c9687F6dA935",
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
          {
            type: "event",
            name: "DIDRegistered",
            inputs: [
              {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
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
            name: "DIDUpdated",
            inputs: [
              {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
              {
                name: "newIpfsUri",
                type: "string",
                indexed: false,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "DelegateAdded",
            inputs: [
              {
                name: "delegate",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "DelegateRemoved",
            inputs: [
              {
                name: "delegate",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "OwnershipTransferred",
            inputs: [
              {
                name: "previousOwner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "newOwner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
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
    },
    baseSepolia: {
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
          {
            type: "event",
            name: "DIDRegistered",
            inputs: [
              {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
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
            name: "DIDUpdated",
            inputs: [
              {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
              {
                name: "newIpfsUri",
                type: "string",
                indexed: false,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "DelegateAdded",
            inputs: [
              {
                name: "delegate",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "DelegateRemoved",
            inputs: [
              {
                name: "delegate",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "OwnershipTransferred",
            inputs: [
              {
                name: "previousOwner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "newOwner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
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
    },
    lineaSepolia: {},
    optimismSepolia: {
      DidHealthDAO: {
        address: "0x4C1FC0aA763Aba3cE0F47D569fd55A29b107C3D6",
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
        address: "0x0BD721730c5E253223b83C06756b0654B9F9B71d",
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
          {
            type: "event",
            name: "DIDRegistered",
            inputs: [
              {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
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
            name: "DIDUpdated",
            inputs: [
              {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
              {
                name: "newIpfsUri",
                type: "string",
                indexed: false,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "DelegateAdded",
            inputs: [
              {
                name: "delegate",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "DelegateRemoved",
            inputs: [
              {
                name: "delegate",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "OwnershipTransferred",
            inputs: [
              {
                name: "previousOwner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "newOwner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
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
        address: "0x4f672Fa12D812b249508b569E8a3eb1426Ac7d5A",
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
        address: "0x384420330Df1beD2307454Cc657083DBE27115a1",
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
          {
            type: "event",
            name: "DIDRegistered",
            inputs: [
              {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
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
            name: "DIDUpdated",
            inputs: [
              {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
              {
                name: "newIpfsUri",
                type: "string",
                indexed: false,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "DelegateAdded",
            inputs: [
              {
                name: "delegate",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "DelegateRemoved",
            inputs: [
              {
                name: "delegate",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "OwnershipTransferred",
            inputs: [
              {
                name: "previousOwner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "newOwner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
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
    },
    sepolia: {
      DidHealthDAO: {
        address: "0x726D744e6536Cf2cfDb7df484dB1f1Df905375D4",
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
        address: "0x05837A4e999DA0e5725eE8B287e864455CF1D589",
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
          {
            type: "event",
            name: "DIDRegistered",
            inputs: [
              {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
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
            name: "DIDUpdated",
            inputs: [
              {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
              {
                name: "newIpfsUri",
                type: "string",
                indexed: false,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "DelegateAdded",
            inputs: [
              {
                name: "delegate",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "DelegateRemoved",
            inputs: [
              {
                name: "delegate",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "OwnershipTransferred",
            inputs: [
              {
                name: "previousOwner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "newOwner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
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
    },
    zksyncSepolia: {
      DidHealthDAO: {
        address: "0x4C1FC0aA763Aba3cE0F47D569fd55A29b107C3D6",
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
        address: "0x0BD721730c5E253223b83C06756b0654B9F9B71d",
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
          {
            type: "event",
            name: "AltURIsAdded",
            inputs: [
              {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
              {
                name: "uris",
                type: "string[]",
                indexed: false,
                internalType: "string[]",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "DIDRegistered",
            inputs: [
              {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
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
            name: "DIDUpdated",
            inputs: [
              {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
              {
                name: "newIpfsUri",
                type: "string",
                indexed: false,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "DelegateAdded",
            inputs: [
              {
                name: "delegate",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "DelegateRemoved",
            inputs: [
              {
                name: "delegate",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
                internalType: "string",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "OwnershipTransferred",
            inputs: [
              {
                name: "previousOwner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "newOwner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "healthDid",
                type: "string",
                indexed: true,
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
    },
  },
  mainnet: {},
} as const;

export default deployedContracts;
