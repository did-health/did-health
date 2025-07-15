export interface EpicConfig {
  baseUrl: string;
  clientId: string;
  redirectUri: string;
  scope: string;
}

export interface EpicPatient {
  id: string;
  name: string[];
  birthDate: string;
  gender: string;
}
