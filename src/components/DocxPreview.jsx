// DocxPreview.jsx
import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';

const DocxPreview = ({ file }) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const readDocxFile = async () => {
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
    };

    if (file) {
      readDocxFile();
    }
  }, [file]);

  return (
    <div>
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p>Loading DOCX preview...</p>
      )}
    </div>
  );
};

export default DocxPreview;
