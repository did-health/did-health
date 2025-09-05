import React from 'react';
import { useTranslation } from 'react-i18next';

const NoResults: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="no-results">
            <p>{t('No results found')}</p>
        </div>
    );
};

export default NoResults;
