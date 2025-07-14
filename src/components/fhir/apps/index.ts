// components/fhir/apps/index.ts

export interface App {
  id: string;
  title: string;
  description: string;
  component: () => Promise<{ default: React.ComponentType<any> }>;
}

export const didHealthApps: App[] = [
  {
    id: 'medication-statement',
    title: 'Medication Statement',
    description: 'Manage your medication statements',
    component: () => import('./pillbox/MedicationStatement')
  },
  {
    id: 'advance-directives',
    title: 'Advance Directives',
    description: 'Create and manage your advance directives',
    component: () => import('./pcaio/PatientDirectivesStudio')
  }
  // Add more apps here
]
