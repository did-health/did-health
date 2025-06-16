import { useEffect, useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { Client as XmtpClient } from '@xmtp/xmtp-js'
import type { Conversation } from '@xmtp/xmtp-js'
import { useOnboardingState } from '../store/OnboardingState'
import { encryptFHIRFile, decryptFromLitJson } from '../lib/litEncryptFile'
import { storeEncryptedFileByHash } from '../lib/storeFIleWeb3'

export default function XMTPChatClient() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const {
    walletAddress,
    litClient,
    email,
    web3SpaceDid,
    accessControlConditions,
  } = useOnboardingState()

  const [xmtpClient, setXmtpClient] = useState<XmtpClient | null>(null)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [recipientDid, setRecipientDid] = useState('')
  const [messageText, setMessageText] = useState('')
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [status, setStatus] = useState('')
  const [streamCancel, setStreamCancel] = useState<() => void>()

  useEffect(() => {
    const init = async () => {
      if (walletClient) {
        const client = await XmtpClient.create({
          getAddress: async () => walletClient.account.address,
          signMessage: async (message: string | ArrayLike<number>) => {
            let msgToSign: string
            if (typeof message === 'string') {
              msgToSign = message
            } else {
              msgToSign = new TextDecoder().decode(Uint8Array.from(message as ArrayLike<number>))
            }
            return walletClient.signMessage({ account: walletClient.account, message: msgToSign })
          },
        })
        setXmtpClient(client)
      }
    }
    init()
    return () => streamCancel?.()
  }, [walletClient])

  const streamMessages = async (conv: Conversation) => {
    const messages = await conv.messages()
    const history: any[] = []

    for (const m of messages) {
      try {
        const { ipfsUri } = JSON.parse(m.content)
        const res = await fetch(ipfsUri)
        const encryptedJson = await res.json()
        if (!litClient) {
          console.warn('litClient is null, cannot decrypt message')
          continue
        }
        const decrypted = await decryptFromLitJson({ encryptedJson, litClient, sessionSigs: litClient.getSessionSigs })
        history.push({ sender: m.senderAddress, body: decrypted })
      } catch (err) {
        console.warn('Failed to decrypt message:', err)
      }
    }

    setChatMessages(history)

    const stream = await conv.streamMessages()
    const reader = (async () => {
      for await (const msg of stream) {
        try {
          const { ipfsUri } = JSON.parse(msg.content)
          const res = await fetch(ipfsUri)
          const encryptedJson = await res.json()
          if (!litClient) {
            console.warn('litClient is null, cannot decrypt streaming message')
            continue
          }
          const decrypted = await decryptFromLitJson({ encryptedJson, litClient, sessionSigs: litClient.getSessionSigs })
          setChatMessages((prev) => [...prev, { sender: msg.senderAddress, body: decrypted }])
        } catch (err) {
          console.error('Streaming decrypt error:', err)
        }
      }
    })()

    setStreamCancel(() => () => stream.return?.())
  }

  const handleSend = async () => {
    if (!xmtpClient || !litClient || !email || !web3SpaceDid || !accessControlConditions) {
      setStatus('❌ Missing Lit or Web3 state')
      return
    }

    const recipientWallet = recipientDid.split(':').pop()
    const conv = await xmtpClient.conversations.newConversation(recipientWallet!)
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
      destination: [{ endpoint: recipientWallet }],
      focus: [{ reference: 'Communication/1' }],
    }

    const bundle = {
      resourceType: 'Bundle',
      type: 'message',
      entry: [{ resource: messageHeader }, { resource: communication }],
    }

    const blob = new Blob([JSON.stringify(bundle)], { type: 'application/json' })

    setStatus('🔐 Encrypting...')
    const { encryptedJSON } = await encryptFHIRFile({
      file: blob,
      litClient,
      chain: 'ethereum',
      accessControlConditions,
    })

    const arrayBuffer = await blob.arrayBuffer()
    const hash = await crypto.subtle.digest('SHA-256', arrayBuffer)
    const hexHash = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
    const fileHash = `0x${hexHash}`

    setStatus('📦 Uploading to Web3...')
    const ipfsUri = await storeEncryptedFileByHash(new Blob([JSON.stringify(encryptedJSON)]), fileHash, 'Bundle')

    setStatus('📨 Sending via XMTP...')
    await conv.send(JSON.stringify({ ipfsUri, litHash: fileHash, resourceType: 'Bundle' }))

    setStatus('✅ Sent')
    streamMessages(conv)
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">🔐 XMTP FHIR Chat</h2>

      <input
        className="input"
        placeholder="DID:Health of recipient"
        value={recipientDid}
        onChange={(e) => setRecipientDid(e.target.value)}
      />
      <textarea
        className="input h-32"
        placeholder="Communication message"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button className="btn btn-primary w-full" onClick={handleSend}>Send Message</button>

      {status && <p className="text-sm text-gray-600">{status}</p>}

      <div>
        <h3 className="text-lg font-semibold mt-4">Chat History</h3>
        {chatMessages.map((msg, idx) => (
          <div key={idx} className="border rounded p-2 mt-2 bg-gray-50">
            <div className="text-xs text-gray-400">From: {msg.sender}</div>
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{JSON.stringify(msg.body, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}
