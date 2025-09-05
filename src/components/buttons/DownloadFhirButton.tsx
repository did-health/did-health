import React from 'react';

interface DownloadFhirButtonProps {
  fhirResource: any;
  className?: string;
  children?: React.ReactNode;
}

export const DownloadFhirButton: React.FC<DownloadFhirButtonProps> = ({
  fhirResource,
  className = '',
  children = 'Download FHIR',
}) => {
  const handleDownload = () => {
    if (!fhirResource) return;
    
    // Create a filename from the resource
    const resourceType = (fhirResource.resourceType || 'resource').toLowerCase();
    const resourceId = fhirResource.id || 'unknown';
    const filename = `${resourceType}-${resourceId}.json`;
    
    // Create a blob with the FHIR resource
    const blob = new Blob(
      [JSON.stringify(fhirResource, null, 2)], 
      { type: 'application/json;charset=utf-8' }
    );
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <button 
      onClick={handleDownload}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${className}`}
      title="Download FHIR Resource"
    >
      {children}
    </button>
  );
};

export default DownloadFhirButton;
