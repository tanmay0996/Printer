require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const convertapi = require('convertapi');
const path = require('path');
const fs = require('fs');

const app = express();

// Allow cross-origin requests from your React app
app.use(cors({
  origin: process.env.FPORT
}));

// Configure multer to save uploaded files to the "uploads" directory
const upload = multer({ dest: 'uploads/' });

// Initialize ConvertAPI with your API secret
const ConvertApi = convertapi(process.env.CONVERT_API);

app.post('/convert', upload.single('file'), async (req, res) => {
  try {
    // Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Rename the file to include its original extension (e.g. .pptx)
    const ext = path.extname(req.file.originalname); 
    const oldPath = req.file.path;
    const newFilePath = oldPath + ext;
    fs.renameSync(oldPath, newFilePath);
    console.log('Received file:', {
      ...req.file,
      path: newFilePath,
      originalname: req.file.originalname,
    });

    // Convert the file using ConvertAPI (specify 'ppt' as the source format)
    const result = await ConvertApi.convert('pdf', { File: newFilePath }, 'ppt');
    console.log('Conversion result:', result);

    // Clean up: remove the uploaded file after conversion
    fs.unlinkSync(newFilePath);

    // Return the URL of the converted PDF file
    res.json({ url: result.response.Files[0].Url });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
