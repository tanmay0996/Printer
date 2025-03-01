// src/components/BasicPPTPreview.jsx
import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { Box, Grid, Paper, Typography } from '@mui/material';

const BasicPPTPreview = ({ file, width = '900px', height = '600px' }) => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!file) return;
    console.log("PPT file received:", file);

    const loadSlides = async () => {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target.result;
            console.log("ArrayBuffer loaded");
            const zip = await JSZip.loadAsync(arrayBuffer);
            console.log("JSZip loaded. Available files:", Object.keys(zip.files));

            // Look for the slide folder "ppt/slides"
            const slideFolder = zip.folder("ppt/slides");
            if (!slideFolder) {
              throw new Error("Could not find ppt/slides folder in PPTX file");
            }

            // Gather all XML slide files (slide1.xml, slide2.xml, etc.)
            const slideFiles = [];
            slideFolder.forEach((relativePath, file) => {
              if (relativePath.endsWith(".xml")) {
                slideFiles.push(file);
              }
            });
            slideFiles.sort((a, b) =>
              a.name.localeCompare(b.name, undefined, { numeric: true })
            );

            const slideTexts = [];
            for (const slideFile of slideFiles) {
              const xmlText = await slideFile.async("text");
              console.log(`Slide file: ${slideFile.name} XML (first 200 chars):`, xmlText.substring(0, 200));
              
              // Parse the XML
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(xmlText, "text/xml");

              // Get all elements and filter those whose localName === 't'
              const allElements = xmlDoc.getElementsByTagName("*");
              const textNodes = [];
              for (let i = 0; i < allElements.length; i++) {
                const el = allElements[i];
                if (el.localName === "t") {
                  textNodes.push(el);
                }
              }

              let slideText = "";
              textNodes.forEach((node) => {
                slideText += node.textContent + " ";
              });
              slideTexts.push(slideText.trim());
            }
            console.log("Extracted slide texts:", slideTexts);
            setSlides(slideTexts);
            setLoading(false);
          } catch (error) {
            console.error("Error inside reader.onload:", error);
            setLoading(false);
          }
        };

        reader.onerror = (e) => {
          console.error("FileReader error:", e);
          setLoading(false);
        };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Error processing PPTX file:", error);
        setLoading(false);
      }
    };

    loadSlides();
  }, [file]);

  if (loading) {
    return <div>Loading PPTX preview...</div>;
  }

  if (slides.length === 0) {
    return <div>No slide text found.</div>;
  }

  return (
    <Box
      style={{
        width,
        height,
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Grid container spacing={2}>
        {slides.map((text, index) => (
          <Grid item xs={12} key={index}>
            <Paper elevation={3} style={{ padding: '16px' ,height:'300px'}}>
              <Typography variant="h6" gutterBottom>
                Slide {index + 1}
              </Typography>
              <Typography variant="body1">
                {text || "No text content"}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BasicPPTPreview;
