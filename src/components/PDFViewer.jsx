// PDFViewer.jsx
import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PDFViewer = ({ fileUrl, previewStyle }) => {
  if (!fileUrl) return <div>No PDF file provided.</div>;
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
      <div style={{ ...previewStyle }}>
        <Viewer key={fileUrl} fileUrl={fileUrl} />
      </div>
    </Worker>
  );
};

export default PDFViewer;
