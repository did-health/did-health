const contracts = {
  5: [
    {
      chainId: "5",
      name: "goerli",
      contracts: {
        HealthDIDRegistry: {
          address: "0xed0408DA197f5F5Fc306ca4B3148149D64e0514F",
          abi: [
            {
              inputs: [],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_healthDid",
                  type: "string",
                },
                {
                  internalType: "string[]",
                  name: "_uris",
                  type: "string[]",
                },
              ],
              name: "addAltData",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_peerAddress",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "_healthDid",
                  type: "string",
                },
              ],
              name: "addDelegateAddress",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "addressDidMapping",
              outputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "healthDid",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "ipfsUri",
                  type: "string",
                },
                {
                  internalType: "uint8",
                  name: "reputationScore",
                  type: "uint8",
                },
                {
                  internalType: "bool",
                  name: "hasWorldId",
                  type: "bool",
                },
                {
                  internalType: "bool",
                  name: "hasPolygonId",
                  type: "bool",
                },
                {
                  internalType: "bool",
                  name: "hasSocialId",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              name: "delegateAddresses",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "getChainID",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_healthDid",
                  type: "string",
                },
              ],
              name: "getHealtDID",
              outputs: [
                {
                  components: [
                    {
                      internalType: "address",
                      name: "owner",
                      type: "address",
                    },
                    {
                      internalType: "address[]",
                      name: "delegateAddresses",
                      type: "address[]",
                    },
                    {
                      internalType: "string",
                      name: "healthDid",
                      type: "string",
                    },
                    {
                      internalType: "string",
                      name: "ipfsUri",
                      type: "string",
                    },
                    {
                      internalType: "string[]",
                      name: "altIpfsUris",
                      type: "string[]",
                    },
                    {
                      internalType: "uint8",
                      name: "reputationScore",
                      type: "uint8",
                    },
                    {
                      internalType: "bool",
                      name: "hasWorldId",
                      type: "bool",
                    },
                    {
                      internalType: "bool",
                      name: "hasPolygonId",
                      type: "bool",
                    },
                    {
                      internalType: "bool",
                      name: "hasSocialId",
                      type: "bool",
                    },
                  ],
                  internalType: "struct Structs.HealthDID",
                  name: "",
                  type: "tuple",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_healthDID",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "_uri",
                  type: "string",
                },
              ],
              name: "registerDID",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_peerAddress",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "_healthDid",
                  type: "string",
                },
              ],
              name: "removeDelegateAddress",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "did",
                  type: "string",
                },
              ],
              name: "resolveChainId",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_source",
                  type: "string",
                },
              ],
              name: "stringToBytes32",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "_result",
                  type: "bytes32",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_newAddress",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "_healthDid",
                  type: "string",
                },
              ],
              name: "transferOwnership",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_healthDid",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "_uri",
                  type: "string",
                },
              ],
              name: "updateDIDData",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        YourContract: {
          address: "0xF39F0861083e6B10BAe5Fa915B40c355b057fB09",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_owner",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "greetingSetter",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "string",
                  name: "newGreeting",
                  type: "string",
                },
                {
                  indexed: false,
                  internalType: "bool",
                  name: "premium",
                  type: "bool",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "value",
                  type: "uint256",
                },
              ],
              name: "GreetingChange",
              type: "event",
            },
            {
              inputs: [],
              name: "greeting",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "premium",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_newGreeting",
                  type: "string",
                },
              ],
              name: "setGreeting",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [],
              name: "totalCounter",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "userGreetingCounter",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "withdraw",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              stateMutability: "payable",
              type: "receive",
            },
          ],
        },
      },
    },
  ],
  31337: [
    {
      chainId: "31337",
      name: "localhost",
      contracts: {
        HealthDIDRegistry: {
          address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
          abi: [
            {
              inputs: [],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_healthDid",
                  type: "string",
                },
                {
                  internalType: "string[]",
                  name: "_uris",
                  type: "string[]",
                },
              ],
              name: "addAltData",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_peerAddress",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "_healthDid",
                  type: "string",
                },
              ],
              name: "addDelegateAddress",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "addressDidMapping",
              outputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "healthDid",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "ipfsUri",
                  type: "string",
                },
                {
                  internalType: "uint8",
                  name: "reputationScore",
                  type: "uint8",
                },
                {
                  internalType: "bool",
                  name: "hasWorldId",
                  type: "bool",
                },
                {
                  internalType: "bool",
                  name: "hasPolygonId",
                  type: "bool",
                },
                {
                  internalType: "bool",
                  name: "hasSocialId",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              name: "delegateAddresses",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "getChainID",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_healthDid",
                  type: "string",
                },
              ],
              name: "getHealtDID",
              outputs: [
                {
                  components: [
                    {
                      internalType: "address",
                      name: "owner",
                      type: "address",
                    },
                    {
                      internalType: "address[]",
                      name: "delegateAddresses",
                      type: "address[]",
                    },
                    {
                      internalType: "string",
                      name: "healthDid",
                      type: "string",
                    },
                    {
                      internalType: "string",
                      name: "ipfsUri",
                      type: "string",
                    },
                    {
                      internalType: "string[]",
                      name: "altIpfsUris",
                      type: "string[]",
                    },
                    {
                      internalType: "uint8",
                      name: "reputationScore",
                      type: "uint8",
                    },
                    {
                      internalType: "bool",
                      name: "hasWorldId",
                      type: "bool",
                    },
                    {
                      internalType: "bool",
                      name: "hasPolygonId",
                      type: "bool",
                    },
                    {
                      internalType: "bool",
                      name: "hasSocialId",
                      type: "bool",
                    },
                  ],
                  internalType: "struct Structs.HealthDID",
                  name: "",
                  type: "tuple",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_healthDID",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "_uri",
                  type: "string",
                },
              ],
              name: "registerDID",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_peerAddress",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "_healthDid",
                  type: "string",
                },
              ],
              name: "removeDelegateAddress",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "did",
                  type: "string",
                },
              ],
              name: "resolveChainId",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_source",
                  type: "string",
                },
              ],
              name: "stringToBytes32",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "_result",
                  type: "bytes32",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_newAddress",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "_healthDid",
                  type: "string",
                },
              ],
              name: "transferOwnership",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_healthDid",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "_uri",
                  type: "string",
                },
              ],
              name: "updateDIDData",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        YourContract: {
          address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_owner",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "greetingSetter",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "string",
                  name: "newGreeting",
                  type: "string",
                },
                {
                  indexed: false,
                  internalType: "bool",
                  name: "premium",
                  type: "bool",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "value",
                  type: "uint256",
                },
              ],
              name: "GreetingChange",
              type: "event",
            },
            {
              inputs: [],
              name: "greeting",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "premium",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_newGreeting",
                  type: "string",
                },
              ],
              name: "setGreeting",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [],
              name: "totalCounter",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "userGreetingCounter",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "withdraw",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              stateMutability: "payable",
              type: "receive",
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
