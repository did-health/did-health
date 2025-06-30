// ChatPanel.tsx
import React, { useEffect, useCallback, useRef } from 'react';
import { ethers, JsonRpcProvider } from 'ethers';
import type { ethers as ethersTypes } from 'ethers';
import { useAccount } from 'wagmi';
import { ContentTypeId } from '@xmtp/wasm-bindings';
import { useXmtp } from '../../hooks/useXmtp';
import { createFHIRMessageBundle } from '../fhir/MessageBundle';
import { Favorites } from './Favorites';
import type { ILitNodeClient } from '@lit-protocol/types';
import type { DeployedContracts } from '../../types/contracts';
import type { ContractInfo } from '../../types/contracts';
import type { NetworkConfig } from '../../types/network';
import deployedContracts from '../../generated/deployedContracts';
import { encryptFHIRFile } from '../../lib/litEncryptFile';
import { storeEncryptedFileByHash } from '../../lib/storeFIleWeb3';
import type { FavoritesRef } from './Favorites';
import { createMessageAccessControlConditions } from './MessageAccessControl';
import type { LitAccessControlCondition } from './MessageAccessControl';
import logo from '../../assets/did-health.png'
interface ChatPanelProps {
    isConnected: boolean;
    recipientDid: string | null;
    setRecipientDid: (did: string | null) => void;
    messageText: string;
    setMessageText: (text: string) => void;
    status: string;
    setStatus: (status: string) => void;
    walletAddress: string | null;
    litClient: ILitNodeClient | null;
    email: string;
    web3SpaceDid: string;
}

interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
    decrypted: boolean;
    decryptedContent?: any;
}

function parseDidHealth(did: string): { chainId: number; lookupKey: string } {
  const parts = did.trim().split(':');
  if (parts.length !== 4 || parts[0] !== 'did' || parts[1] !== 'health') {
    throw new Error('❌ Invalid DID format. Use: did:health:<chainId>:<name>');
  }
  const chainId = parseInt(parts[2], 10);
  if (isNaN(chainId)) throw new Error(`❌ Invalid chain ID: ${parts[2]}`);
  return {
    chainId,
    lookupKey: `${chainId}:${parts[3]}`,
  };
}

export function ChatPanel({
    isConnected,
    recipientDid,
    setRecipientDid,
    messageText,
    setMessageText,
    status,
    setStatus,
    walletAddress,
    litClient,
    email,
    web3SpaceDid,
}: ChatPanelProps) {
    const { xmtpClient, initXmtp } = useXmtp();
    const favoritesRef = useRef<FavoritesRef>(null);

    useEffect(() => {
        if (isConnected) initXmtp();
    }, [isConnected, initXmtp]);

    const getAccessControlConditions = useCallback(
        (recipientWallet: string): LitAccessControlCondition[] => {
            if (!walletAddress) throw new Error('Sender wallet address not available');
            return createMessageAccessControlConditions(walletAddress, recipientWallet);
        },
        [walletAddress],
    );

    const sendMessage = async () => {
        try {
            if (!recipientDid || !walletAddress || !xmtpClient) throw new Error('Missing required information');
            const { chainId, lookupKey } = parseDidHealth(recipientDid);

            favoritesRef.current?.addFavorite(recipientDid);

            const env = 'testnet' // or 'mainnet'
            const registryEntry = Object.values(deployedContracts[env]).find(
                (net: any) => net.HealthDIDRegistry?.chainId === chainId
            )?.HealthDIDRegistry

            if (!registryEntry) {
                throw new Error(`❌ No HealthDIDRegistry deployed for chain ${chainId}`)
            }

            const provider = new JsonRpcProvider(registryEntry.rpcUrl)
            const contract = new ethers.Contract(registryEntry.address, registryEntry.abi, provider)
            const data = await contract.getHealthDID(lookupKey)
            if (!data || data.owner === ethers.ZeroAddress) {
                throw new Error(`❌ DID "${didKey}" not found on chain ${chainId}`)
            }
            const recipientWallet = data.owner;

            if (!ethers.isAddress(recipientWallet)) {
                throw new Error('Invalid recipient wallet address');
            }

            if (recipientWallet.toLowerCase() === walletAddress.toLowerCase()) {
                throw new Error('❌ Self messaging is not supported');
            }


            const conv = await xmtpClient.conversations.newConversation(recipientWallet);

            const senderDid = `did:health:${chainId}:${walletAddress}`;
            const bundle = createFHIRMessageBundle(senderDid, recipientDid, messageText);

            setStatus('🔐 Encrypting...');
            const blob = new Blob([JSON.stringify(bundle)], { type: 'application/json' });
            const accessControlConditions = getAccessControlConditions(recipientWallet);
            const { encryptedJSON } = await encryptFHIRFile({
                file: blob,
                litClient,
                chain: chainId.toString(),
                accessControlConditions
            } as any);
            const encryptedBlob = new Blob([encryptedJSON], { type: 'application/json' });

            setStatus('📦 Storing...');
            const url = await storeEncryptedFileByHash(encryptedBlob, recipientWallet, 'Message');

            // Extract hash and cid from the URL (format: https://w3s.link/ipfs/{cid}/Message/{hash}.enc)
            const [, , cid, hash] = url.split('/') || ['', '', '', ''];

            setStatus('📨 Sending...');
            await conv.send(`${hash}:${cid}`, { contentType: ContentTypeId.Text });
            setMessageText('');
            setStatus('✅ Message sent!');
        } catch (err: any) {
            console.error(err);
            setStatus(`❌ Error: ${err.message || 'Unknown error occurred'}`);
        }
    };

    return (
        <div className="flex flex-col h-full w-full p-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <img src={logo} alt="DID:Health Logo" className="h-8 w-8 mr-2" />
                    <h2 className="text-2xl font-bold">Secure Chat</h2>
                </div>
            </div>
            {!isConnected && (
                <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm">Please connect your wallet to start chatting</p>
                </div>
            )}
            {!recipientDid && isConnected && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm">Please select a recipient to start chatting</p>
                </div>
            )}
            <Favorites
                ref={favoritesRef}
                onSelect={setRecipientDid}
                litClient={litClient || undefined}
            />
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient's DID:Health</label>
                <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter recipient's DID:Health (did:health:chainId:name)"
                    value={recipientDid || ''}
                    onChange={(e) => setRecipientDid(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px] resize-none"
                    placeholder="Type your message here..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                />
            </div>
            <button
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={sendMessage}
            >
                <span className="mr-2">🚀</span> Send Secure Message
            </button>
            {status && (
                <div
                    className={`p-3 rounded-lg ${status.startsWith('❌')
                            ? 'bg-red-50 text-red-700'
                            : status.startsWith('✅')
                                ? 'bg-green-50 text-green-700'
                                : 'bg-blue-50 text-blue-700'
                        } fixed inset-x-0 bottom-0 z-50 mb-4 mx-4`}
                >
                    <p className="text-sm">{status}</p>
                </div>
            )}
        </div>
    );
}
