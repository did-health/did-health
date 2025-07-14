import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assistantImage from './../../images/metacare-avatar.png';
import { FaTrash, FaBars, MdHistory, FaPills, FaClock, FaPlusCircle, FaMinusCircle, FaCamera, FaInfoCircle, FaFilter, FaTimesCircle, FaDownload } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import DrugWarnings from './buttons/DrugWarnings';
import DrugLabel from './buttons/DrugLabel';
import PillScanner from './buttons/MedicineScanner';

interface Props {
  // Add any props that this component accepts
}

interface MedicationStatement {
  resourceType: string;
  medicationCodeableConcept: {
    text: string;
  };
  status: string;
  dosage: Array<{
    text: string;
    route: {
      text: string;
    };
    timing: {
      repeat: {
        when: string[];
        timeOfDay: string[];
      };
    };
  }>;
}

const MedicationStatement: React.FC<Props> = () => {
  const [medicationStatements, setMedicationStatements] = useState<Array<MedicationStatement>>([]);
  const [medication, setMedication] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [status, setStatus] = useState('active');
  const [dosage, setDosage] = useState('');
  const [route, setRoute] = useState('');
  const [timing, setTiming] = useState(['']);
  const [daysOfWeek, setDaysOfWeek] = useState(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'AS']);
  const [selectedDays, setSelectedDays] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalSearchContent, setModalSearchContent] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const { t } = useTranslation();
  interface DrugDetails {
  brand_name: string;
  generic_name: string;
  labeler_name: string;
  active_ingredients: Array<{ name: string; strength: string }>;
  product_ndc: string;
  dosage_form: string;
  drug_interactions: string[];
  route: string;
}

