import { useEffect, useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { Client as XmtpClient, type Conversation, type DecodedMessage } from '@xmtp/xmtp-js'
import { getAddress, type WalletClient } from 'viem'
import { useOnboardingState } from '../store/OnboardingState'
import { decryptFromLitJson } from './litEncryptFile'

type ChatMessage = {
  sender: string
  timestamp: Date
  fhir: any
}

export function createXmtpSigner(walletClient: WalletClient) {
  return {
    getAddress: async () => {
      if (!walletClient.account) {
        throw new Error('walletClient.account is undefined');
      }
      return getAddress(walletClient.account.address);
    },
    signMessage: async (message: string | Uint8Array) => {
      const normalizedMessage =
        typeof message === 'string' ? message : new TextDecoder().decode(message)

      if (!walletClient.account) {
        throw new Error('walletClient.account is undefined');
      }
      return await walletClient.signMessage({
        account: walletClient.account,
        message: normalizedMessage,
      })
    },
  }
}

export function useXmtpChat(recipientDid: string) {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const {
    litClient,
    sessionSigs,
  } = useOnboardingState()

  const [xmtpClient, setXmtpClient] = useState<XmtpClient | null>(null)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<string>('')

  // 1️⃣ Initialize XMTP client
  useEffect(() => {
    const init = async () => {
      if (!walletClient) return
      const signer = createXmtpSigner(walletClient)
      const client = await XmtpClient.create(signer)
      setXmtpClient(client)
    }
    init()
  }, [walletClient])

  // 2️⃣ Start conversation + stream messages
  useEffect(() => {
    if (!xmtpClient || !recipientDid || !litClient) return

    const run = async () => {
      const recipientWallet = recipientDid.split(':').pop()
      if (!recipientWallet) return
      const conv = await xmtpClient.conversations.newConversation(recipientWallet)
      setConversation(conv)

      const initial = await conv.messages()
      const parsed = await Promise.all(
        initial.map((m) => parseFHIRMessage(m, litClient, sessionSigs))
      )
      setMessages(parsed.filter(Boolean) as ChatMessage[])

      for await (const msg of await conv.streamMessages()) {
        const parsedMsg = await parseFHIRMessage(msg, litClient, sessionSigs)
        if (parsedMsg) {
          setMessages((prev) => [...prev, parsedMsg])
        }
      }
    }

    run()
  }, [xmtpClient, recipientDid, litClient, sessionSigs])

  return {
    messages,
    xmtpClient,
    conversation,
    status,
  }
}

async function parseFHIRMessage(
  msg: DecodedMessage,
  litClient: any,
  sessionSigs: any
): Promise<ChatMessage | null> {
  try {
    const { ipfsUri, litHash } = JSON.parse(msg.content)
    const res = await fetch(ipfsUri)
    const encryptedJson = await res.json()
    const fhir = await decryptFromLitJson({ encryptedJson, litClient, sessionSigs })

    return {
      sender: msg.senderAddress,
      timestamp: msg.sent,
      fhir,
    }
  } catch (err) {
    console.warn('❌ Failed to parse/decrypt:', err)
    return null
  }
}
