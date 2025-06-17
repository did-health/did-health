import { Routes, Route, Navigate } from 'react-router-dom'
import SelectBlockChain from './components/SelectBlockChain'
import OnboardingEth from './components/OnboardingEth'
import OnboardingBTC from './components/OnboardingBTC'
import PatientForm from './components/fhir/CreatePatientForm'
import PractitionerForm from './components/fhir/CreatePractitionerForm'
import OrganizationForm from './components/fhir/CreateOrganizationForm'
import DeviceForm from './components/fhir/CreateDeviceForm'
import { SelectDIDForm } from './components/SelectDIDForm'
import LanguageSelector from './components/LanguageSelector'
import ShowDIDPage from './components/ShowDIDPage'
import ShowDIDBTC from './components/ShowDIDBTC'
import XMTPChatClient from './components/XMTPChatClient'
import OnboardingSolana from './components/OnboardingSolana'

function App() {
  return (
    <div className="relative min-h-screen">
      <LanguageSelector />
      <Routes>
        <Route path="/" element={<SelectBlockChain />} />
        <Route path="/chat" element={<XMTPChatClient />} />
        <Route path="/ethereum/did" element={<ShowDIDPage />} />
        <Route path="/btc/did" element={<ShowDIDBTC />} />        
        <Route path="/onboarding/ethereum" element={<OnboardingEth />} />
        <Route path="/onboarding/bitcoin" element={<OnboardingBTC />} />
        <Route path="/onboarding/solana" element={<OnboardingSolana />} />
        <Route path="/onboarding/cosmis" element={<OnboardingBTC />} />        
        <Route path="/create/patient" element={<PatientForm />} />
        <Route path="/create/practitioner" element={<PractitionerForm />} />
        <Route path="/create/organization" element={<OrganizationForm />} />
        <Route path="/create/device" element={<DeviceForm />} />
        <Route
          path="/set-did"
          element={
            <SelectDIDForm
              onDIDAvailable={(did: string) => {
                console.log('DID selected:', did)
              }}
            />
          }
        />
     
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
