// PDFThumbnail.jsx
import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set the workerSrc for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js';

const PDFThumbnail = ({ fileUrl, width = 120, height = 160 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const renderThumbnail = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });

        // Calculate scale factor to fit desired dimensions
        const scale = Math.min(width / viewport.width, height / viewport.height);
        const scaledViewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
        };

        await page.render(renderContext).promise;
      } catch (error) {
        console.error('Error rendering PDF thumbnail:', error);
      }
    };

    renderThumbnail();
  }, [fileUrl, width, height]);

  return <canvas ref={canvasRef} style={{ width, height, border: 'none' }} />;
};

export default PDFThumbnail;
