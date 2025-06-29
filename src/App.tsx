import { Routes, Route, Navigate } from 'react-router-dom'
import SelectBlockChain from './components/SelectBlockChain'
import OnboardingEth from './components/eth/OnboardingEth'
import OnboardingBTC from './components/btc/OnboardingBTC'
import PatientForm from './components/fhir/CreatePatientForm'
import { v4 as uuidv4 } from 'uuid'
import PractitionerForm from './components/fhir/CreatePractitionerForm'
import OrganizationForm from './components/fhir/CreateOrganizationForm'
import DeviceForm from './components/fhir/CreateDeviceForm'
import LanguageSelector from './components/LanguageSelector'
import ResolveDIDETH from './components/eth/ResolveDIDETH'
import AltFHIRData from './components/fhir/AltFHIRData'
import ResolveDIDBTC from './components/btc/ResolveDIDBTC'
import ResolveDIDSolana from './components/solana/ResolveDIDSolana'
import ResolveDIDCosmos from './components/cosmos/ResolveDIDCosmos'
import UpdateDIDUri from './components/eth/UpdateDid'
import XMTPChatClient from './components/chat/XMTPChatClient'
import OnboardingSolana from './components/solana/OnboardingSolana'
import OnboardingDAO from './components/dao/OnboardingDAO'
import DAOAdminPage from './components/dao/DAOAdmin'
import { Help } from './components/Help'
import DAOMemberSearch from './components/dao/DAOMemberSearch'
import { DAOStatus } from './components/dao/DAOStatus'
import {DidHealthQRScanner} from './components/dao/DAODIDScanner'
function App() {
  return (
    <div className="relative min-h-screen">
      <LanguageSelector />
      <Routes>
        <Route path="/" element={<SelectBlockChain />} />
        <Route path="/help" element={<Help />} />
        <Route path="/chat" element={<XMTPChatClient />} />
        <Route path="/ethereum/did" element={<ResolveDIDETH />} />
        <Route path="/ethereum/did/alt" element={<AltFHIRData />} />
        <Route path="/ethereum/did/update" element={<UpdateDIDUri />} />
        <Route path="/btc/did" element={<ResolveDIDBTC />} /> 
        <Route path="/solana/did" element={<ResolveDIDSolana/>} />       
        <Route path="/cosmos/did" element={<ResolveDIDCosmos />} />       
        <Route path="/onboarding/dao" element={<OnboardingDAO />} />
        <Route path="/dao/admin" element={<DAOAdminPage />} />
        <Route path="/dao/search" element={ <DAOMemberSearch/>}/>
        <Route path="/dao/status" element={ <DAOStatus walletAddress='0x15B7652e76E27C67A92cd42A0CD384cF572B4a9b'/>}/>
        <Route path="/scan" element={ <DidHealthQRScanner/>}/>
        <Route path="/onboarding/ethereum" element={<OnboardingEth />} />
        <Route path="/onboarding/bitcoin" element={<OnboardingBTC />} />
        <Route path="/onboarding/solana" element={<OnboardingSolana />} />
        <Route path="/onboarding/cosmis" element={<OnboardingBTC />} />        
        <Route path="/create/patient" element={<PatientForm 
          defaultValues={{
            resourceType: 'Patient',
            id: uuidv4(),
            active: true
          }}
          onSubmit={async (patient) => {
            // Handle patient submission here
            console.log('Patient submitted:', patient)
          }}
        />} />
        <Route path="/create/practitioner" element={<PractitionerForm 
          defaultValues={{
            resourceType: 'Practitioner',
            id: uuidv4(),
            active: true
          }}
          onSubmit={async (practitioner) => {
            console.log('Practitioner submitted:', practitioner);
          }}
        />} />
        <Route path="/create/organization" element={<OrganizationForm
          defaultValues={{
            resourceType: 'Organization',
            id: uuidv4(),
            name: '',
            active: true
          }}
          onSubmit={async (organization) => {
            console.log('Organization submitted:', organization);
          }}
        />} />
        <Route path="/create/device" element={
          <DeviceForm
            defaultValues={{
              resourceType: 'Device',
              identifier: [{ system: 'https://www.w3.org/ns/did', value: '' }],
              status: 'active'
            }}
            onSubmit={async (device) => {
              console.log('Device submitted:', device);
            }}
          />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
