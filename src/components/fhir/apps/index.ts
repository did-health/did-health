// components/fhir/apps/index.ts

export interface App {
  id: string;
  title: string;
  description: string;
  component: () => Promise<{ default: React.ComponentType<any> }>;
}

export const didHealthApps: App[] = [
  {
    id: 'epic-connector',
    title: 'Connect to Epic EHR',
    description: 'Sign in to Epic MyChart and view/download your health records using SMART on FHIR.',
    component: () => import('./epic/Index')
  },
  {
    id: 'advance-directives',
    title: 'Advance Directives',
    description: 'Create and manage your advance directives',
    component: () => import('./pcaio/PatientDirectivesStudio')
  },
  {
    id: 'viewer',
    title: 'Viewer',
    description: 'View and manage your health records',
    component: () => import('./viewer/Index')
  }

  // Add more apps here
]
