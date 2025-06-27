// ChatAndSearch.tsx - DAO Member Messaging with Inbox, ACC, and Storage Integration
import React, { useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { Client as XmtpClient } from '@xmtp/xmtp-js';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ConnectLit } from '../lit/ConnectLit';
import { ConnectWallet } from '../eth/WalletConnectETH';
import { SetupStorage } from '../SetupStorage';
import { useOnboardingState } from '../../store/OnboardingState';
import { request, gql } from 'graphql-request';
import axios from 'axios';
import deployedContracts from '../../generated/deployedContracts';
import type { DeployedContracts } from '../../types/contracts';
import { encryptFHIRFile } from '../../lib/litEncryptFile';
import { storeEncryptedFileByHash } from '../../lib/storeFIleWeb3';
import { resolveDidHealthByDidNameAcrossChains } from '../../lib/DIDDocument';
import { LitNodeClient } from '@lit-protocol/lit-node-client';

const DAO_QUERY = gql`
  query {
    daoRegistereds(first: 1000) {
      id
      ipfsUri
      did
    }
  }
`;

type FhirResource = {
  resourceType: string;
  name?: { text?: string }[];
  address?: { postalCode?: string }[];
  specialty?: { coding?: { display?: string }[] }[];
};

type DAOEntry = {
  fhir: FhirResource;
  did: string;
  ipfsUri: string;
  chain: string;
};

interface DaoRegistered {
  did: string;
  ipfsUri: string;
}

interface GraphResponse {
  daoRegistereds: DaoRegistered[];
}

export default function ChatAndSearch() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [storageReady, setStorageReady] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const toggleConfig = () => setIsConfigOpen(!isConfigOpen);

  const {
    walletAddress,
    setWalletAddress,
    litClient,
    setLitClient,
    litConnected,
    setLitConnected,
    email,
    web3SpaceDid,
    accessControlConditions,
    setAccessControlConditions,
    w3upClient,
  } = useOnboardingState();

  const [xmtpClient, setXmtpClient] = useState<XmtpClient | null>(null);
  const [conversation, setConversation] = useState<any>(null);
  const [inbox, setInbox] = useState<any[]>([]);
  const [recipientDid, setRecipientDid] = useState('');
  const [messageText, setMessageText] = useState('');
  const [status, setStatus] = useState('');
  const [entries, setEntries] = useState<DAOEntry[]>([]);
  const [filtered, setFiltered] = useState<DAOEntry[]>([]);
  const [filters, setFilters] = useState({ name: '', zip: '', specialty: '' });

  useEffect(() => {
    const init = async () => {
      if (!walletClient || !isConnected || !address) return;
      setWalletAddress(address);

      if (!litConnected || !litClient) {
        const lit = new LitNodeClient({ litNetwork: 'datil-test' });
        await lit.connect();
        setLitClient(lit);
        setLitConnected(true);
      }

      if (!xmtpClient) {
        const client = await XmtpClient.create({
          getAddress: async () => walletClient.account.address,
          signMessage: async (message: string | Uint8Array) => {
            const msg = typeof message === 'string' ? message : new TextDecoder().decode(message);
            return walletClient.signMessage({ account: walletClient.account, message: msg });
          },
        });
        setXmtpClient(client);

        const convs = await client.conversations.list();
        const allMessages = [];
        for (const conv of convs) {
          const messages = await conv.messages();
          allMessages.push(...messages.map((msg) => ({ from: msg.senderAddress, content: msg.content })));
        }
        setInbox(allMessages);
      }
    };
    init();
  }, [walletClient, isConnected]);

  useEffect(() => {
    const fetchData = async () => {
      const allResults: DAOEntry[] = [];
      const chains = Object.keys(deployedContracts.testnet) as (keyof typeof deployedContracts.testnet)[];
      for (const chain of chains) {
        const dao = (deployedContracts as unknown as DeployedContracts).testnet[chain]?.DidHealthDAO;
        if (!dao?.graphRpcUrl) continue;
        try {
          const res = await request<GraphResponse>(dao.graphRpcUrl, DAO_QUERY);
          for (const entry of res.daoRegistereds) {
            try {
              const ipfsUrl = entry.ipfsUri.replace('ipfs://', 'https://w3s.link/ipfs/');
              const fhirRes = await axios.get(ipfsUrl);
              const resource = fhirRes.data;
              if (["Practitioner", "Organization"].includes(resource.resourceType)) {
                allResults.push({ fhir: resource, did: entry.did, ipfsUri: entry.ipfsUri, chain });
              }
            } catch {}
          }
        } catch {}
      }
      setEntries(allResults);
      setFiltered(allResults);
    };
    fetchData();
  }, []);

  const getChainIdFromDid = (did: string): number | null => {
    try {
      const parts = did.split(':');
      if (parts.length < 4) return null;
      const chainIdStr = parts[2];
      const chainId = Number(chainIdStr);
      return isNaN(chainId) ? null : chainId;
    } catch {
      return null;
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value.toLowerCase() };
    setFilters(updated);
    const matches = entries.filter(({ fhir }) => {
      const nameMatch = fhir.name?.[0]?.text?.toLowerCase().includes(updated.name);
      const zipMatch = fhir.address?.[0]?.postalCode?.toLowerCase().includes(updated.zip);
      const specialtyMatch = fhir.specialty?.[0]?.coding?.[0]?.display?.toLowerCase().includes(updated.specialty);
      return (!updated.name || nameMatch) && (!updated.zip || zipMatch) && (!updated.specialty || specialtyMatch);
    });
    setFiltered(matches);
  };

