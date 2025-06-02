import { Routes, Route, Navigate } from 'react-router-dom'
import Onboarding from './components/Onboarding'
import PatientForm from './components/fhir/CreatePatientForm'
import PractitionerForm from './components/fhir/CreatePractitionerForm'
import OrganizationForm from './components/fhir/CreateOrganizationForm'
import DeviceForm from './components/fhir/CreateDeviceForm'
import { SelectDIDForm } from './components/SelectDIDForm'
import { RegisterDID } from './components/RegisterDID'
import LanguageSelector from './components/LanguageSelector'

function App() {
  return (
    <div className="relative min-h-screen">
      <LanguageSelector />
      <Routes>
        <Route path="/" element={<Onboarding />} />
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
        <Route path="/register-did" element={<RegisterDID />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
