# did:health - Decentralized Identity for Healthcare
did:health is a W3C-compliant Decentralized Identifier (DID) solution tailored for the healthcare sector. It leverages state-of-the-art decentralized cryptography for identity-based encryption and signing of healthcare data, ensuring maximum security and user control.

## Table of Contents
Features
Installation
Usage
Supported Blockchains
Hacky Solutions Worth Mentioning
Contributing
License

## Features
- Decentralized ECDSA Cryptography: Utilizes the LIT Protocol for decentralized threshold cryptography.
- Chain Agnostic Resolver: Uses the first two hex characters after did:health: to identify the associated blockchain that th DID is registered on.
- User Control: Empowers users with full control over their identity and associated healthcare data.
- IPFS Data Storage: All healthcare data is stored in standard Fast Healthcare Interoperability Resources (FHIR) format on the InterPlanetary File System (IPFS) for decentralized and tamper-proof storage.  The IPFS data is linked to your DID Document as a FHIR API service.
- React Java Script and DAPP (100# client side and private)
- Installation
```
git clone https://github.com/your-org/did-health.git
cd did-health
yarn install
yarn build
yarn run dev
```
## Usage
Detailed usage instructions, API documentation, and examples can be found in the docs directory.

## Supported Blockchains
- Ethereum
- Polygon
- Gnosis
- Arbitrum
- Scroll

## Hacky Solutions Worth Mentioning
- Dynamic Resolver with Hex Identifiers: Efficiently determines the chain on which the DID is anchored using the first two hex characters after did:health:.
- Cross-Chain Bridges: Ensures seamless data flow between different blockchains.
- Dynamic Chain Selection: Optimally selects the blockchain for transactions based on network conditions and user preferences.

## Contributing
We welcome contributions from the community! Please read our CONTRIBUTING.md guide for more details on how to get started.

## License
This project is licensed under the MIT License. See LICENSE for details.