const handleSend = async () => {
  if (!xmtpClient || !litClient || !email || !web3SpaceDid || !accessControlConditions) {
    setStatus('❌ Missing Lit, Web3 state, email, or access control');
    //return;
  }

  setStatus('🔍 Resolving recipient DID...');

  try {
    let didResult;
    let recipientWallet;

    try {
      // Extract chainId and didName from the DID
      const didParts = recipientDid.split(':');
      if (didParts.length !== 4 || didParts[0] !== 'did' || didParts[1] !== 'health') {
        throw new Error('Invalid DID format. Expected: did:health:<chainId>:<didName>');
      }

      const chainId = parseInt(didParts[2], 10);
      if (isNaN(chainId)) {
        throw new Error('Invalid chainId in DID');
      }

      const didName = didParts[3];
      console.log(`Resolving DID: chainId=${chainId}, didName=${didName}`);

      didResult = await resolveDidHealthByDidNameAcrossChains(recipientDid);
      
      if (!didResult?.doc?.controller) {
        throw new Error('DID not found or invalid');
      }

      recipientWallet = didResult.doc.controller;
      console.log(`Successfully resolved DID. Recipient wallet: ${recipientWallet}`);

    } catch (error: unknown) {
      console.error('DID resolution error:', error);
      throw new Error(`Failed to resolve DID: ${error instanceof Error ? error.message : String(error)}`);
    }

    recipientWallet = didResult.doc.controller;

    // Begin XMTP conversation
    if (!xmtpClient) {
      throw new Error('XMTP client not initialized');
    }
    const conv = await xmtpClient.conversations.newConversation(recipientWallet);
    setConversation(conv);

    // Construct FHIR bundle
    const bundle = {
      resourceType: 'Bundle',
      type: 'message',
      entry: [
        {
          resource: {
            resourceType: 'MessageHeader',
            eventCoding: { system: 'http://hl7.org/fhir/message-events', code: 'communication-request' },
            source: { name: 'DID:Health dApp', endpoint: walletAddress },
            destination: [{ endpoint: recipientWallet }],
            focus: [{ reference: 'Communication/1' }],
          },
        },
        {
          resource: {
            resourceType: 'Communication',
            status: 'completed',
            sender: { reference: `Patient/${walletAddress}` },
            recipient: [{ reference: `Practitioner/${recipientDid}` }],
            payload: [{ contentString: messageText }],
          },
        },
      ],
    };

    // Encrypt and upload
    const blob = new Blob([JSON.stringify(bundle)], { type: 'application/json' });
    setStatus('🔐 Encrypting...');
    if (!litClient) {
      throw new Error('Lit client is not initialized');
    }
    // Create access control conditions that allow both sender and recipient
    const recipientConditions = [
      {
        conditionType: "evmAddress",
        contractAddress: "",
        functionName: "",
        functionParams: {},
        returnValueTest: {
          comparator: "=",
          value: recipientWallet
        }
      }
    ];

    // Combine sender's conditions with recipient's conditions
    const combinedConditions = [...accessControlConditions, ...recipientConditions];

    const { encryptedJSON, hash } = await encryptFHIRFile({
      file: blob,
      litClient: litClient,
      chain: didResult.chainName,
      accessControlConditions: combinedConditions,
    });

    const fileHash = `0x${hash}`;
    setStatus('📦 Uploading to Web3...');
    const ipfsUri = await storeEncryptedFileByHash(
      new Blob([JSON.stringify(encryptedJSON)]),
      fileHash,
      'Bundle'
    );

    setStatus('📨 Sending via XMTP...');
    await conv.send(JSON.stringify({ ipfsUri, litHash: fileHash, resourceType: 'Bundle' }));

    setStatus('✅ Sent');
  } catch (err: any) {
    console.error(err);
    setStatus(`❌ Failed to resolve or send: ${err.message}`);
  }
};


  return (
    <div className="grid md:grid-cols-2 gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">🩺 DAO Member Directory</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input className="input" name="name" placeholder="Name" onChange={handleFilterChange} />
          <input className="input" name="zip" placeholder="ZIP Code" onChange={handleFilterChange} />
          <input className="input" name="specialty" placeholder="Specialty" onChange={handleFilterChange} />
        </div>
        <ul className="space-y-4">
          {filtered.map((entry, index) => (
            <li key={index} className="p-4 border rounded shadow">
              <p><strong>DID:</strong> {entry.did}</p>
              <p><strong>Name:</strong> {entry.fhir.name?.[0]?.text || 'N/A'}</p>
              <p><strong>ZIP:</strong> {entry.fhir.address?.[0]?.postalCode || 'N/A'}</p>
              <p><strong>Specialty:</strong> {entry.fhir.specialty?.[0]?.coding?.[0]?.display || 'N/A'}</p>
              <button className="text-blue-600 underline mt-2" onClick={() => setRecipientDid(entry.did)}>Message</button>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">📥 Inbox</h2>
          {inbox.map((msg, i) => (
            <div key={i} className="border rounded p-2 text-sm">
              <p><strong>From:</strong> {msg.from}</p>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <ConnectWallet />
        <SetupStorage onReady={setStorageReady} />
        <ConnectLit />
        <h2 className="text-xl font-bold mb-4">💬 Chat</h2>
        {!isConnected && <ConnectButton showBalance={false} />}
        <input className="input" placeholder="DID:Health of recipient" value={recipientDid} onChange={(e) => setRecipientDid(e.target.value)} />
        <textarea className="input h-32 mt-2" placeholder="Message" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
        <button className="btn btn-primary mt-2 w-full" onClick={handleSend}>Send</button>
        {status && <p className="text-sm mt-2 text-gray-600">{status}</p>}
      </div>
    </div>
  );
}
