import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { FaCamera } from 'react-icons/fa'; // Camera icon
import { useTranslation } from 'react-i18next';
const PillScanner = ({ medicationName, onClose, onImageCapture }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { t } = useTranslation(); 
  // Capture image from camera inside the modal
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      console.log(medicationName)
      onImageCapture(imageSrc); // Pass the image to the parent component
      createMedicationKnowledgeResource(imageSrc, medicationName); // Create MedicationKnowledge FHIR resource
      onClose(); // Close the modal after capturing the image
    }
  };

  const createMedicationKnowledgeResource = (imageSrc, medicationName) => {
    const base64Data = imageSrc.replace(/^data:image\/(png|jpeg);base64,/, '');
  
    const newMedicationKnowledge = {
      resourceType: 'MedicationKnowledge',
      status: 'active',
      name: medicationName,
      definitional: {
        drugCharacteristic: [
          {
            type: {
              coding: [
                {
                  code: 'image',
                  system: 'http://terminology.hl7.org/CodeSystem/drug-char-type',
                },
              ],
              text: 'Pill image',
            },
            valueBase64Binary: base64Data,
          },
        ],
      },
    };
  
    try {
      // Retrieve the existing array of medication knowledge or initialize an empty array
      const storedKnowledge = JSON.parse(localStorage.getItem('medicationKnowledge')) || [];
      
      // Ensure the data is an array before appending
      let knowledgeArray = Array.isArray(storedKnowledge) ? storedKnowledge : [storedKnowledge];
  
      // Append the new resource to the array
      knowledgeArray.push(newMedicationKnowledge);
  
      // Store the updated array back in localStorage
      localStorage.setItem('MedicationKnowledge', JSON.stringify(knowledgeArray));
  
      setMessage('MedicationKnowledge resource saved successfully to local storage!');
    } catch (error) {
      setMessage('Error storing the resource: ' + error.message);
    }
  };
  
  const videoConstraints = {
    facingMode: { exact: "environment" }, // Explicitly request the rear camera
  };

  // Close the modal
  const handleClose = () => {
    onClose();
  };

  return (
    <div className='modal'>
      <div className='modal-content'>
        <span className="close-btn" onClick={handleClose}>
          &times;
        </span>
        <h2>Pill Scanner for {medicationName}</h2>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          width={350}
        />
        <br />
        <button className="pillbutton" title={t('takePillPicture')} onClick={capture}>
          <FaCamera size={32} /> {/* Camera Icon */}
        </button>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <h3>{message}</h3>
        {loading && <p>Processing image, please wait...</p>}
      </div>
    </div>
  );
};

export default PillScanner;
