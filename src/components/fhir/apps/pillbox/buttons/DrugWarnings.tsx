import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const DrugWarnings = ({ brandName }) => {
  const [pharmClasses, setPharmClasses] = useState([]);
  const [adverseReports, setAdverseReports] = useState([]);
  const [error, setError] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const { t } = useTranslation();

  // Function to check for interactions between adverse events and medications in localStorage
  const checkForInteractions = (adverseReports) => {
    const medicationStatements = JSON.parse(localStorage.getItem('MedicationStatement'));

    if (!medicationStatements) {
      console.warn('No MedicationStatements found in local storage.');
      return;
    }

    let interactionFound = false;

    adverseReports.forEach((report) => {
      report.patient.drug.forEach((drug) => {
        medicationStatements.forEach((medStatement) => {
          const medicationName = medStatement?.medicationCodeableConcept?.text?.trim().toLowerCase();
          const adverseDrugName = drug?.medicinalproduct?.trim().toLowerCase();

          if (medicationName && adverseDrugName) {
            console.log(`Checking: Medication (${medicationName}) vs Adverse Drug (${adverseDrugName})`);
            if (medicationName === adverseDrugName) {
              interactionFound = true;
              drug.hasInteraction = true; // Mark the drug for visual indication
              alert(`⚠️ Interaction found with ${medicationName}!`);
            }
          }
        });
      });
    });

    if (!interactionFound) {
      console.log("No interactions found with current medications.");
    }
  };

  const cleanPharmClass = (pharmClass) => {
    return pharmClass.replace(/\[.*?\]/g, '').trim().replace(/\s+/g, '+');
  };

  useEffect(() => {
    if (!brandName) return;

    const fetchPharmClasses = async () => {
      const apiUrl = `https://api.fda.gov/drug/ndc.json?search=brand_name:${encodeURIComponent(brandName)}&limit=1`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Error fetching pharm classes: ${response.status}`);

        const data = await response.json();
        const pharmClassesArray = data.results[0]?.pharm_class || [];
        setPharmClasses(pharmClassesArray);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPharmClasses();
  }, [brandName]);

  useEffect(() => {
    if (pharmClasses.length === 0) return;

    const fetchAdverseReports = async () => {
      setAdverseReports([]);

      const fetchReport = async (pharmClass) => {
        const cleanedPharmClass = cleanPharmClass(pharmClass);
        const apiUrl = `https://api.fda.gov/drug/event.json?search=patient.drug.pharm_class:${cleanedPharmClass}&limit=1`;

        try {
          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error(`Error fetching adverse reports: ${response.status}`);

          const data = await response.json();
          return data.results[0];
        } catch (err) {
          //setError(err.message);
          return null;
        }
      };

      const allReports = await Promise.all(
        pharmClasses.map(pharmClass => fetchReport(pharmClass))
      );

      setAdverseReports(allReports.filter(report => report));
    };

    fetchAdverseReports();
  }, [pharmClasses]);

  // Update to only check for interactions when opening the modal
  const handleIconClick = () => {
    setShowWarning(!showWarning);

    // Only check for interactions when the modal is opening
    if (!showWarning) {
      checkForInteractions(adverseReports);
    }
  };

  if (error) {
    return <p>{t('error')}: {error}</p>;
  }

  if (adverseReports.length === 0) {
    return <p>{t('loading')}</p>;
  }

  return (
    <div className="drug-warnings-container">
      <button  onClick={handleIconClick} className="pillbutton">
        <FaExclamationTriangle className="warning-icon" />
      </button>

      {showWarning && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowWarning(false)}>&times;</span>
            <h2>{t('adverseReactionReports')}</h2>
            {adverseReports.map((report, index) => (
              <div key={index} className="adverse-report">
                <h3>{t('reportID')}: {report.safetyreportid}</h3>
                <p><strong>{t('seriousness')}:</strong> {report.serious === "1" ? t('serious') : t('nonSerious')}</p>
                
                <div className="reaction-info">
                  <h3>{t('reactions')}</h3>
                  {report.patient.reaction.map((reaction, idx) => (
                    <p key={idx}>{reaction.reactionmeddrapt}</p>
                  ))}
                </div>

                <div className="drug-info">
                  <h3>{t('drugInformation')}</h3>
                  {report.patient.drug.map((drug, idx) => (
                    <p key={idx}>
                      <strong>{t('medicinalProduct')}:</strong> {drug.medicinalproduct}
                      {drug.hasInteraction && <FaExclamationTriangle className="shared-button" />} {/* Add warning icon */}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugWarnings;
