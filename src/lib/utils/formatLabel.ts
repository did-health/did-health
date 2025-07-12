export const formatLabel = (label: string): string => {
    const formattedLabel = label
        // Split by camel case or dots
        .split(/(?=[A-Z])|\./)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Apply dictionary replacement
    return replaceLabelWithDictionary(formattedLabel);
};

export const replaceLabelWithDictionary = (label: string): string => {
    const dictionary: Record<string, string> = {
        Subject: 'Patient',
        Identifier: 'Member ID' 
        // Add more replacements as needed
    };

    return dictionary[label] || label;
};
