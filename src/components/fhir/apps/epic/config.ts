import type { DidHealthAppConfig } from '../types'

const EpicConnectorConfig: DidHealthAppConfig = {
  id: 'epic-connector',
  title: 'Connect to Epic EHR',
  description: 'Sign in to Epic MyChart and view/download your health records using SMART on FHIR.',
  resourceTypes: ['Patient', 'AllergyIntolerance', 'MedicationRequest', 'Condition', 'Immunization'],
  encrypt: false, // No encryption needed here — read-only
  component: () => import('./Index').then(m => m.default),
}

export default EpicConnectorConfig
