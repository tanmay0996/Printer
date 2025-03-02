import React, { useEffect, useState } from 'react';
import { getDocument } from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

const PDFThumbnailGrid = ({ fileUrl, slidesPerPage }) => {
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    const loadingTask = getDocument(fileUrl);
    loadingTask.promise.then((pdf) => {
      const numPages = pdf.numPages;
      const pagePromises = [];
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        pagePromises.push(pdf.getPage(pageNum));
      }
      Promise.all(pagePromises).then((pages) => {
        const thumbPromises = pages.map((page) => {
          // Adjust the scale as needed for thumbnail size
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const context = canvas.getContext('2d');
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          return page.render(renderContext).promise.then(() => canvas.toDataURL());
        });
        Promise.all(thumbPromises).then((images) => {
          setThumbnails(images);
        });
      });
    });
  }, [fileUrl]);

  // Group thumbnails into pages, each containing slidesPerPage thumbnails.
  const groups = [];
  for (let i = 0; i < thumbnails.length; i += slidesPerPage) {
    groups.push(thumbnails.slice(i, i + slidesPerPage));
  }

  // For slidesPerPage = 4, force 2 columns; otherwise use a general formula.
  const columns = slidesPerPage === 4 ? 2 : Math.ceil(Math.sqrt(slidesPerPage));

  return (
    // Outer container with maximum height and vertical scrolling
    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
      {groups.map((group, groupIndex) => (
        <div
          key={groupIndex}
          style={{
            border: '10px solid #ccc',
            marginBottom: '1rem',
            padding: '0.5rem',
            maxHeight:'600px'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: '1rem',
            }}
          >
            {group.map((thumb, index) => (
              <img
                key={index}
                src={thumb}
                alt={`Slide ${groupIndex * slidesPerPage + index + 1}`}
                style={{
                  width: '100%',
                  height: '250px', // Fixed height for each slide thumbnail
                  objectFit: 'contain',
                  border: '1px solid #333', // Border for each slide
                  padding: '0.25rem', // Optional padding within each slide
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PDFThumbnailGrid;
