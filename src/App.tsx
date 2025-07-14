import { Routes, Route, Navigate } from 'react-router-dom'
import SelectBlockChain from './components/SelectBlockChain'
import OnboardingEth from './components/eth/OnboardingEth'
import OnboardingBTC from './components/btc/OnboardingBTC'
import LanguageSelector from './components/LanguageSelector'
import ResolveDIDETH from './components/eth/ResolveDIDETH'
import ResolveDIDBTC from './components/btc/ResolveDIDBTC'
import UpdateDIDUri from './components/eth/UpdateDidETH'
import UpdateDidBTC from './components/btc/UpdateDIDBTC'
import Chat from './components/chat/Chat'
import { XmtpProvider } from './providers/XmtpProvider'
import OnboardingDAO from './components/dao/OnboardingDAO'
import DAOAdminPage from './components/dao/DAOAdmin'
import { Help } from './components/Help'
import DAOMemberSearch from './components/dao/DAOMemberSearch'
import { DAOStatus } from './components/dao/DAOStatus'
import {DidHealthQRScanner} from './components/dao/DAODIDScanner'
import  DIDResolver  from './components/DIDResolver';
import { XmtpInstallationsPage } from './components/chat/XmtpInstalls'
import AppGallery from './components/fhir/AppGallery'
function App() {
  return (

    <div className="relative min-h-screen">
          
      <LanguageSelector />
      <Routes>
        <Route path="/" element={<SelectBlockChain />} />
        <Route path="/help" element={<Help />} />
        <Route path="/xmtp" element={<XmtpInstallationsPage />} />
        <Route path="/chat" element={
          <XmtpProvider>
            <Chat />
          </XmtpProvider>
        } />
        <Route path="/ethereum/did" element={<ResolveDIDETH />} />
        <Route path="/ethereum/did/update" element={<UpdateDIDUri />} />
        <Route path="/btc/did/update" element={<UpdateDidBTC />} />
        <Route path="/btc/did" element={<ResolveDIDBTC />} /> 
        <Route path="/onboarding/dao" element={<OnboardingDAO />} />
        <Route path="/dao/admin" element={<DAOAdminPage />} />
        <Route path="/dao/search" element={ <DAOMemberSearch/>}/>
        <Route path="/dao/status" element={ <DAOStatus walletAddress='0x15B7652e76E27C67A92cd42A0CD384cF572B4a9b'/>}/>
        <Route path="/scan" element={ <DidHealthQRScanner/>}/>
        <Route path="/resolve" element={ <DIDResolver/>}/>
        <Route path="/apps" element={<AppGallery />} />
        <Route path="/onboarding/ethereum" element={<OnboardingEth />} />
        <Route path="/onboarding/bitcoin" element={<OnboardingBTC />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
