import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOnboardingState } from './../store/OnboardingState'
import { create } from '@web3-storage/w3up-client'
import { ResetWeb3SpaceButton } from './buttons/ResetWeb3SpaceButton'

export function SetupStorage({ onReady }: { onReady: (client: any) => void }) {
  const { t } = useTranslation()
  const {
    email,
    web3SpaceDid,
    storageReady,
    setEmail,
    setWeb3SpaceDid,
    setStorageReady,
  } = useOnboardingState()



  const [status, setStatus] = useState('')
  const [client, setClient] = useState<any>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (email && web3SpaceDid && !client) {
      const initializeClient = async () => {
        try {
          console.log('initializing client')
          const newClient = await create()
          setClient(newClient)
          setStatus(t('setupStorage.status.alreadySetup', { did: web3SpaceDid }))
          setStorageReady(true)
        } catch (err) {
          console.error('Error initializing client:', err)
          setStatus(t('setupStorage.status.error'))
          setStorageReady(false)
        }
      }
      initializeClient()
    }
  }, [email, web3SpaceDid, setStorageReady, t])

  async function setupStorage() {
console.log('setting up storage')
    try {
      if (!email || !email.includes('@')) {
        setStatus(t('setupStorage.status.invalidEmail'))
        return
      }
      console.log("loading......................")
      setLoading(true)

      const newClient = await create()
      setClient(newClient)
      console.log("client created")
      setStatus(t('setupStorage.status.emailSent'))
      const account = await newClient.login(email as `${string}@${string}`)


      // After each setStatus call in setupStorage and useEffect
setStatus(t('setupStorage.status.emailSent'));
console.log('Status set:', t('setupStorage.status.emailSent'));

// Before return
console.log('Rendering status:', status);
      // Wait 2 seconds so user sees message
      await new Promise((resolve) => setTimeout(resolve, 2000))

      await account?.plan.wait()

      const space = await newClient.createSpace('did-health-user-space', { account })
      const spaceDid = space.did()
      console.log('spaceDid', spaceDid)
      await newClient.setCurrentSpace(spaceDid)
      setEmail(email)
      setWeb3SpaceDid(spaceDid)
   
      console.log('email', email)
      console.log('web3SpaceDid', web3SpaceDid)
      console.log('space', space)
      console.log('storageReady', storageReady)
      setStatus(t('setupStorage.status.spaceReady', { did: space.did() }))
      onReady(newClient)
    } catch (err) {
      console.error(err)
      setStatus(t('setupStorage.status.error'))
      setStorageReady(false)
    } finally {
      setLoading(false)
    }
  }

  async function handleSpaceReset(newDid: string): Promise<void> {
    try {
      if (!client) {
        console.error('No Web3.Storage client available')
        return
      }

      await client.setCurrentSpace(newDid)
      setWeb3SpaceDid(newDid)
      setStatus(t('setupStorage.status.spaceReady', { did: newDid }))
    } catch (err) {
      console.error('Error resetting space:', err)
      setStatus(t('setupStorage.status.error'))
    }
  }

  return (
    <div>
      <input
        type="email"
        className="input input-bordered w-full bg-white text-black rounded-md border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-300 transition outline-none disabled:bg-gray-100 disabled:text-gray-400"
        placeholder={t('setupStorage.input.placeholder')}
        value={email ?? ''}
        onChange={(e) => setEmail(e.target.value)}
        disabled={!!web3SpaceDid || loading}
        aria-label={t('setupStorage.input.ariaLabel')}
      />
      {!web3SpaceDid && (
        <button
          className={`btn btn-primary w-full mt-2 rounded-md py-2 text-white font-semibold transition
            ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}
          `}
          onClick={setupStorage}
          disabled={loading}
          aria-busy={loading}
        >
          {loading
            ? t('setupStorage.status.emailSent')
            : t('setupStorage.button.verifyAndSetup')}
        </button>
      )}

      {status && (
        <div
          className={`p-3 rounded-md mt-2 text-sm font-medium whitespace-pre-wrap
            ${
              status.includes('❌') || status.includes('error')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }
          `}
          role="alert"
          aria-live="polite"
        >
          {status}
        </div>
      )}
     {web3SpaceDid && (
      <div className="mt-4">
        <ResetWeb3SpaceButton 
          onSpaceReset={handleSpaceReset} 
          agent={client}
          className="w-full"
          email={email as string}
        />
      </div>
     )}
    </div>
  )
}
