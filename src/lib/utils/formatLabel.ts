import { useTranslation } from 'react-i18next';

export const useFormatLabel = (resourceType: string) => {
    const { t } = useTranslation('fhir');
    
    return (label: string): string => {
        const translatedLabel = t(`${resourceType}.${label}.label`);
        const formattedLabel = translatedLabel || label
            // Split by camel case or dots
            .split(/(?=[A-Z])|\./)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Apply dictionary replacement
        return formattedLabel;
    };
};

export const formatLabel = (label: string): string => {
    // Fallback for non-React environments
    return label
        .split(/(?=[A-Z])|\./)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

