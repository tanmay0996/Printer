// ExcelThumbnail.jsx
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelThumbnail = ({ file, width = 120, height = 160 }) => {
  const [tableHtml, setTableHtml] = useState('');

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      // Use the first sheet for preview
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // Convert sheet to JSON with header rows
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      // Generate a simple HTML table (you can customize styling as needed)
      let html = '<table style="width:100%; border-collapse:collapse;" border="1">';
      jsonData.forEach((row, rowIndex) => {
        // Optionally, only take a few rows to simulate a "first page"
        if (rowIndex > 4) return;
        html += '<tr>';
        row.forEach((cell) => {
          html += `<td style="padding:2px;">${cell || ''}</td>`;
        });
        html += '</tr>';
      });
      html += '</table>';
      setTableHtml(html);
    };
    if (file) {
      reader.readAsBinaryString(file);
    }
  }, [file]);

  return (
    <div
      style={{
        width,
        height,
        overflow: 'hidden',
        border: '1px solid #ccc',
        padding: '2px',
        fontSize: '10px'
      }}
      dangerouslySetInnerHTML={{ __html: tableHtml }}
    />
  );
};

export default ExcelThumbnail;
