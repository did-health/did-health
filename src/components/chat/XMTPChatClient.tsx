// ChatAndSearch.tsx
import React, { useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { Client as XmtpClient } from '@xmtp/xmtp-js';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LIT_NETWORK } from '@lit-protocol/constants';
import { checkAndSignAuthMessage } from '@lit-protocol/auth-browser';
import axios from 'axios';
import { gql, request } from 'graphql-request';

import { useOnboardingState } from '../../store/OnboardingState';
import { encryptFHIRFile } from '../../lib/litEncryptFile';
import { storeEncryptedFileByHash } from '../../lib/storeFIleWeb3';
import {
  resolveDidHealthAcrossChains,
  resolveDidHealthByDidNameAcrossChains,
} from '../../lib/DIDDocument';

const GRAPH_ENDPOINT = 'https://api.studio.thegraph.com/query/114229/didhealth/v0.0.1';
const GET_ALL_URIS = gql`
  {
    didregisteredEntities(first: 1000) {
      id
      ipfsUri
    }
  }
`;

type FhirResource = {
  resourceType: string;
  name?: { text?: string }[];
  address?: { postalCode?: string }[];
  specialty?: { coding?: { display?: string }[] }[];
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
  } = useOnboardingState();

  const [xmtpClient, setXmtpClient] = useState<XmtpClient | null>(null);
  const [conversation, setConversation] = useState<any>(null);
  const [recipientDid, setRecipientDid] = useState('');
  const [recipientWalletAddress, setRecipientWalletAddress] = useState('');
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [streamCancel, setStreamCancel] = useState<() => void>();
  const [entries, setEntries] = useState<FhirResource[]>([]);
  const [filtered, setFiltered] = useState<FhirResource[]>([]);
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
        interface XmtpCreateOptions {
          getAddress: () => Promise<string>;
          signMessage: (message: string | Uint8Array) => Promise<string>;
        }

        const client: XmtpClient = await XmtpClient.create({
          getAddress: async (): Promise<string> => walletClient.account.address,
          signMessage: async (message: string | Uint8Array): Promise<string> => {
            const msgToSign: string = typeof message === 'string' ? message : new TextDecoder().decode(message);
            return walletClient.signMessage({ account: walletClient.account, message: msgToSign });
          },
        } as XmtpCreateOptions);
        setXmtpClient(client);
      }
    };

    init();
    return () => streamCancel?.();
  }, [walletClient, isConnected]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await request(GRAPH_ENDPOINT, GET_ALL_URIS) as { didregisteredEntities: { id: string; ipfsUri: string }[] };
        const uris: string[] = data.didregisteredEntities.map((e: any) => e.ipfsUri);
        const results: FhirResource[] = [];
        for (const uri of uris) {
          try {
            const res = await axios.get(uri);
            if (['Practitioner', 'Organization'].includes(res.data.resourceType)) {
              results.push(res.data);
            }
          } catch (err) {
            console.warn(`Failed to fetch or parse: ${uri}`);
          }
        }
        setEntries(results);
        setFiltered(results);
      } catch (err) {
        console.error('Graph query failed:', err);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value.toLowerCase() };
    setFilters(updated);

    const matches = entries.filter((entry) => {
      const nameMatch = entry.name?.[0]?.text?.toLowerCase().includes(updated.name);
      const zipMatch = entry.address?.[0]?.postalCode?.toLowerCase().includes(updated.zip);
      const specialtyMatch = entry.specialty?.[0]?.coding?.[0]?.display?.toLowerCase().includes(updated.specialty);
      return (!updated.name || nameMatch) && (!updated.zip || zipMatch) && (!updated.specialty || specialtyMatch);
    });

    setFiltered(matches);
  };

  const resolveRecipient = async () => {
    let didNameOrAddress = recipientDid;
    if (recipientDid.startsWith('did:health:')) {
      const parts = recipientDid.split(':');
      didNameOrAddress = parts[parts.length - 1];
    }
    const isEthAddress = /^0x[a-fA-F0-9]{40}$/.test(didNameOrAddress);
    const result = isEthAddress
      ? await resolveDidHealthAcrossChains(didNameOrAddress)
      : await resolveDidHealthByDidNameAcrossChains(didNameOrAddress);
    if (!result?.doc?.controller) throw new Error('DID not found or invalid');
    return result.doc.controller;
  };

  const handleSend = async () => {
    if (!xmtpClient || !litClient || !email || !web3SpaceDid || !accessControlConditions) {
      setStatus('❌ Missing Lit or Web3 state');
      return;
    }

    setStatus('🔍 Resolving recipient DID...');

    try {
      const wallet = await resolveRecipient();
      setRecipientWalletAddress(wallet);
      const conv = await xmtpClient.conversations.newConversation(wallet);
      setConversation(conv);

      const communication = {
        resourceType: 'Communication',
        status: 'completed',
        sender: { reference: `Patient/${walletAddress}` },
        recipient: [{ reference: `Practitioner/${recipientDid}` }],
        payload: [{ contentString: messageText }],
      };

      const messageHeader = {
        resourceType: 'MessageHeader',
        eventCoding: { system: 'http://hl7.org/fhir/message-events', code: 'communication-request' },
        source: { name: 'DID:Health dApp', endpoint: walletAddress },
        destination: [{ endpoint: wallet }],
        focus: [{ reference: 'Communication/1' }],
      };

      const bundle = {
        resourceType: 'Bundle',
        type: 'message',
        entry: [{ resource: messageHeader }, { resource: communication }],
      };

      const blob = new Blob([JSON.stringify(bundle)], { type: 'application/json' });

      setStatus('🔐 Encrypting...');
      const { encryptedJSON, hash } = await encryptFHIRFile({
        file: blob,
        litClient,
        chain: 'ethereum',
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
        <h1 className="text-2xl font-bold mb-4">🩺 Search Providers</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input className="input" name="name" placeholder="Name" onChange={handleFilterChange} />
          <input className="input" name="zip" placeholder="ZIP Code" onChange={handleFilterChange} />
          <input className="input" name="specialty" placeholder="Specialty" onChange={handleFilterChange} />
        </div>
        <ul className="space-y-4">
          {filtered.map((entry, index) => (
            <li key={index} className="p-4 border rounded shadow">
              <p><strong>Type:</strong> {entry.resourceType}</p>
              <p><strong>Name:</strong> {entry.name?.[0]?.text || 'N/A'}</p>
              <p><strong>ZIP:</strong> {entry.address?.[0]?.postalCode || 'N/A'}</p>
              <p><strong>Specialty:</strong> {entry.specialty?.[0]?.coding?.[0]?.display || 'N/A'}</p>
              <button
                className="text-blue-600 underline mt-2"
                onClick={() => setRecipientDid(entry.name?.[0]?.text || '')}
              >
                Message
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">💬 Chat</h2>
        {!isConnected && <ConnectButton showBalance={false} />}
        <input
          className="input"
          placeholder="DID:Health of recipient"
          value={recipientDid}
          onChange={(e) => setRecipientDid(e.target.value)}
        />
        <textarea
          className="input h-32 mt-2"
          placeholder="Message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button className="btn btn-primary mt-2 w-full" onClick={handleSend}>Send</button>
        {status && <p className="text-sm mt-2 text-gray-600">{status}</p>}
      </div>
    </div>
  );
}