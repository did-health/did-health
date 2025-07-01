// ChatPanel.tsx
import React, { useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { JsonRpcProvider } from 'ethers';
import { useXmtp } from '../../hooks/useXmtp';
import type { MultipleAccessControlConditions } from '@lit-protocol/types';
import { createFHIRMessageBundle } from '../fhir/MessageBundle';
import { Favorites } from './Favorites';
import type { ILitNodeClient } from '@lit-protocol/types';
import deployedContracts from '../../generated/deployedContracts';
import { encryptFHIRFile } from '../../lib/litEncryptFile';
import { storeEncryptedFileByHash } from '../../lib/storeFIleWeb3';
import type { FavoritesRef } from './Favorites';
import { createMessageAccessControlConditions } from './MessageAccessControl';
import { validateAccessControlConditionsSchema } from '@lit-protocol/access-control-conditions';
import { getLitChainByChainId } from '../../lib/getChains';
import logo from '../../assets/did-health.png'
import { ConnectLit } from '../lit/ConnectLit';
import { Client, type Identifier } from '@xmtp/browser-sdk';
import type { AccessControlConditions } from '@lit-protocol/types';
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
    web3SpaceDid: string | null;
    chainId: number | null;
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
    chainId,
}: ChatPanelProps) {
    const favoritesRef = useRef<FavoritesRef>(null);
    const { xmtpClient, initXmtp, error: xmtpError } = useXmtp({
      address: walletAddress,
      walletClient: chainId ? deployedContracts['testnet'].arbitrumSepolia.DidHealthDAO.rpcUrl : '',
      isConnected: isConnected
    });

    useEffect(() => {
        if (isConnected && !xmtpClient && walletAddress && chainId) {
            initXmtp().catch((err: any) => {
                console.error('Failed to initialize XMTP:', err);
                setStatus(`❌ XMTP Error: ${err.message || 'Failed to initialize'}`);
            });
        }
    }, [isConnected, initXmtp, xmtpClient, walletAddress, chainId]);

    if (!xmtpClient) {
        return (
            <div className="p-4 text-center">
                <div className="text-yellow-600 mb-2">
                    Initializing XMTP...
                </div>
                {xmtpError && (
                    <div className="text-red-600">
                        Error: {xmtpError}
                    </div>
                )}
            </div>
        );
    }

    const sendMessage = async () => {
        try {
            const env = 'testnet' // or 'mainnet'
            if (!recipientDid) throw new Error('Please select a recipient');
            if (!walletAddress) throw new Error('Please connect your wallet');
            if (!xmtpClient) throw new Error('XMTP client not initialized');
            if (!litClient) throw new Error('Please wait for Lit Protocol initialization');
            
            const { chainId, lookupKey } = parseDidHealth(recipientDid);
            
            // Add recipient to favorites
            favoritesRef.current?.addFavorite(recipientDid);

            // Get recipient wallet address from DID
            console.log('🔍 Starting DID initialization process');
            console.log('Environment:', env);
            
            const network = deployedContracts[env as keyof typeof deployedContracts];
            if (!network) {
                throw new Error(`❌ Network not found for env ${env}`);
            }

            const registryEntry = network[chainId.toString() as keyof typeof network]?.HealthDIDRegistry;
            if (!registryEntry) {
                throw new Error(`❌ No HealthDIDRegistry deployed for chain ${chainId}`);
            }

            console.log('Using RPC URL:', registryEntry.rpcUrl);
            console.log('Using contract address:', registryEntry.address);

            const provider = new JsonRpcProvider(registryEntry.rpcUrl);
            console.log('Created provider instance');

            try {
                const signer = await provider.getSigner();
                console.log('Got signer instance');
                
                const wallet = await signer.getAddress();
                console.log('Got wallet address:', wallet);
 
                const contract = new ethers.Contract(registryEntry.address, registryEntry.abi, provider)
                const data = await contract.getHealthDID(lookupKey)

                if (!data || data.owner === ethers.ZeroAddress) {
                    throw new Error(`❌ DID "${lookupKey}" not found on chain ${chainId}`)
      }
                console.log('Got DID owner data:', data);
                
                if (!data || data.owner === ethers.ZeroAddress) {
                    throw new Error(`❌ DID not found on chain ${chainId}`);
                }
                const recipientWallet = data.owner;
                console.log('Recipient wallet:', recipientWallet);
                
                return { wallet, recipientWallet };
            } catch (error) {
                console.error('❌ Initialization error:', error);
                throw error;
            }

        } catch (err: any) {
            console.error('❌ Initialization error:', err);
            throw err;
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
            <ConnectLit />
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
