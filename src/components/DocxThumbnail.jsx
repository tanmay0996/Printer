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
          // Convert DOCX to HTML (you may adjust options to limit output)
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

  return (
    <div
      style={{
        width,
        height,
        overflow: 'hidden',
        border: '1px solid #ccc',
        padding: '4px',
        fontSize: '12px',
        lineHeight: '1.2em'
      }}
      // Render only a portion (the first “page”) of the content.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default DocxThumbnail;
