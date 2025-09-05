import type { DidHealthAppConfig } from '../types'

const ViewerConfig: DidHealthAppConfig = {
  id: 'viewer',
  title: 'Viewer',
  description: 'View and manage your health records',
  resourceTypes: ['Patient', 'AllergyIntolerance', 'MedicationRequest', 'Condition', 'Immunization'],
  encrypt: false,
  component: () => import('./Index').then(m => m.default),
}

export default ViewerConfig