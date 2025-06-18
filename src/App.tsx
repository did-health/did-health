import { Routes, Route, Navigate } from 'react-router-dom'
import SelectBlockChain from './components/SelectBlockChain'
import OnboardingEth from './components/eth/OnboardingEth'
import OnboardingBTC from './components/btc/OnboardingBTC'
import PatientForm from './components/fhir/CreatePatientForm'
import PractitionerForm from './components/fhir/CreatePractitionerForm'
import OrganizationForm from './components/fhir/CreateOrganizationForm'
import DeviceForm from './components/fhir/CreateDeviceForm'
import LanguageSelector from './components/LanguageSelector'
import ResolveDIDETH from './components/eth/ResolveDIDETH'
import ResolveDIDBTC from './components/btc/ResolveDIDBTC'
import ResolveDIDSolana from './components/solana/ResolveDIDSolana'
import ResolveDIDCosmos from './components/cosmos/ResolveDIDCosmos'
import XMTPChatClient from './components/chat/XMTPChatClient'
import OnboardingSolana from './components/solana/OnboardingSolana'
import { Help } from './components/Help'


function App() {
  return (
    <div className="relative min-h-screen">
      <LanguageSelector />
      <Routes>
        <Route path="/" element={<SelectBlockChain />} />
        <Route path="/help" element={<Help />} />
        <Route path="/chat" element={<XMTPChatClient />} />
        <Route path="/ethereum/did" element={<ResolveDIDETH />} />
        <Route path="/btc/did" element={<ResolveDIDBTC />} /> 
        <Route path="/solana/did" element={<ResolveDIDSolana/>} />       
        <Route path="/cosmos/did" element={<ResolveDIDCosmos />} />       
        <Route path="/onboarding/ethereum" element={<OnboardingEth />} />
        <Route path="/onboarding/bitcoin" element={<OnboardingBTC />} />
        <Route path="/onboarding/solana" element={<OnboardingSolana />} />
        <Route path="/onboarding/cosmis" element={<OnboardingBTC />} />        
        <Route path="/create/patient" element={<PatientForm />} />
        <Route path="/create/practitioner" element={<PractitionerForm />} />
        <Route path="/create/organization" element={<OrganizationForm />} />
        <Route path="/create/device" element={<DeviceForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
