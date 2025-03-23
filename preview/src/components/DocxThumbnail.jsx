// DocxThumbnail.jsx
import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';

const DocxThumbnail = ({ file, width = 120, height = 160 }) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const readDocxFile = async () => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        try {
          // Convert DOCX to HTML (adjust options as needed)
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setHtml(result.value);
        } catch (error) {
          console.error('Error converting DOCX:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    };

    if (file) {
      readDocxFile();
    }
  }, [file]);

  const containerStyle = {
    width,
    height,
    overflow: 'hidden', // Thumbnail size; if you need scroll, use overflowY: 'auto'
    border: '1px solid #ccc',
    padding: '4px',
    fontSize: '12px',
    lineHeight: '1.2em',
    backgroundColor: '#fff',
    color: '#333',
  };

  return (
    <div style={containerStyle} dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default DocxThumbnail;
