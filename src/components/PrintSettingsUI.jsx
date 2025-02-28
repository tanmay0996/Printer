import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
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

import PDFThumbnail from './PDFThumbnail';
// Import your preview components
import PDFViewer from '../components/PDFViewer';
import DocxPreview from '../components/DocxPreview';
import ExcelPreview from '../components/ExcelPreview';
import DocxThumbnail from './DocxThumbnail';
import ExcelThumbnail from './ExcelThumbnail';

// Import the custom TiltCard component
import TiltCard from '../Animation/TiltCard';

// Helper function to get file extension
const getFileType = (fileName) => fileName.split('.').pop().toLowerCase();

const steps = ['Upload File', 'Print Settings', 'Select Location', 'Order Summary'];

const PrintSettingsUI = () => {
  const location = useLocation();
  const [files, setFiles] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [pages, setPages] = useState('');
  const [color, setColor] = useState('Color');
  const [copies, setCopies] = useState(1);
  const [showMoreSettings, setShowMoreSettings] = useState(false);
  const [orientation, setOrientation] = useState('Portrait');

  useEffect(() => {
    if (location.state && location.state.selectedFile) {
      const passedFile = location.state.selectedFile;
      const previewURL = URL.createObjectURL(passedFile);
      setFiles([{
        id: 1,
        name: passedFile.name,
        imageUrl: previewURL,
        file: passedFile
      }]);
      setSelectedFileIndex(0);
      return () => URL.revokeObjectURL(previewURL);
    }
  }, [location.state]);

  const handleRemoveFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    if (files.length > 1) setSelectedFileIndex(0);
  };

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
        file: newFile
      },
    ];
    setFiles(updatedFiles);
    setSelectedFileIndex(updatedFiles.length - 1);
    event.target.value = null;
  };

  const incrementCopies = () => setCopies(prev => prev + 1);
  const decrementCopies = () => setCopies(prev => (prev > 1 ? prev - 1 : 1));

  const handleSaveChanges = () => {
    alert('Settings saved!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
            <TiltCard sx={{ p: 2 }}>
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
                      {(() => {
                        const ext = getFileType(file.name);
                        if (ext === 'pdf') {
                          return <PDFThumbnail fileUrl={file.imageUrl} width={120} height={160} />;
                        } else if (ext === 'docx' || ext === 'doc') {
                          return <DocxThumbnail file={file.file} width={120} height={160} />;
                        } else if (ext === 'xls' || ext === 'xlsx') {
                          return <ExcelThumbnail file={file.file} width={120} height={160} />;
                        } else {
                          return (
                            <CardMedia
                              component="img"
                              image={file.imageUrl}
                              alt={file.name}
                              sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          );
                        }
                      })()}
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
                  <Button variant="outlined" component="label">
                    <AddIcon sx={{ mr: 1 }} />
                    Add More Files
                    <input type="file" hidden onChange={handleFileUpload} />
                  </Button>
                </Box>
                {files[selectedFileIndex] && (
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    File Name: {files[selectedFileIndex].name}
                  </Typography>
                )}
              </CardContent>
            </TiltCard>

            {files[selectedFileIndex] && (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Preview
                </Typography>
                {(() => {
                  const fileType = getFileType(files[selectedFileIndex].name);
                  const baseStyle = { filter: color === 'B/W' ? 'grayscale(100%)' : 'none' };
                  const containerStyle =
                    orientation === 'Landscape'
                      ? { ...baseStyle, width: '900px', height: '600px' }
                      : { ...baseStyle, width: 'auto', height: '750px' };

                  if (fileType === 'pdf') {
                    return (
                      <Box sx={containerStyle}>
                        <PDFViewer fileUrl={files[selectedFileIndex].imageUrl} previewStyle={containerStyle} />
                      </Box>
                    );
                  } else {
                    return (
                      <Box
                        sx={{
                          display: 'inline-block',
                          border: '1px solid #ccc',
                          borderRadius: 4,
                          overflow: 'hidden',
                          ...containerStyle,
                        }}
                      >
                        {fileType === 'docx' || fileType === 'doc' ? (
                          <DocxPreview file={files[selectedFileIndex].file} />
                        ) : fileType === 'xls' || fileType === 'xlsx' ? (
                          <ExcelPreview file={files[selectedFileIndex].file} />
                        ) : (
                          <img
                            src={files[selectedFileIndex].imageUrl}
                            alt={files[selectedFileIndex].name}
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        )}
                      </Box>
                    );
                  }
                })()}
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
            <TiltCard sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Print Options for Selected File
                </Typography>
                <TextField
                  label="Pages"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2 }}
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                />
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
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => setShowMoreSettings((prev) => !prev)}
                  >
                    {showMoreSettings ? 'Hide More Settings' : 'Show More Settings'}
                  </Button>
                  {showMoreSettings && (
                    <FormControl fullWidth sx={{ mt: 2 }} size="small">
                      <InputLabel>Layout</InputLabel>
                      <Select
                        label="Layout"
                        value={orientation}
                        onChange={(e) => setOrientation(e.target.value)}
                      >
                        <MenuItem value="Portrait">Portrait</MenuItem>
                        <MenuItem value="Landscape">Landscape</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Box>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="outlined">Apply to All</Button>
                  <Button variant="contained" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </Box>
              </CardContent>
            </TiltCard>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default PrintSettingsUI;
