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
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Select
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useLocation } from 'react-router-dom';

// Preview components for various file types
import PDFThumbnail from './PDFThumbnail';
import PDFViewer from '../components/PDFViewer';
import DocxPreview from './DocxPreview';
import ExcelPreview from './ExcelPreview';
import DocxThumbnail from './DocxThumbnail';
import ExcelThumbnail from './ExcelThumbnail';
// BasicPPTPreview is used to render a thumbnail in the Uploaded Files list if needed.
import BasicPPTPreview from './BasicPPTPreview';

// Custom animated card component
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
  // New state for the converted PDF URL and loading status
  const [convertedPdfUrl, setConvertedPdfUrl] = useState(null);
  const [conversionLoading, setConversionLoading] = useState(false);
  // New state for slides per page selection
  const [slidesPerPage, setSlidesPerPage] = useState(1);

  // Get the file passed from PrintDocument.jsx via location.state
  useEffect(() => {
    if (location.state && location.state.selectedFile) {
      const passedFile = location.state.selectedFile;
      console.log('File received in PrintSettingsUI:', passedFile);
      const previewURL = URL.createObjectURL(passedFile);
      setFiles([
        {
          id: 1,
          name: passedFile.name,
          imageUrl: previewURL,
          file: passedFile
        }
      ]);
      setSelectedFileIndex(0);
      // Clean up the object URL on unmount
      return () => URL.revokeObjectURL(previewURL);
    }
  }, [location.state]);

  // Function to convert a PPT/PPTX file to PDF via the backend
  const convertPptToPdf = async (file) => {
    setConversionLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost:5000/convert', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.url) {
        setConvertedPdfUrl(data.url);
      } else {
        console.error('Conversion failed: No URL returned');
      }
    } catch (error) {
      console.error('Error during conversion:', error);
    } finally {
      setConversionLoading(false);
    }
  };

  // Trigger conversion if the uploaded file is a PPT/PPTX and no PDF URL exists yet
  useEffect(() => {
    if (files.length > 0 && files[selectedFileIndex]) {
      const fileObj = files[selectedFileIndex];
      const fileType = getFileType(fileObj.name);
      if ((fileType === 'ppt' || fileType === 'pptx') && !convertedPdfUrl) {
        convertPptToPdf(fileObj.file);
      }
    }
  }, [files, selectedFileIndex, convertedPdfUrl]);

  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
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
      }
    ];
    setFiles(updatedFiles);
    setSelectedFileIndex(updatedFiles.length - 1);
    event.target.value = null;
  };

  const incrementCopies = () => setCopies((prev) => prev + 1);
  const decrementCopies = () => setCopies((prev) => (prev > 1 ? prev - 1 : 1));

  const handleSaveChanges = () => {
    alert('Settings saved!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, scrollBehavior: 'smooth' }}>
      <Stepper activeStep={1} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} completed={index < 1}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Left Panel: Uploaded Files & Preview */}
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
                          return (
                            <PDFThumbnail
                              fileUrl={file.imageUrl}
                              width={120}
                              height={160}
                            />
                          );
                        } else if (ext === 'docx' || ext === 'doc') {
                          return (
                            <DocxThumbnail
                              file={file.file}
                              width={120}
                              height={160}
                            />
                          );
                        } else if (ext === 'ppt' || ext === 'pptx') {
                          // Render the first page of the PPT/PPTX as a thumbnail
                          return (
                            <BasicPPTPreview
                              file={file.file}
                              width={200} // Wider thumbnail for PPT
                              height={160}
                              previewMode="thumbnail" // Ensure your component supports this prop
                            />
                          );
                        } else if (ext === 'xls' || ext === 'xlsx') {
                          return (
                            <ExcelThumbnail
                              file={file.file}
                              width={120}
                              height={160}
                            />
                          );
                        } else {
                          return (
                            <CardMedia
                              component="img"
                              image={file.imageUrl}
                              alt={file.name}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                              }}
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

            {/* Preview Section */}
            {files[selectedFileIndex] ? (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Preview
                </Typography>
                {(() => {
                  const selectedFile = files[selectedFileIndex];
                  const fileType = getFileType(selectedFile.name);
                  // Base style: apply grayscale filter if B/W is selected.
                  const baseStyle = { filter: color === 'B/W' ? 'grayscale(100%)' : 'none' };
                  // Adjust container style based on orientation:
                  const containerStyle =
                    orientation === 'Landscape'
                      ? { ...baseStyle, width: '900px', height: '600px' }
                      : { ...baseStyle, width: 'auto', height: '750px' };

                  // If the file is a PPT/PPTX, show the converted PDF preview once available.
                  if (fileType === 'ppt' || fileType === 'pptx') {
                    if (conversionLoading) {
                      return <Typography>Converting PPT to PDF...</Typography>;
                    }
                    if (convertedPdfUrl) {
                      return (
                        <Box sx={containerStyle}>
                          <PDFViewer
                            fileUrl={convertedPdfUrl}
                            previewStyle={containerStyle}
                            slidesPerPage={slidesPerPage} // Pass slides per page option to PDFViewer
                          />
                        </Box>
                      );
                    }
                    // Optionally, show a fallback if conversion failed
                    return <Typography>Conversion failed or not available.</Typography>;
                  }

                  // Other file types:
                  if (fileType === 'pdf') {
                    return (
                      <Box sx={containerStyle}>
                        <PDFViewer
                          fileUrl={selectedFile.imageUrl}
                          previewStyle={containerStyle}
                        />
                      </Box>
                    );
                  } else if (fileType === 'docx' || fileType === 'doc') {
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
                        <DocxPreview file={selectedFile.file} />
                      </Box>
                    );
                  } else if (fileType === 'xls' || fileType === 'xlsx') {
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
                        <ExcelPreview file={selectedFile.file} />
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
                        <img
                          src={selectedFile.imageUrl}
                          alt={selectedFile.name}
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      </Box>
                    );
                  }
                })()}
              </Box>
            ) : (
              <Typography variant="body1" sx={{ mt: 4 }}>
                No file selected for preview.
              </Typography>
            )}

            {/* (Optional) You can uncomment the Proceed button if needed */}
            {/* <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button variant="contained" color="primary">
                Proceed to Select Shop
              </Button>
            </Box> */}
          </Grid>

          {/* Right Panel: Print Options */}
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
                {/* Show More Settings section */}
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => setShowMoreSettings((prev) => !prev)}
                  >
                    {showMoreSettings ? 'Hide More Settings' : 'Show More Settings'}
                  </Button>
                  {showMoreSettings && (
                    <>
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
                      <FormControl fullWidth sx={{ mt: 2 }} size="small">
                        <InputLabel>Slides per Page</InputLabel>
                        <Select
                          label="Slides per Page"
                          value={slidesPerPage}
                          onChange={(e) => setSlidesPerPage(e.target.value)}
                        >
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                          <MenuItem value={4}>4</MenuItem>
                          <MenuItem value={6}>6</MenuItem>
                        </Select>
                      </FormControl>
                    </>
                  )}
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
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
