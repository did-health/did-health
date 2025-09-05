# did:health - Decentralized Identity for Healthcare

[![GitHub license](https://img.shields.io/github/license/did-health/did-health)](LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/did-health/did-health)](https://github.com/did-health/did-health/issues)
[![GitHub stars](https://img.shields.io/github/stars/did-health/did-health)](https://github.com/did-health/did-health/stargazers)

## Overview

did:health is a cutting-edge decentralized identity solution designed specifically for the healthcare industry. Built on W3C DID standards, it provides a secure, privacy-preserving infrastructure for managing healthcare data and identity verification. The platform leverages blockchain technology and IPFS to create a tamper-proof, decentralized ecosystem for healthcare data management.

## Key Features

### Decentralized Identity Management
- **W3C DID Compliance**: Fully compliant with W3C Decentralized Identifier specifications
- **Multi-Chain Support**: Supports Bitcoin, Ethereum, and EVM-compatible chains
- **Bitcoin Integration**: Native support for BTC wallet-based DIDs
- **User-Centric Control**: Complete user control over identity and associated healthcare data

### Healthcare Data Integration
- **FHIR Standard Support**: Full integration with Fast Healthcare Interoperability Resources (FHIR) standards that works with all Electronic Health Record (EHR) systems
- **IPFS Storage**: Decentralized and tamper-proof storage of healthcare data
- **Cross-Chain Compatibility**: Seamless data flow across different blockchain networks
- **Multi-Language Support**: Comprehensive localization support for healthcare resources

### Technical Architecture
- **Frontend**: React-based user interface with modern UI/UX design
- **Blockchain Integration**: 
  - Bitcoin (BTC)
  - Ethereum (ETH)
  - EVM-compatible chains
  - Coming soon: Solana, Cosmos
- **Data Storage**: IPFS for immutable healthcare data storage
- **Cryptography**: Secure identity verification using ECDSA and threshold cryptography
- **Lit Protocol**: Integration for encrypted FHIR data access

## Components

### Core Components
- **DID Document**: The central component stored on IPFS
  - Contains FHIR endpoints and access control metadata
  - Acts as a resolver for all DID-related FHIR resources
  - Immutable storage of healthcare data references
  - QR code generation for easy data access

### Blockchain Implementations
- **Bitcoin (BTC)**:
  - Ordinals inscriptions for DID registration
  - Immutable storage of DID metadata
  - Bitcoin wallet-based identity verification
  - Native DID format support: `did:health:btc:<wallet>`

- **Ethereum (ETH)**:
  - Solidity-based Health DID Registry contract
  - Smart contract verification of DID ownership
  - ENS integration for human-readable DIDs
  - DID format: `did:health:<chainId>:<name>`

### Healthcare DAO
- **Practitioner & Organization Access**:
  - DAO membership for healthcare professionals
  - Organization verification through DID
  - Role-based access control
  - Reputation scoring system

### EHR Integration Features
- **QR Code Scanner**:
  - DID document QR code generation
  - Secure scanning of patient DIDs
  - Quick access to FHIR endpoints
  - Zero-knowledge proof verification

- **Secure Messaging Integration**:
  - Quick permission requests via QR scan
  - Access control condition requests
  - Secure message-based permission workflows
  - Audit trail of access requests



### Technical Stack
- **Frontend**: React, TypeScript
- **Blockchain**: 
  - Bitcoin (BTC) - Native DID support
  - Ethereum (ETH) - Mainnet and testnets
  - Polygon (MATIC) - Mainnet and testnets
  - Gnosis Chain - Mainnet and testnets
  - Arbitrum - Mainnet and testnets
  - Scroll - Mainnet and testnets
  - Coming soon: Solana and Cosmos integration
- **Storage**: IPFS
- **Cryptography**: ECDSA, Threshold Cryptography
- **Localization**: JSON-based multi-language support

## Lit Protocol Integration

### Data Encryption and Access Control
- **End-to-End Encryption**: All FHIR resources are encrypted using Lit Protocol's threshold cryptography
- **Access Control**: Fine-grained access control through Lit Access Control Lists (ACLs)
  - DID-based access control
  - Role-based access control
  - Time-based access control
- **Decentralized Key Management**: Secure key management using threshold cryptography
- **Multi-Party Computation**: Secure decryption requires collaboration between multiple parties
- **Zero-Knowledge Proofs**: Verifies access rights without revealing sensitive information

### Access Control Features
- **Healthcare Provider Access**: Secure sharing of medical records with authorized providers
- **Patient Control**: Patients maintain full control over their data access
- **Audit Logging**: Comprehensive logs of all access attempts and successful decryptions
- **Revocation**: Ability to revoke access at any time
- **Time-Limited Access**: Temporary access grants for specific time periods

### Secure Messaging (XMTP + Lit + IPFS)
- **End-to-End Encryption**: 
  - XMTP for secure messaging transport
  - Lit Protocol for message encryption and access control
  - IPFS for decentralized message storage
- **Secure Communication Flow**:
  - Messages encrypted with Lit Protocol before storage
  - Stored on IPFS for decentralized persistence
  - Sent via XMTP for secure delivery
- **Access Control**:
  - Lit Protocol ACLs for message access
  - DID-based authentication
  - Role-based access control
- **Security Features**:
  - Zero-knowledge proofs for access verification
  - Multi-party computation for decryption
  - Audit trail of message access
- **Decentralized Storage**:
  - IPFS for immutable message storage
  - Content-addressable message retrieval
  - Tamper-proof message history

## Installation

```bash
# Clone the repository
git clone https://github.com/did-health/did-health.git

cd did-health

# Install dependencies
yarn install

# Build the project
yarn build

# Start the development server
yarn dev
```

## Usage

1. **DID Resolution**:
   - Support for multiple DID formats:
     - Bitcoin: `did:health:btc:<wallet>`
     - EVM chains: `did:health:<chainId>:<name>`
   - Real-time DID verification and resolution
   - View associated healthcare data and credentials
   - Verify identity ownership and reputation

2. **FHIR Resource Management**:
   - Store and retrieve healthcare data in FHIR format
   - Encrypted data access through Lit Protocol
   - View and manage healthcare resources through IPFS
   - Access localized healthcare information

3. **Blockchain Integration**:
   - Connect to supported blockchain networks
   - Perform secure identity operations
   - Manage healthcare data transactions
   - Coming soon: Solana and Cosmos integration

## Supported Blockchains

- **Ethereum**: Mainnet and testnets
- **Polygon**: Mainnet and testnets
- **Gnosis Chain**: Mainnet and testnets
- **Arbitrum**: Mainnet and testnets
- **Scroll**: Mainnet and testnets

## Technical Details

### DID Resolution Mechanism
- Uses first two hex characters after did:health: to identify blockchain
- Dynamic resolver system for cross-chain compatibility
- Secure identity verification using ECDSA
- IPFS integration for data storage

### FHIR Integration
- Full support for FHIR R4 standard
- IPFS-based storage for FHIR resources
- Multi-language support for healthcare resources
- Secure data access and management

## Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide for more details on how to get started.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Support

For support, please:
- Open an issue in the GitHub repository
- Join our community discussion channels
- Review our documentation and examples

## Security

If you discover any security vulnerabilities, please contact our security team directly.

## Acknowledgments

- Special thanks to the W3C DID Working Group
- Acknowledgment to the healthcare interoperability community
- Recognition to our contributors and supporters

## Contact

For more information, please contact:
- Email: [contact@did-health.org](mailto:contact@did-health.org)
- Website: [did-health.org](https://did-health.org)

