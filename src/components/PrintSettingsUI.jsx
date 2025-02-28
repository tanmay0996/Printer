import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from '@mui/material';

// MUI Icons
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useLocation } from 'react-router-dom';

// Import your PDFViewer component
import PDFViewer from '../components/PDFViewer';

// Helper function to get file extension
const getFileType = (fileName) => {
  return fileName.split('.').pop().toLowerCase();
};

const steps = ['Upload File', 'Print Settings', 'Select Location', 'Order Summary'];

const PrintSettingsUI = () => {
  const location = useLocation();

  // Files state starts empty but we'll populate it if a file is passed from PrintDocument.jsx
  const [files, setFiles] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  // Example settings
  const [pages, setPages] = useState('');
  const [color, setColor] = useState('Color');
  const [copies, setCopies] = useState(1);

  // On mount, check if a file was passed via state and add it to files
  useEffect(() => {
    if (location.state && location.state.selectedFile) {
      const passedFile = location.state.selectedFile;
      const previewURL = URL.createObjectURL(passedFile);
      setFiles([{
        id: 1,
        name: passedFile.name,
        imageUrl: previewURL
      }]);
      setSelectedFileIndex(0);

      // Cleanup the preview URL when unmounting
      return () => URL.revokeObjectURL(previewURL);
    }
  }, [location.state]);

  // Handle removing a file
  const handleRemoveFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    if (files.length > 1) {
      setSelectedFileIndex(0);
    }
  };

  // Handle adding a new file via file input (for adding more files)
  const handleFileUpload = (event) => {
    const newFile = event.target.files[0];
    if (!newFile) return;
    const previewURL = URL.createObjectURL(newFile);
    const newId = files.length + 1;
    const updatedFiles = [
      ...files,
      {
        id: newId,
        name: newFile.name,
        imageUrl: previewURL,
      },
    ];
    setFiles(updatedFiles);
    setSelectedFileIndex(updatedFiles.length - 1);
    event.target.value = null;
  };

  // Increase / Decrease copies
  const incrementCopies = () => setCopies(prev => prev + 1);
  const decrementCopies = () => setCopies(prev => (prev > 1 ? prev - 1 : 1));

  const handleSaveChanges = () => {
    alert('Settings saved!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Top Stepper */}
      <Stepper activeStep={1} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} completed={index < 1}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Left Panel */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Uploaded Files
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    mt: 2,
                    alignItems: 'center',
                  }}
                >
                  {files.map((file, index) => (
                    <Box
                      key={file.id}
                      sx={{
                        position: 'relative',
                        width: 120,
                        height: 160,
                        border: '1px solid #ccc',
                        borderRadius: 1,
                        overflow: 'hidden',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedFileIndex(index)}
                    >
                      <CardMedia
                        component="img"
                        image={file.imageUrl}
                        alt={file.name}
                        sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(file.id);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          backgroundColor: 'rgba(255,255,255,0.8)',
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  {/* "Add More Files" button */}
                  <Button variant="outlined" component="label">
                    <AddIcon sx={{ mr: 1 }} />
                    Add More Files
                    <input type="file" hidden onChange={handleFileUpload} />
                  </Button>
                </Box>
                {/* Display the selected file name */}
                {files[selectedFileIndex] && (
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    File Name: {files[selectedFileIndex].name}
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Preview Section */}
            {files[selectedFileIndex] && (
  <Box sx={{ mt: 4, textAlign: 'center' }}>
    <Typography variant="h6" gutterBottom>
      Preview
    </Typography>
    {getFileType(files[selectedFileIndex].name) === 'pdf' ? (
      // Render PDFViewer if the file is a PDF
      <PDFViewer fileUrl={files[selectedFileIndex].imageUrl} />
    ) : (
      // Otherwise, render the image preview
      <img
        src={files[selectedFileIndex].imageUrl}
        alt={files[selectedFileIndex].name}
        style={{
          maxWidth: '100%',
          height: 'auto',
          border: '1px solid #ccc',
          borderRadius: 4,
        }}
      />
    )}
  </Box>
)}


            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button variant="contained" color="primary">
                Proceed to Select Shop
              </Button>
            </Box>
          </Grid>

          {/* Right Panel */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Print Options for Selected File
                </Typography>
                {/* Pages */}
                <TextField
                  label="Pages"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2 }}
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                />
                {/* Color Selection */}
                <FormControl fullWidth sx={{ mt: 2 }} size="small">
                  <InputLabel>Colour</InputLabel>
                  <Select
                    label="Colour"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  >
                    <MenuItem value="Color">Color</MenuItem>
                    <MenuItem value="B/W">Black &amp; White</MenuItem>
                  </Select>
                </FormControl>
                {/* Number of Copies */}
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="body1">Number of Copies</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={decrementCopies}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="body1" sx={{ mx: 1 }}>
                      {copies}
                    </Typography>
                    <IconButton onClick={incrementCopies}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>
                {/* Show More Settings (placeholder) */}
                <Box sx={{ mt: 2 }}>
                  <Button variant="text" color="primary">
                    Show More Settings
                  </Button>
                </Box>
                {/* Actions */}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="outlined">Apply to All</Button>
                  <Button variant="contained" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default PrintSettingsUI;
