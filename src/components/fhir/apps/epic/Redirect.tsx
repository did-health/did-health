// components/fhir/apps/EpicPatientConnector/RedirectHandler.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { oauth2 as SMART } from 'fhirclient'

export default function RedirectHandler() {
  const navigate = useNavigate()

  useEffect(() => {
    SMART.ready()
      .then(() => {
        navigate('/apps/epic-connector')
      })
      .catch((err) => {
        console.error('OAuth redirect error:', err)
        alert('❌ SMART OAuth redirect failed')
        navigate('/')
      })
  }, [navigate])

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Finalizing Epic Login...</h1>
      <p className="text-sm text-gray-600">Please wait while we complete authentication.</p>
    </main>
  )
}
