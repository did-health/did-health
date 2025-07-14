import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import { FaCamera } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const MedicineScanner = ({ onClose, onConfirm  }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [fdaResults, setFdaResults] = useState([]);
  const { t } = useTranslation();
  // Stop words to exclude from FDA search
  const stopWords = [
    'mg', 'ml', 'tablet', 'tablets', 'capsule', 'capsules', 'injection', 'solution', 
    'syrup', 'cream', 'ointment', 'drops', 'spray', 'gel', 'take', 'apply', 'inject', 
    'use', 'for', 'by', 'every', 'with', 'without', 'mouth', 'orally', 'rectally', 
    'topically', 'intramuscular', 'intravenously', 'before', 'after', 'shake', 'store', 
    'protect', 'avoid', 'keep', 'away', 'close', 'cap', 'bottle', 'container', 
    'refrigerate', 'temperature', 'inactive', 'ingredient', 'ingredients', 'water', 
    'sodium', 'chloride', 'alcohol', 'flavor', 'color', 'preservative', 'base', 'powder', 
    'oil', 'warning', 'use', 'only', 'caution', 'consult', 'physician', 'pharmacist', 
    'doctor', 'patient', 'label', 'prescription', 'Rx', 'over-the-counter', 'OTC', 'FDA',
    'rx', , 'tre', 'ears', 'the', 'tl', 'ra', 'one', 'two', 'three'  
  ];
  

  // Capture image from camera inside the modal
  const capture = (event) => {
    event.preventDefault();
    const imageSrc = webcamRef.current.getScreenshot();
    preprocessImage(imageSrc); // Preprocess the image before OCR
  };

  const handleClose = () => {
    onClose(false); // Close the modal after capturing the image
  };

  const handleConfirm = (event, result) => {
    event.preventDefault();
    console.log('Chosen result:', result); // Debugging
    if (result) {
      onConfirm(result); // Pass the chosen result to the parent component
      onClose(false); // Close the modal after user chooses
    }
  };
  // Preprocess image: convert to grayscale and threshold using canvas
  const preprocessImage = (imageSrc) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      // Draw the image on the canvas
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Get the image data and manipulate it (grayscale and thresholding)
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;
      const threshold = 120; // Adjust threshold as needed

      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        // Calculate grayscale value
        const grayscale = red * 0.3 + green * 0.59 + blue * 0.11;

        // Apply threshold to binarize the image (black and white)
        const binaryColor = grayscale > threshold ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = binaryColor;
      }

      // Put the modified data back on the canvas
      ctx.putImageData(imageData, 0, 0);

      // Convert the canvas to a data URL and pass it to OCR
      const processedImageSrc = canvas.toDataURL('image/jpeg');
      processImage(processedImageSrc); // Perform OCR on preprocessed image
    };
  };

// Enhanced text cleaning function to remove capital letters and noise
const cleanText = (text) => {
  // Split the text into words first
  let words = text.split(/\s+/);

  // Filter out words that are ALL CAPS or contain special characters
  words = words
    .filter((word) => {
      // Remove if the word is fully capitalized (ALL CAPS)
      if (word === word.toUpperCase() && word.length > 1) {
        return false;
      }
      return true;
    })
    .map((word) => {
      // Remove special characters and normalize whitespace
      return word.replace(/[^a-zA-Z\s]/g, '').toLowerCase();
    });

  // Filter out stop words and words shorter than 3 characters
  words = words.filter((word) => word.length > 2 && !stopWords.includes(word));

  console.log('clean text', words);
  return words;
};


// Process image and extract text using Tesseract.js
const processImage = (image) => {
  setLoading(true);
  Tesseract.recognize(image, 'eng', {
    logger: (m) => console.log(m), // Optional: For progress tracking
  })
  .then(({ data: { text } }) => {
    setLoading(false);
    console.log('Extracted Text:', text);
    const cleanedWords = cleanText(text); // Clean the extracted text by removing caps
    console.log('Clean Text' , cleanedWords)
    parseTextAndSearchFDA(cleanedWords);  // Pass cleaned words to FDA search
  })
  .catch((err) => {
    setLoading(false);
    console.error('Error during OCR:', err);
  });
};

 // Parse the cleaned text and search FDA for matching medications
 const parseTextAndSearchFDA = async (cleanedWords) => {
  const uniqueResults = new Set();
  let searchPromises = [];

  cleanedWords.forEach((word) => {
    searchPromises.push(searchFDA(word));
  });

  const results = await Promise.all(searchPromises);

  const validResults = results.filter(result => result); // Only non-null results
  if (validResults.length > 0) {
    // Sort by exact match first, assuming you have the logic to determine the best match
    const sortedResults = validResults.sort((a, b) => {
      if (a.isExactMatch) return -1; // Exact match comes first
      return 0;
    });

    setFdaResults(sortedResults); // Display sorted results
    console.log('FDA Results:', sortedResults); //
  } else {
    setFdaResults([{ name: 'No matching medicine found in FDA database.' }]);
  }
};


// Search FDA database using medication name
const searchFDA = async (medication) => {
  try {
    const response = await fetch(
      `https://api.fda.gov/drug/ndc.json?limit=1&search=brand_name_base:"${medication}"`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].brand_name_base; // Return the medicine name if found
    }
  } catch (error) {
    console.log('Error fetching from FDA:', error);
  }
  return null;
};
                                               
const videoConstraints = {
  facingMode: { exact: "environment" }, // Explicitly request the rear camera
};

return (
  <div className="modal">
    <div className="modal-content">
      <span className="close-btn" onClick={() => handleClose()}>&times;</span>
      <h2>Medicine Scanner</h2>
      <Webcam audio={false} ref={webcamRef} videoConstraints={videoConstraints} screenshotFormat="image/jpeg" width={350} />
      <br />
      <button className="pillbutton" onClick={(event) => capture(event)}><FaCamera /></button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <h3>FDA Search Results:</h3>
      {loading ? <p>Processing image, please wait...</p> : (
          <div>
          {fdaResults.map((result, index) => (
            <div key={index}>
              <label>{result}
              {result !== 'No matching medicine found in FDA database.' && (
                <button className='pillbutton' title={t('choose')} onClick={(event) => handleConfirm(event, result)}><FaCheckCircle /> </button>
              )}
              </label>
            </div>
          ))}
        </div>
      )}
      <br />
    </div>
  </div>
);
};

export default MedicineScanner;
