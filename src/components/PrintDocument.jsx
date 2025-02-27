import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PrintDocument = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleProceed = () => {
    if (selectedFile) {
      // Navigate to PrintSettingsUI and pass the file via state
      navigate('/settings', { state: { selectedFile } });
    } else {
      alert('Please select a file to proceed.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 4 }}>
      {/* Heading */}
      <Typography variant="h4" component="h1" gutterBottom>
        Print Document, <span style={{ color: '#1976d2' }}>Smartly and Securely.</span>
      </Typography>

      {/* Drag & Drop / Choose Files Box */}
      <Box
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 4,
          my: 4,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#f9f9f9',
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Drag & Drop or Choose Files
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Max file size: 10 MB
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" component="label">
            Choose File
            <input 
              type="file" 
              hidden 
              onChange={handleFileChange} 
            />
          </Button>
        </Box>

        {selectedFile && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Selected File: {selectedFile.name}
          </Typography>
        )}
      </Box>

      {/* How it Works */}
      <Typography variant="h5" gutterBottom>
        How it works?
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              1. Upload &amp; Customize
            </Typography>
            <Typography variant="body2">
              Upload your files &amp; set preferences like color, size &amp; page count.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              2. Pick a Shop
            </Typography>
            <Typography variant="body2">
              Select a nearby print shop and receive a unique code.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              3. Print Instantly
            </Typography>
            <Typography variant="body2">
              Share the code at the shop to get your documents printed.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Proceed Button */}
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" onClick={handleProceed}>
          Proceed to Print Settings
        </Button>
      </Box>
    </Container>
  );
};

export default PrintDocument;
