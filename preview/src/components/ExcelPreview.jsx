// ExcelPreview.jsx
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelPreview = ({ file }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Convert sheet to array-of-arrays format
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setData(jsonData);
      };
      reader.readAsBinaryString(file);
    }
  }, [file]);

  return (
    <div style={{ overflowX: 'auto', margin: '20px 0' }}>
      {data.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {data[0].map((header, index) => (
                <th
                  key={index}
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    backgroundColor: '#f0f0f0',
                    textAlign: 'left',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      textAlign: 'left',
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading Excel preview...</p>
      )}
    </div>
  );
};

export default ExcelPreview;
