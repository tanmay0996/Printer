import React, { useState } from 'react';

const ConvertPpt = () => {
  const [file, setFile] = useState(null);
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Send the file to the backend for conversion
  const handleConvert = async () => {
    if (!file) {
      alert('Please select a file to convert.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/convert', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        setConvertedFileUrl(data.url);
        setError(null);
      } else {
        setError('Conversion failed.');
      }
    } catch (err) {
      console.error('Conversion error:', err);
      setError('An error occurred during conversion.');
    }
  };

  return (
    <div>
      <h2>Convert PPT/PPTX to PDF</h2>
      <input type="file" accept=".ppt,.pptx" onChange={handleFileChange} />
      <button onClick={handleConvert}>Convert</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {convertedFileUrl && (
        <div>
          <a href={convertedFileUrl} target="_blank" rel="noopener noreferrer">
            Download Converted PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default ConvertPpt;
