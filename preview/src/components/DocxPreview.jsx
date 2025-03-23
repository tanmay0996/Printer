// DocxPreview.jsx
import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';

const DocxPreview = ({ file }) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        try {
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setHtml(result.value);
        } catch (error) {
          console.error('Error converting DOCX:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, [file]);

  const containerStyle = {
    padding: '16px',
    lineHeight: '1.6',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #ccc',
    borderRadius: '4px',
    maxHeight: '750px', // Sets a maximum height for the container
    overflowY: 'auto',  // Enables vertical scrolling if content exceeds the height
    overflowX: 'auto',  // Enables horizontal scrolling if needed
  };

  return (
    <div style={{ margin: '20px 0' }}>
      {html ? (
        <div style={containerStyle} dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p>Loading DOCX preview...</p>
      )}
    </div>
  );
};

export default DocxPreview;
