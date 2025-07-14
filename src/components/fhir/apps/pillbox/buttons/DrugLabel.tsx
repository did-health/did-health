import React, { useState, useEffect } from 'react';
import { FaFileAlt } from 'react-icons/fa'; // Icon for the label
import { useTranslation } from 'react-i18next'; // Import the translation hook
import { GiWorld } from 'react-icons/gi';



interface DrugLabelProps {
  brandName: string;
  handleClose: () => void;
  setShowSearchModal: (show: boolean) => void;
  setModalSearchContent: (content: string) => void;
}

const DrugLabel: React.FC<DrugLabelProps> = ({ brandName, handleClose, setShowSearchModal, setModalSearchContent }) => {
  interface DrugLabelData {
  overdosage?: string[];
  pregnancy?: string[];
  storage_and_handling?: string[];
  indications_and_usage?: string[];
  dosage_and_administration?: string[];
  contraindications?: string[];
  warnings_and_cautions?: string[];
  adverse_reactions?: string[];
  adverse_reactions_table?: string;
  clinical_pharmacology_table?: string;
}

const [drugLabel, setDrugLabel] = useState<DrugLabelData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLabel, setShowLabel] = useState(false);
  const [showSearchModal] = useState(false);
  const [modalSearchContent] = useState("");
  const { t } = useTranslation(); 
  useEffect(() => {
    const fetchDrugLabel = async () => {
      if (!brandName) return;
      console.log(`Fetching drug label for brandName: ${brandName}`);
      const apiUrl = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(brandName)}"&limit=1`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Error fetching drug label: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched drug label data:', data);
        setDrugLabel(data.results[0]); // Store the first result
      } catch (err) {
        console.error('Error fetching drug label:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      }
    };

    fetchDrugLabel();
  }, [brandName]);

  const handleIconClick = () => {
    setShowLabel(!showLabel);
    console.log('Toggled showLabel to:', !showLabel);
  };

  return (
    <div>
      <button onClick={handleIconClick} title={t('showFDADrugInfo')} className="pillbutton">
        <FaFileAlt />
      </button>
      {showLabel && (
        <div className='modal'>
          <div className='modal-content'>
            <span className="close-btn" onClick={() => setShowLabel(false)}>
              &times;
            </span>

            {error && (
              <p>{t('error')}: {error}</p> 
            )}

            {/* Drug label exists block */}
            {!error && drugLabel && (
              <div className="label-details">
                <h4>{t('drugLabelInformation')}:</h4> {/* Internationalized heading */}
                <p><strong>{t('indicationsAndUsage')}:</strong> {drugLabel.indications_and_usage?.[0] || t('notAvailable')} </p>
                <p><strong>{t('dosageAndAdministration')}:</strong> {drugLabel.dosage_and_administration?.[0] || t('notAvailable')}</p>
                <p><strong>{t('contraindications')}:</strong> {drugLabel.contraindications?.[0] || t('notAvailable')}</p>
                <p><strong>{t('warningsAndCautions')}:</strong></p>
                <ul>
                  {drugLabel.warnings_and_cautions?.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
                <p><strong>{t('adverseReactions')}:</strong> {drugLabel.adverse_reactions?.[0] || t('notAvailable')}</p>
                            {/* Tables, rendered using dangerouslySetInnerHTML */}
            {drugLabel?.adverse_reactions_table ? (
              <div>
                <h4>{t('adverseReactionsTable')}:</h4>
                <div dangerouslySetInnerHTML={{ __html: drugLabel.adverse_reactions_table[0] }} />
              </div>
            ) : (
              <p>{t('notAvailable')}</p>
            )}

            {drugLabel?.clinical_pharmacology_table ? (
              <div>
                <h4>{t('clinicalPharmacologyTable')}:</h4>
                <div dangerouslySetInnerHTML={{ __html: drugLabel.clinical_pharmacology_table[0] }} />
              </div>
            ) : (
              <p>{t('notAvailable')}</p>
            )}

            <div><strong>{t('overdosage')}:</strong>
              {drugLabel?.overdosage?.length ? (
                drugLabel.overdosage.map((item, index) => <p key={index}>{item}</p>)
              ) : (
                <p>{t('notAvailable')}</p>
              )}
            </div>

            <div><strong>{t('pregnancy')}:</strong>
              {drugLabel?.pregnancy?.length ? (
                drugLabel.pregnancy.map((item, index) => <p key={index}>{item}</p>)
              ) : (
                <p>{t('notAvailable')}</p>
              )}
            </div>

            <div><strong>{t('storageAndHandling')}:</strong>
              {drugLabel?.storage_and_handling?.length ? (
                drugLabel.storage_and_handling.map((item, index) => <p key={index}>{item}</p>)
              ) : (
                <p>{t('notAvailable')}</p>
              )}
            </div>
              </div>
            )}

            {!error && !drugLabel && (
              <p>{t('loadingDrugLabelInfo')}</p>  
            )}
            {showSearchModal && (
                <div className='modal'>
                        {modalSearchContent} 
                </div>
            )}     

          </div>
        </div>
      )}
    </div>
  );
};
export default DrugLabel;
