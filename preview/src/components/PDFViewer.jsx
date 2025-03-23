import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import PDFThumbnailGrid from './PDFThumbnailGrid';

const PDFViewer = ({ fileUrl, previewStyle, slidesPerPage = 1 }) => {
  if (!fileUrl) return <div>No PDF file provided.</div>;

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
      <div style={{ ...previewStyle }}>
        {slidesPerPage > 1 ? (
          <PDFThumbnailGrid fileUrl={fileUrl} slidesPerPage={slidesPerPage} />
        ) : (
          <Viewer key={fileUrl} fileUrl={fileUrl} />
        )}
      </div>
    </Worker>
  );
};

export default PDFViewer;
