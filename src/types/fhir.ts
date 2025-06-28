import type { PractitionerQualification } from 'fhir/r4';

export interface PractitionerQualificationWithSpecialty extends PractitionerQualification {
  specialty: Array<{
    text: string;
  }>;
}
