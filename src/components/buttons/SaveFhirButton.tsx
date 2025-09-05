import React from 'react';
import { useOnboardingState } from '../../store/OnboardingState';
import { fhir } from '../../store/fhirStore';

interface SaveFhirButtonProps {
  fhirResource: any;
  className?: string;
  children?: React.ReactNode;
  onSave?: () => void;
  onError?: (error: Error) => void;
}

export const SaveFhirButton: React.FC<SaveFhirButtonProps> = ({
  fhirResource,
  className = '',
  children = 'Save to My Records',
  onSave,
  onError,
}) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const setFhirResource = useOnboardingState((state) => state.setFhirResource);

  const handleSave = async () => {
    if (!fhirResource) return;
    
    try {
      setIsSaving(true);
      
      // Save to the FHIR store
      const savedResource = await fhir.create(fhirResource);
      
      // Also update the onboarding state
      setFhirResource(savedResource);
      
      if (onSave) onSave();
    } catch (error) {
      console.error('Error saving FHIR resource:', error);
      if (onError) onError(error as Error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button 
      onClick={handleSave}
      disabled={isSaving}
      className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 ${className}`}
      title="Save FHIR Resource to Your Records"
    >
      {isSaving ? 'Saving...' : children}
    </button>
  );
};

export default SaveFhirButton;
