import React, { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { QrReader } from 'react-qr-reader'
import { getLitDecryptedFHIR } from '../../lib/litSessionSigs'
import { useOnboardingState } from '../../store/OnboardingState'
import FHIRResource from '../fhir/FHIRResourceView'
import ConnectWallet from '../eth/WalletConnectETH'
import { ConnectLit } from '../lit/ConnectLit'
import { Client as XmtpClient } from '@xmtp/xmtp-js'
import { useAccount } from 'wagmi'
import { useWalletClient } from 'wagmi'
import logo from '../../assets/did-health.png'

export function DidHealthQRScanner() {
  const { t } = useTranslation()
  const { address: walletAddress } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { litClient, litConnected } = useOnboardingState()
  const [xmtpClient, setXmtpClient] = useState<any>(null)

  useEffect(() => {
    const initXmtp = async () => {
      if (!walletClient || !walletAddress) return;
      
      try {
        const client = await XmtpClient.create({
          getAddress: async () => walletAddress,
          signMessage: async (message: string | ArrayLike<number>) => {
            if (!walletClient) return '';
            const msg = typeof message === 'string' ? message : new TextDecoder().decode(message as Uint8Array);
            const signature = await walletClient.signMessage({
              message: msg,
            });
            return signature;
          },
        });
        setXmtpClient(client);
      } catch (error) {
        console.error('Error initializing XMTP client:', error);
      }
    };
    initXmtp();
  }, [walletClient, walletAddress]);
  const [status, setStatus] = useState('')
  const [fhir, setFhir] = useState<any | null>(null)
  const [didDoc, setDidDoc] = useState<any | null>(null)

  const handleScan = useCallback(
    async (result: any) => {
      if (!result?.text) return

      try {
        setStatus(t('scanner.parsing'))
        const doc = JSON.parse(result.text)
        setDidDoc(doc)

        const fhirEndpoint = doc?.service?.find(
          (s: any) => s.type === 'FHIRResource' || s.id?.includes('#fhir')
        )?.serviceEndpoint

        if (!fhirEndpoint) throw new Error(t('scanner.noEndpoint'))

        setStatus(t('scanner.fetching', { url: fhirEndpoint }))
        const response = await fetch(fhirEndpoint)
        if (!response.ok) throw new Error(`${t('scanner.fetchFailed')}: ${response.statusText}`)

        const json = await response.json()
        const isEncrypted = fhirEndpoint.endsWith('.enc') || fhirEndpoint.endsWith('.lit')

        if (!isEncrypted) {
          setFhir(json)
          setStatus(t('scanner.plainLoaded'))
          return
        }

        setStatus(t('scanner.decrypting'))
        const accChain = json.accessControlConditions?.[0]?.chain ?? 'ethereum'

        try {
          const decrypted = await getLitDecryptedFHIR(json, litClient, { chain: accChain })
          setFhir(decrypted)
          setStatus(t('scanner.decrypted'))
        } catch (e) {
          console.warn('Decryption failed, sending consent...')
          setStatus(t('scanner.accessDenied'))

          const recipient = doc.controller;
          const patientId = doc.id;
          const practitionerId = 'Practitioner/dummy-id'; // Replace with actual practitioner ID logic
                  
          // Send consent request using XMTP
          /*if (xmtpClient) {
            sendConsentRequestMessage(xmtpClient, recipient, patientId, practitionerId)
              .then(() => {
                setStatus('✅ Consent request sent');
              })
              .catch((error) => {
                console.error('Error sending consent request:', error);
                setStatus('❌ Error sending consent request');
              });
          } else {
            setStatus('❌ Please connect your wallet first');
          }*/
        }
      } catch (err: any) {
        console.error(err)
        setStatus(`❌ ${err.message}`)
      }
    },
    [litClient, xmtpClient, t]
  )

  return (
    <main className="p-6 max-w-xl mx-auto space-y-6">
      <div className="flex flex-col items-center mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow bg-white/10 ring-2 ring-green-400">
          <img
            src={logo}
            alt="did:health Logo"
            className="w-full h-full object-contain scale-110"
          />
        </div>
        <h1 className="text-2xl font-bold mt-4 text-center">
          📷 {t('scanner.title')}
        </h1>
      </div>

      <div className="flex justify-center gap-4 flex-wrap">
        <ConnectWallet />
        <ConnectLit />
      </div>

      <QrReader
        constraints={{ facingMode: 'environment' }}
        onResult={(result, error) => {
          if (result) handleScan(result)
        }}
        containerStyle={{ width: '100%' }}
      />

      {status && <p className="text-sm text-gray-700 mt-4">{status}</p>}

      {fhir && (
        <div className="bg-gray-100 p-4 rounded mt-4">
          <h2 className="text-lg font-semibold mb-2">{t('scanner.resourceTitle')}</h2>
          <FHIRResource resource={fhir} />
          <pre className="bg-white p-2 rounded text-xs overflow-x-auto mt-4">
            {JSON.stringify(fhir, null, 2)}
          </pre>
        </div>
      )}
    </main>
  )
}
