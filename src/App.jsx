import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrintDocument from './components/PrintDocument';
import PrintSettingsUI from './components/PrintSettingsUI';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Upload File page */}
        <Route path="/" element={<PrintDocument />} />

        {/* Route for Print Settings page */}
        <Route path="/settings" element={<PrintSettingsUI />} />
      </Routes>
    </Router>
  );
}

export default App;