const [drugDetails, setDrugDetails] = useState<DrugDetails | null>(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [todayInfo, setTodayInfo] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [medicationLog, setMedicationLog] = useState([]);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);
  const [medicationImage, setMedicationImage] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState<string | null>(null);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [pillImage, setPillImage] = useState(null); // State to hold the pill image
  const navigate = useNavigate();
  // Callback function to receive the image from the PillScanner
  const handlePillImage = (image: React.SetStateAction<null>) => {
    setPillImage(image);
    setModalOpen(false); // Close modal after image is selected
  };

  // Function to filter the medication log
  const filteredLog = medicationLog.filter(logEntry => {
    const matchesText = logEntry.medicationCodeableConcept.text.toLowerCase().includes(filterText.toLowerCase());
    const matchesDate = filterDate ? new Date(logEntry.effectiveDateTime).toLocaleDateString() === filterDate : true;
    return matchesText && matchesDate;
  });
  // Open the confirmation modal
  const handleDelete = (index: string) => {
    console.log('deleting index' + index)
    setDeleteIndex(index);
    setConfirmDeleteModalOpen(true);
  };

  // Close the modal if the user cancels
  const handleCancelDelete = (e?: React.MouseEvent) => {
    setConfirmDeleteModalOpen(false);
    setDeleteIndex(null);
  };
  // Perform the deletion if confirmed
  const handleConfirmDelete = () => {
    console.log(deleteIndex);
    // Filter out the medication by its name
    const updatedStatements = medicationStatements.filter(
      (statement) => statement.medicationCodeableConcept.text !== deleteIndex
    );
    setMedicationStatements(updatedStatements);
    localStorage.setItem('MedicationStatement', JSON.stringify(updatedStatements));
    setConfirmDeleteModalOpen(false);
    setDeleteIndex(null); // Reset after deletion
  };


  // Define the onConfirm function that will be passed to MedicineScanner
  const handleFDAResultConfirm = (result: string) => {
    setMedication(result); // Store the confirmed medication result
    console.log('Confirmed FDA result:', result);

  };

  const handleShowKnowledge = (medication: string) => {
    let knowledge = getMedicationKnowledgeFromLocalStorage(medication);

    if (knowledge) {
      // Directly use the base64 string to form the image source
      const imageSrc = `data:image/jpeg;base64,${knowledge}`;
      setMedicationImage(imageSrc);  // Set the image source
    } else {
      setMedicationImage(null);  // No image found
    }

    setSelectedMedication(medication);  // Set the selected medication
  };

  const getMedicationKnowledgeFromLocalStorage = (medicationName: string) => {
    // Get medication knowledge from localStorage
    const storedData = localStorage.getItem('MedicationKnowledge');

    // Parse the data if it exists
    if (storedData) {
      const medicationKnowledge = JSON.parse(storedData);

      // Find the medication by matching the name
      const medicationItem = medicationKnowledge.find(
        (item: { name: string; }) => item.name?.toLowerCase() === medicationName?.toLowerCase()
      );

      // If the medication item is found, proceed to find the binary image
      if (medicationItem && medicationItem.definitional) {
        const drugCharacteristic = medicationItem.definitional.drugCharacteristic;

        // Find the characteristic that has the type code "image"
        const imageCharacteristic = drugCharacteristic.find(
          (char: { type: { coding: any[]; }; }) =>
            char.type?.coding?.some(
              (coding: { code: string; system: string; }) =>
                coding.code === "image" &&
                coding.system === "http://terminology.hl7.org/CodeSystem/drug-char-type"
            )
        );

        // If the image characteristic is found, return the decoded base64 image
        if (imageCharacteristic?.valueBase64Binary) {
          const base64Binary = imageCharacteristic.valueBase64Binary;

          return base64Binary;
        }
      }
    }

    return null; // Return null if no data or no matching image is found
  };

  useEffect(() => {
    
    if ('Notification' in window) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    } else {
      console.error("Notifications are not supported on this browser.");
    }   
  }, []);


  useEffect(() => {
    if (shouldRescheduleNotifications()) {
      console.log('Rescheduling notifications for the next 24 hours');
      scheduleNotificationsForDay();
    }

    const interval = setInterval(() => {
      if (shouldRescheduleNotifications()) {
        console.log('Rescheduling notifications for the next 24 hours');
        scheduleNotificationsForDay();
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, [medicationStatements]);
  useEffect(() => {
    if (logModalOpen) {
      const storedLog = JSON.parse(localStorage.getItem('MedicationAdministration')) || [];
      setMedicationLog(storedLog);
    }
  }, [logModalOpen]);
  const fhirUrl = localStorage.getItem('fhirUrl');
  const handleDropdownToggle = () => {
    setIsDropdownOpen(prevState => !prevState);
  };
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const date = today.toLocaleDateString('en-US');
    const time = today.toLocaleTimeString('en-US');

    const todayIndex = today.getDay(); // 0 = Sunday, 6 = Saturday
    setSelectedDay(daysOfWeek[todayIndex]);
    setTodayInfo(`${dayOfWeek}, ${date} at ${time}`);
  }, []);
  const [medicationAdministrations, setMedicationAdministrations] = useState(() => {
    const savedAdministrations = localStorage.getItem('MedicationAdministration');
    return savedAdministrations ? JSON.parse(savedAdministrations) : [];
  })
  const logDosage = (medication: any, dosage: string) => {
    const now = new Date().toISOString();
    const medicationAdministration = {
      resourceType: "MedicationAdministration",
      status: "completed",
      medicationCodeableConcept: {
        text: medication
      },
      effectiveDateTime: now,
      dosage: {
        text: dosage,
        route: { text: "Oral" }, // assuming oral for simplicity
        dose: { value: parseInt(dosage), unit: "mg" }
      }
    };
    // Update state and save in localStorage
    const updatedRecords = [...medicationAdministrations, medicationAdministration];
    setMedicationAdministrations(updatedRecords);
    localStorage.setItem('MedicationAdministration', JSON.stringify(updatedRecords));
  };

  // Handle multiple times for medication intake
  const handleTimeChange = (value: string, index: number) => {
    const updatedTiming = [...timing];
    updatedTiming[index] = value;
    setTiming(updatedTiming);
  };
  // Add new time input field
  const addTime = () => {
    setTiming([...timing, '']);
  };
  // Remove a time input field
  const removeTime = (index: number) => {
    setTiming(timing.filter((_, idx) => idx !== index));
  };
  const handleDaySelection = (day: string) => {
    if (day === 'AS') {
      setSelectedDays(['AS']); // If 'As Needed' is selected, clear all other days
    } else {
      // Deselect 'As Needed' if another day is selected
      setSelectedDays((prevDays) =>
        prevDays.includes(day)
          ? prevDays.filter((d) => d !== day)  // Remove if already selected
          : [...prevDays.filter((d) => d !== 'AS'), day] // Add selected day
      );
    }
  };

  // Load saved medication statements from localStorage
  useEffect(() => {
    const storedStatements = JSON.parse(localStorage.getItem('MedicationStatement')) || [];
    setMedicationStatements(storedStatements);
  }, []);
  // Fetch suggestions from FDA API
  const fetchSuggestions = async (query: any) => {
    try {
      const response = await fetch(`https://api.fda.gov/drug/ndc.json?limit=5&search=brand_name_base:"${query}"`);
      if (!response.ok) {
        throw new Error('Error fetching drug information');
      }
      const data = await response.json();
      setSuggestions(data.results.map((item: { brand_name: any; }) => item.brand_name));
    } catch (error) {
      setSuggestions([]);
      console.error(error);
    }
  };
  const handleInputChange = (event: { preventDefault: () => void; target: { value: any; }; }) => {
    event.preventDefault();
    const query = event.target.value;
    setMedication(query);
    if (query.length >= 3) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  };
  const handleSuggestionClick = (suggestion: React.SetStateAction<string>) => {
    setMedication(suggestion);

    // Fetch the full drug details
    const selectedDrug = suggestions.find(item => item.brand_name === suggestion);

    if (selectedDrug && selectedDrug.route) {
      setRoute(selectedDrug.route.join(', ')); // Set the first route as default
    }

    setSuggestions([]);  // Clear the suggestions dropdown
  };
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Check if medication is present
    if (!medication) {
      alert(t('formValidationErrorMessage'));
      return;
    }

    // Ensure the user has selected either "As Needed" or specific days
    if (selectedDays.length === 0 || (selectedDays.length === 1 && selectedDays[0] !== 'AS')) {
      console.log(selectedDays.length);
      console.log(selectedDays[0])
      alert(t('daysSelectionErrorMessage'));
      return;
    }

    // If days of the week are selected, check if timing is provided
    if (selectedDays[0] !== 'AS' && !timing.length) {
      alert(t('timingErrorMessage'));
      return;
    }
    const newStatement = {
      resourceType: "MedicationStatement",
      medicationCodeableConcept: {
        text: medication
      },
      status: status,
      dosage: [{
        text: dosage,
        route: { text: route },
        timing: {
          repeat: {
            when: selectedDays,   // Include selected days
            timeOfDay: timing     // Include multiple times
          },
        }
      }],
    };

    const updatedStatements = [...medicationStatements, newStatement];
    setMedicationStatements(updatedStatements);
    localStorage.setItem('MedicationStatement', JSON.stringify(updatedStatements));
    // Schedule the notification for the added medication
    scheduleNotification(newStatement);

    // Clear the form fields after submission
    setMedication('');
    setStatus('active');
    setDosage('');
    setRoute('');
    setTiming(['']);
    setSelectedDays([]);
    setSuccessModalOpen(true);
    setPillImage(null)
  };
  const handleMedLookup = async (medication: any) => {
    try {
      const response = await fetch(
        `https://api.fda.gov/drug/ndc.json?limit=1&search=brand_name_base:"${medication}"`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setDrugDetails(data.results[0]);
        setModalOpen(true); // Open the modal
      } else {
        setDrugDetails(null);
        alert(t('noMedicationFoundMessage'));
      }
    } catch (error) {
      console.error('Error fetching drug details:', error);
    }
  };
  const storeNotificationTime = (medicationId: string | number, time: string) => {
    const notificationSchedule = JSON.parse(localStorage.getItem('notificationSchedule')) || {};
    notificationSchedule[medicationId] = time;
    localStorage.setItem('notificationSchedule', JSON.stringify(notificationSchedule));
  };
  const scheduleNotification = (statement: { resourceType?: string; medicationCodeableConcept: any; status?: string; dosage: any; id?: any; }) => {

    const dosageTimes = statement.dosage[0].timing?.repeat?.timeOfDay || [];

    dosageTimes.forEach((time: { split: (arg0: string) => { (): any; new(): any; map: { (arg0: NumberConstructor): [any, any]; new(): any; }; }; }) => {
      const notificationTime = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      notificationTime.setHours(hours, minutes, 0, 0);

      if (notificationTime > new Date()) {
        const timeUntilNotification = notificationTime.getTime() - Date.now();
        console.log(`Scheduling notification for ${statement.medicationCodeableConcept.text} at ${notificationTime}`);

        // Store the notification time in localStorage
        storeNotificationTime(statement.id, notificationTime.toISOString());

        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification(`Time to take your medication: ${statement.medicationCodeableConcept.text}`, {
              body: `Dosage: ${statement.dosage[0].text}`,
            });
          }
        }, timeUntilNotification);
      }
    });
  };

  const LAST_SCHEDULED_KEY = 'lastScheduledTime';

  const scheduleNotificationsForDay = () => {
    medicationStatements.forEach(scheduleNotification);
    localStorage.setItem(LAST_SCHEDULED_KEY, new Date().toISOString());
  };

  const shouldRescheduleNotifications = () => {
    const lastScheduled = localStorage.getItem(LAST_SCHEDULED_KEY);
    if (!lastScheduled) return true;
    const lastScheduledDate = new Date(lastScheduled);
    const now = new Date();
    const timeDiff = now - lastScheduledDate; // Difference in milliseconds
    return timeDiff > 23.5 * 60 * 60 * 1000; // More than 23 hours and 30 minutes
  };

  const handleSuccessModalClose = () => {
    setSuccessModalOpen(false);
    setScannerModalOpen(false);  // Close any other open modals
    setModalOpen(false);         // Close the pill scanner modal
  };

  // Handle Select All/Unselect All functionality excluding 'AS'
  const handleSelectAllChange = (e: { target: { checked: any; }; }) => {
    if (e.target.checked) {
      // Select all days except 'AS'
      const daysWithoutAS = daysOfWeek.filter(day => day !== 'AS');
      setSelectedDays(daysWithoutAS);
    } else {
      // Deselect all days
      setSelectedDays([]);
    }
  };

  return (
    <div>
      <img src={assistantImage} alt="Meta Care" style={{ width: '100px', height: 'auto' }} /><br />
      <div>
        <h2>{t('virtualPillbox')}</h2>
        <p>{t('appDescription')}</p>
        <p>{t('todayIs')} {todayInfo}</p>
        <table className="pillbox-table">
          <tbody>
            <tr>
              {daysOfWeek.map((day, index) => (
                <td
                  key={index}
                  onClick={() => setSelectedDay(day)} // Set selected day on click
                  className={selectedDay === day ? 'selected-day' : ''}
                >
                  {t(day)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <div>
          <h4>{t('medicationsFor', { day: selectedDay === 'AS' ? t('asNeeded') : selectedDay })}</h4>
          {medicationStatements
            .filter(statement => {
              const days = statement.dosage[0].timing.repeat.when || [];

              if (days.length === 0) return selectedDay === 'AS';
              if (selectedDay === 'AS') return days.includes('AS');
              return days.includes(selectedDay);
            })
            .map((statement, index) => (
              <div key={index} className="medication-info">
                <button onClick={() => handleMedLookup(statement.medicationCodeableConcept.text)} className="button-link">
                  {statement.medicationCodeableConcept.text}
                </button>

                {/* Dosage */}
                {statement.dosage[0].text && (
                  <div className="field">
                    <strong>{t('dosage')}:</strong> {statement.dosage[0].text}
                  </div>
                )}

                {/* Route */}
                {statement.dosage[0].route && statement.dosage[0].route.text && (
                  <div className="field">
                    <strong>{t('route')}:</strong> {statement.dosage[0].route.text}
                  </div>
                )}

                {/* Time */}
                {statement.dosage[0].timing && statement.dosage[0].timing.repeat && (
                  <div className="field">
                    <strong>{t('time')}:</strong>
                    {statement.dosage[0].timing.repeat.timeOfDay.length > 0 ? (
                      statement.dosage[0].timing.repeat.timeOfDay.map((time: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Iterable<React.ReactNode> | null | undefined, idx: React.Key | null | undefined) => (
                        <div key={idx}>{time}</div>
                      ))
                    ) : (
                      t('asNeeded')
                    )}
                  </div>
                )}
                <button className="pillbutton" onClick={() => handleShowKnowledge(statement.medicationCodeableConcept.text)} title={t('showPillPhoto')}>
                  <FaInfoCircle />
                </button>
                <DrugLabel brandName={statement.medicationCodeableConcept.text} setShowSearchModal={setShowSearchModal} onClose={setModalOpen} setModalSearchContent={setModalSearchContent} />
               <DrugWarnings brandName={statement.medicationCodeableConcept.text} />
                <button className="pillbutton" title={t('logMedicationAdministration')} onClick={() => logDosage(statement.medicationCodeableConcept.text, "500")}>
                  <MdHistory />
                </button>
                <button className="pillbutton" title={t('delete')} onClick={() => handleDelete(statement.medicationCodeableConcept.text)}>
                  <FaTrash />
                </button>
              </div>

            ))}
        </div>
      </div>
      <div>
        <div>
          <label>{t('medicationAdministrationLog')}</label><button className="pillbutton" title={t('getMedAdminHistory')} onClick={() => setLogModalOpen(true)}>
            <FaPills /> <MdHistory />
          </button>
         <label>{t('addMedication')}</label><button className="pillbutton" title={t('addMedication')} onClick={() => setAddModalOpen(true)}>
            <FaPlusCircle /> <FaPills />
          </button>
        </div>
        {modalOpen && drugDetails && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-btn" onClick={() => setModalOpen(false)}>
                &times;
              </span>
              <h2>{drugDetails.brand_name} ({drugDetails.generic_name})</h2>
              <p><strong>{t('labeler')}:</strong> {drugDetails.labeler_name}</p>
              <p><strong>{t('activeIngredients')}:</strong> {drugDetails.active_ingredients.map((ai: { name: any; strength: any; }) => `${ai.name} (${ai.strength})`).join(', ')}</p>
              <p><strong>{t('productNDC')}:</strong> {drugDetails.product_ndc}</p>
              <p><strong>{t('dosageForm')}:</strong> {drugDetails.dosage_form}</p>
              <p><strong>{t('drugInteractions')}:</strong></p>
              <ul>
                {Array.isArray(drugDetails.drug_interactions) && drugDetails.drug_interactions.length > 0 ? (
                  drugDetails.drug_interactions.map((interaction: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Iterable<React.ReactNode> | null | undefined, index: React.Key | null | undefined) => (
                    <li key={index}>{interaction}</li>
                  ))
                ) : (
                  <li>{t('noDrugInteractions')}</li> // fallback if no interactions are found
                )}
              </ul>
              <p><strong>{t('route')}:</strong> {drugDetails.route.join(', ')}</p>
            </div>
          </div>
        )}

        {/* Conditionally render the image if a medication is selected and the image is found */}
        {selectedMedication && medicationImage ? (
          <div className='modal'>
            <div className='modal-content'>
              <span className="close-btn" onClick={() => setSelectedMedication(false)}>
                &times;
              </span>
              <h3>{selectedMedication.name}</h3>

              {/* Show the image */}
              <img
                src={medicationImage}
                alt={`${selectedMedication.name} Image`}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </div>
        ) : (
          selectedMedication && (
            <div className='modal'>
              <div className='modal-content'>
                <span className="close-btn" onClick={() => setSelectedMedication(false)}>
                  &times;
                </span>
                <h3>{selectedMedication.name}</h3>
                <p>No image found for {selectedMedication.name}</p>
              </div>
            </div>

          )
        )}

        {addModalOpen && (
          <div className='modal'>
            <div className='modal-content'>
              <span className="close-btn" onClick={() => setAddModalOpen(false)}>
                &times;
              </span>
              <form id="form-medication-stmt" onSubmit={handleSubmit}>
                <label>{t('medicationName')}:</label>
                <div className="form-group">
                  <input
                    type="text"
                    value={medication || ""}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                    placeholder={t('enterMedicationNamePlaceholder')}
                  />
                </div>
                {suggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="suggestion-item"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="form-group">
                  <label>{t('daysOfWeek')}: </label>
                  <div className="days-checkbox">
                    {daysOfWeek.map((day, index) => (
                      <label key={index}>
                        <input
                          type="checkbox"
                          value={day}
                          onChange={(e) => handleDaySelection(e.target.value)}
                          checked={selectedDays.includes(day)}
                        />
                        {t(day)}
                      </label>
                    ))}
                  </div>
                  <div className="select-all-container">
                  <label>{t('selectAll')}</label>
                  <input
                    type="checkbox"
                    onChange={handleSelectAllChange}
                    checked={selectedDays.length === daysOfWeek.filter(day => day !== 'AS').length}
                  />
                </div>
                </div>
                <div className="form-group">
                  <label>{t('timeToTake')}:</label>
                  {timing.map((time, idx) => (
                    <div key={idx} className="timing-row">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => handleTimeChange(e.target.value, idx)}
                      />
                      <button
                        type="button"
                        onClick={() => removeTime(idx)}
                        title={t('removeTimeTitle')}  // Tooltip for removing time
                      >
                        <FaMinusCircle /> <FaClock />
                      </button>
                      <button
                        type="button"
                        onClick={addTime}
                        title={t('addTimeTitle')}  // Tooltip for adding time
                      >
                        <FaPlusCircle /> <FaClock />
                      </button>
                    </div>
                  ))}

                </div>
                <div className='form-group'>
                  <button className="pillbutton" title={t('takePillPicture')} onClick={(event) => {
                    event.preventDefault(); // Prevent form submission
                    setModalOpen(true);      // Open the modal
                  }}><FaCamera size={32} /> </button>
                  {modalOpen && (
                    <PillScanner medicationName={medication} onClose={() => setModalOpen(false)} onImageCapture={handlePillImage} />
                  )}
                  <label>{t('takePillPicture')} </label>
                </div>
                {/* Display pill image if available */}
                {pillImage && (
                  <div className="pill-image-container">
                    <img src={pillImage} alt={t('pillImageAlt')} />
                  </div>
                )}
                <button className="pillbutton" title={t('addMedication')} type="submit"><FaPlusCircle /><FaPills /> </button>
              </form>
            </div>
          </div>
        )}
        {showSearchModal && (
          <div className="modal">
            {modalSearchContent}
          </div>
        )}

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <button onClick={() => setShowModal(false)}>OK</button>
            </div>
          </div>
        )}
        {/* Success Modal */}
        {successModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>{t('successTitle')}</h2>
              <p>{t('medicationSavedMessage')}</p>
              <button onClick={handleSuccessModalClose}>
                {t('okButton')}
              </button>
            </div>
          </div>
        )}
        {logModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-btn" onClick={() => setLogModalOpen(false)}>
                &times;
              </span>
              <h2>{t('medicationAdministrationLog')}</h2>
              {/* Filter Input Fields */}
              <div className="content">
                <label><FaFilter style={{ color: '#FF2D55' }} /><input
                  type="text"
                  placeholder={t('filterByMedication')}
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />{t('filterByDate')}
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </label>
              </div>

              {/* Display filtered medication log */}
              {filteredLog.length > 0 ? (
                <ul>
                  {filteredLog.map((logEntry, index) => (
                    <li key={index}>
                      <strong>{t('medication')}:</strong> {logEntry.medicationCodeableConcept.text} <br />
                      <strong>{t('dosage')}:</strong> {logEntry.dosage.text} ({logEntry.dosage.dose.value} {logEntry.dosage.dose.unit}) <br />
                      <strong>{t('route')}:</strong> {logEntry.dosage.route.text} <br />
                      <strong>{t('timeAdministered')}:</strong> {new Date(logEntry.effectiveDateTime).toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{t('noLogsFound')}</p>
              )}
            </div>
          </div>
        )}
        {confirmDeleteModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-btn" onClick={handleCancelDelete}>
                &times;
              </span>
              <h2>{t('confirmDeleteTitle')}</h2>
              <p>{t('confirmDeletePillMessage', { medication: selectedMedication })}</p>
              <div className='form-group'>
                <button
                  className="pillbutton"
                  onClick={() => handleConfirmDelete(selectedMedication)}
                >
                  <FaTrash />
                </button>

                <button
                  className="pillbutton"
                  onClick={handleCancelDelete}
                >
                  <FaTimesCircle />
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="copyright">
          {t('copyright')}
        </div>
        <div className="copyright">
          {t('useOfMetaCareAgreement')}&nbsp;
          {/* Navigate to /terms */}
          <button className="button-link" onClick={() => navigate('/terms')}>
            {t('termsOfUse')}
          </button>
          &nbsp;{t('and')}&nbsp;

          {/* Navigate to /privacy */}
          <button className="button-link" onClick={() => navigate('/privacy')}>
            {t('privacy')}
          </button>
        </div>
        <div className="disclaimer">{t('safetyWarning')}</div>
        <div className="disclaimer">
          {t('disclaimer')}
        </div>
      </div>

    </div>
  );
};

export default MedicationStatement;
