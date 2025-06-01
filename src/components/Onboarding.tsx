import { ConnectWallet } from '../components/WalletConnect'
import { ConnectLit } from '../components/ConnectLit'
import { SetupStorage } from '../components/SetupStorage'
import { CreateDIDForm } from '../components/CreateDIDForm'
import { SelectDIDForm } from './SelectDIDForm'
import { RegisterDID } from './RegisterDID'
import { useOnboardingState } from '../store/OnboardingState'

export default function Onboarding() {
  const {
    walletConnected,
    litConnected,
    storageReady,
    fhirResource,
    did,
    setDID,
  } = useOnboardingState()

  return (
    <main className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">did:health Onboarding</h1>

      <section>
        <ConnectWallet />
      </section>

      {walletConnected && (
        <section>
          <ConnectLit />
        </section>
      )}

      {walletConnected && litConnected && (
        <section>
          <SetupStorage />
        </section>
      )}

      {walletConnected && litConnected && storageReady && !fhirResource && (
        <section>
          <h2 className="text-lg font-semibold">4. Create FHIR Record</h2>
          <CreateDIDForm />
        </section>
      )}

      {fhirResource && (
        <section>
          <h2 className="text-lg font-semibold">4. Create FHIR Record</h2>
          <p className="text-green-700 font-medium">
            ✅ FHIR record created: <strong>{fhirResource.resourceType}</strong>
          </p>
        </section>
      )}

      {walletConnected && litConnected && storageReady && fhirResource && !did && (
        <SelectDIDForm
          onDIDAvailable={(did) => {
            setDID(did)
          }}
        />
      )}

      {did && (
        <section>
          <h2 className="text-lg font-semibold">5. Final Step: Register DID</h2>
          <RegisterDID />
        </section>
      )}
    </main>
  )
}
