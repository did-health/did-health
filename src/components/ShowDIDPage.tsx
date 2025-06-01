import React, { useEffect, useState } from 'react'
import { useOnboardingState } from '../store/OnboardingState'
import { generateQRCode } from '../lib/QRCodeGeneration'
import {convertToDidDocument} from '../lib/DIDDocument'

export default function ShowDIDPage() {
  const { did, ipfsUri } = useOnboardingState()
  const [didDoc, setDidDoc] = useState<any | null>(null)
  const [qrcode, setQrcode] = useState<string>('')

  useEffect(() => {
    if (did && ipfsUri) {
      const doc = convertToDidDocument({ healthDid: did, ipfsUri })
      setDidDoc(doc)

      generateQRCode(JSON.stringify(doc))
        .then(setQrcode)
        .catch(err => console.error('QR Code generation failed', err))
    }
  }, [did, ipfsUri])

  if (!did || !ipfsUri) {
    return <p className="text-red-600">❌ DID registration incomplete.</p>
  }

  return (
    <main className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">✅ Your DID has been registered!</h1>

      <div>
        <p className="font-semibold">DID:</p>
        <code className="block p-2 bg-gray-100 rounded-md break-all">{did}</code>
      </div>

      {qrcode && (
        <div>
          <h2 className="text-lg font-semibold">DID Document QR Code</h2>
          <Image src={qrcode} alt="QR Code" width={300} height={300} />
        </div>
      )}
    </main>
  )
}
