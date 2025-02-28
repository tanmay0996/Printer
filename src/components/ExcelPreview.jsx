// ExcelPreview.jsx
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelPreview = ({ file }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const readExcelFile = () => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setData(jsonData);
      };
      reader.readAsBinaryString(file);
    };

    if (file) {
      readExcelFile();
    }
  }, [file]);

  return (
    <div>
      {data.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              {Object.keys(data[0]).map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
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
