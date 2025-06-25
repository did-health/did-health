// ChatAndSearch.tsx - DAO Member Messaging with Inbox, ACC, and Storage Integration
import React, { useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { Client as XmtpClient, Stream } from '@xmtp/xmtp-js';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LIT_NETWORK } from '@lit-protocol/constants';
import { gql, request } from 'graphql-request';
import axios from 'axios';
import { SetupStorage } from '../SetupStorage';
import ConnectWallet from '../eth/WalletConnectETH';
import { ConnectLit } from '../lit/ConnectLit';
import deployedContracts from '../../generated/deployedContracts';
import { useOnboardingState } from '../../store/OnboardingState';
import { encryptFHIRFile } from '../../lib/litEncryptFile';
import { storeEncryptedFileByHash } from '../../lib/storeFIleWeb3';
import { resolveDidHealthAcrossChains } from '../../lib/DIDDocument';
import { storePlainFHIRFile } from '../../lib/storeFIleWeb3'

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

export default function ChatAndSearch() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

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
        const lit = new LitNodeClient({ litNetwork: LIT_NETWORK.DatilTest });
        await lit.connect();
        setLitClient(lit);
        setLitConnected(true);
      }

      if (!xmtpClient) {
        const client = await XmtpClient.create({
          getAddress: async () => walletClient.account.address,
          signMessage: async (message) => {
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
        const dao = deployedContracts.testnet[chain]?.DidHealthDAO;
        if (!dao?.graphRpcUrl) continue;
        try {
          const res = await request(dao.graphRpcUrl, DAO_QUERY);
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

  /**
 * Extracts chainId from a DID:health string.
 * Returns chainId as number or null if not found or invalid format.
 */
function getChainIdFromDid(did: string): number | null {
  try {
    console.log(did)
    const parts = did.split(':');
    // Expecting format: did:health:<chainNamespace>:<chainId>:<rest>
    console.log(parts.length)
    if (parts.length < 4) return null;

    const chainIdStr = parts[2]; // parts[0] = 'did', parts[1] = 'health', parts[2] = chainNamespace, parts[3] = chainId
    console.log(chainIdStr)
    const chainId = Number(chainIdStr);
    if (isNaN(chainId)) return null;
    return chainId;
  } catch {
    return null;
  }
}

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
    console.log(xmtpClient);
    console.log(litClient);
    console.log(email)
    console.log(web3SpaceDid)
    setStatus('❌ Missing Lit, Web3 state, omail , or access control');
    //return;
  }

  setStatus('🔍 Resolving recipient DID...');

  try {
    // Extract chainId from the DID or identify chain before resolve
    // Assuming you have a function getChainIdFromDid(did) that returns the chainId number
    console.log(recipientDid)
    const chainIdFromDid = getChainIdFromDid(recipientDid);
    if (!chainIdFromDid) throw new Error('Chain ID could not be determined from DID');

    // Find matching chain key from deployedContracts for the chainId
    const chains = Object.keys(deployedContracts.testnet) as (keyof typeof deployedContracts.testnet)[];
    const matchingChain = chains.find((chain) => {
      const contract = deployedContracts.testnet[chain]?.HealthDIDRegistry;
      return contract && Number(contract.chainId) === Number(chainIdFromDid);
    });

    if (!matchingChain) throw new Error(`No contract found for chainId ${chainIdFromDid}`);

    // Resolve DID only on the matching chain
    const result = await resolveDidHealthAcrossChains(recipientDid, matchingChain); // Pass chain param to resolver to restrict search

    if (!result?.doc?.controller) throw new Error('DID not found or invalid');

    const wallet = result.doc.controller;

    // Proceed with XMTP conversation etc. (rest of your original logic)...

    const conv = await xmtpClient.conversations.newConversation(wallet);
    setConversation(conv);

    // Build your FHIR bundle as before
    const bundle = {
      resourceType: 'Bundle',
      type: 'message',
      entry: [
        {
          resource: {
            resourceType: 'MessageHeader',
            eventCoding: { system: 'http://hl7.org/fhir/message-events', code: 'communication-request' },
            source: { name: 'DID:Health dApp', endpoint: walletAddress },
            destination: [{ endpoint: wallet }],
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

    // Encrypt the bundle and upload as before...
    const blob = new Blob([JSON.stringify(bundle)], { type: 'application/json' });
    setStatus('🔐 Encrypting...');
    const { encryptedJSON, hash } = await encryptFHIRFile({
      file: blob,
      litClient,
      chain: matchingChain,
      accessControlConditions,
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
  } catch (err) {
    console.error(err);
    setStatus('❌ Failed to resolve or send');
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
        <SetupStorage />
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
