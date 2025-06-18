import { useEffect, useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Client as XmtpClient } from '@xmtp/xmtp-js'
import type { Conversation } from '@xmtp/xmtp-js'
import { LitNodeClient } from '@lit-protocol/lit-node-client'
import { LIT_NETWORK } from '@lit-protocol/constants'
import { checkAndSignAuthMessage } from '@lit-protocol/auth-browser'

import { useOnboardingState } from '../..//store/OnboardingState'
import { encryptFHIRFile, decryptFromLitJson } from '../../lib/litEncryptFile'
import { storeEncryptedFileByHash } from '../../lib/storeFIleWeb3'
import { resolveDidHealthAcrossChains } from '../../lib/DIDDocument'
import { resolveDidHealthByDidNameAcrossChains } from '../../lib/DIDDocument'

export default function XMTPChatClient() {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

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
  } = useOnboardingState()

  const [xmtpClient, setXmtpClient] = useState<XmtpClient | null>(null)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [recipientDid, setRecipientDid] = useState<string>('')
  const [recipientWalletAddress, setRecipientWalletAddress] = useState<string>('')
  const [messageText, setMessageText] = useState<string>('')
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [status, setStatus] = useState<string>('')
  const [streamCancel, setStreamCancel] = useState<() => void>()

  useEffect(() => {
    const init = async () => {
      if (!walletClient || !isConnected || !address) return
      setWalletAddress(address)

      if (!litConnected || !litClient) {
        const lit = new LitNodeClient({ litNetwork: LIT_NETWORK.DatilTest })
        await lit.connect()
        setLitClient(lit)
        setLitConnected(true)
      }

      if (!xmtpClient) {
        const client: XmtpClient = await XmtpClient.create({
          getAddress: async () => walletClient.account.address,
          signMessage: async (message: string | Uint8Array) => {
            const msgToSign = typeof message === 'string'
              ? message
              : new TextDecoder().decode(Uint8Array.from(message))
            return walletClient.signMessage({ account: walletClient.account, message: msgToSign })
          },
        })
        setXmtpClient(client)
      }
    }

    init()
    return () => streamCancel?.()
  }, [walletClient, isConnected])

  const resolveRecipient = async () => {
          let didNameOrAddress = recipientDid

if (recipientDid.startsWith('did:health:')) {
  const parts = recipientDid.split(':')
  didNameOrAddress = parts[parts.length - 1]
}

console.log(`Resolving recipient: ${didNameOrAddress}`)
    const isEthAddress = /^0x[a-fA-F0-9]{40}$/.test(didNameOrAddress)
    const result = isEthAddress
      ? await resolveDidHealthAcrossChains(didNameOrAddress)
      : await resolveDidHealthByDidNameAcrossChains(didNameOrAddress)
console.log(`Resolved DID: ${JSON.stringify(result)}`)
    if (!result?.doc?.controller) throw new Error('DID not found or invalid')
    return result.doc.controller
  }

  const handleSend = async () => {
    if (!xmtpClient || !litClient || !email || !web3SpaceDid || !accessControlConditions) {
      setStatus('❌ Missing Lit or Web3 state')
      return
    }

    setStatus('🔍 Resolving recipient DID...')

    try {
      const wallet = await resolveRecipient()
      setRecipientWalletAddress(wallet)
      console.log(`✅ Resolved DID to wallet: ${wallet}`)

      const conv = await xmtpClient.conversations.newConversation(wallet)
      setConversation(conv)

      const communication = {
        resourceType: 'Communication',
        status: 'completed',
        sender: { reference: `Patient/${walletAddress}` },
        recipient: [{ reference: `Practitioner/${recipientDid}` }],
        payload: [{ contentString: messageText }],
      }


      const messageHeader = {
        resourceType: 'MessageHeader',
        eventCoding: { system: 'http://hl7.org/fhir/message-events', code: 'communication-request' },
        source: { name: 'DID:Health dApp', endpoint: walletAddress },
        destination: [{ endpoint: wallet }],
        focus: [{ reference: 'Communication/1' }],
      }

      const bundle = {
        resourceType: 'Bundle',
        type: 'message',
        entry: [{ resource: messageHeader }, { resource: communication }],
      }

      const blob = new Blob([JSON.stringify(bundle)], { type: 'application/json' })

      setStatus('🔐 Encrypting...')
      const { encryptedJSON, hash } = await encryptFHIRFile({
        file: blob,
        litClient,
        chain: 'ethereum',
        accessControlConditions,
      })

      const fileHash = `0x${hash}`
      setStatus('📦 Uploading to Web3...')
      const ipfsUri = await storeEncryptedFileByHash(
        new Blob([JSON.stringify(encryptedJSON)]),
        fileHash,
        'Bundle'
      )

      setStatus('📨 Sending via XMTP...')
      await conv.send(JSON.stringify({ ipfsUri, litHash: fileHash, resourceType: 'Bundle' }))

      setStatus('✅ Sent')
    } catch (err) {
      console.error(err)
      setStatus('❌ Failed to resolve or send')
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">🔐 XMTP FHIR Chat</h2>

      {!isConnected && <ConnectButton showBalance={false} />}

      <input
        className="input"
        placeholder="DID:Health of recipient"
        value={recipientDid}
        onChange={(e) => setRecipientDid(e.target.value)}
      />
      {recipientWalletAddress && (
        <p className="text-xs text-green-600">Resolved Wallet: {recipientWalletAddress}</p>
      )}
      <textarea
        className="input h-32"
        placeholder="Communication message"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button className="btn btn-primary w-full" onClick={handleSend}>Send Message</button>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  )
}
