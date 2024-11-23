import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TemplateSelection from './components/TemplateSelection';
import SummaryForm from './components/SummaryForm';
import SkillsForm from './components/SkillsForm';
import ExperienceForm from './components/ExperienceForm';
import ResumePreview from './components/ResumePreview';
import FileUploadForm from './components/FileUploadForm';
import { Container, Box, Typography, Button } from '@mui/material';
import { useStore } from "./store"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function App() {
  const { data, setData, skills, setSkills, selectedTemplate, setSelectedTemplate } = useStore();
  const resumeRef = useRef();

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) {
      console.error('Resume reference is not set.');
      return;
    }
  
    const originalDiv = resumeRef.current;
    const clone = originalDiv.cloneNode(true);
    clone.style.display = 'block';
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.margin = '12px';
    document.body.appendChild(clone);
  
    try {
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        windowWidth: clone.scrollWidth,
      });
  
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
  
      let y = 0;
  
      while (y < canvas.height) {
        // Create a canvas for the current page slice
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(pageHeight * (canvas.width / pageWidth), canvas.height - y);
  
        const pageCtx = pageCanvas.getContext('2d');
        pageCtx.drawImage(
          canvas,
          0,
          y,
          canvas.width,
          pageCanvas.height,
          0,
          0,
          canvas.width,
          pageCanvas.height
        );
  
        const pageData = pageCanvas.toDataURL('image/png');
        if (y > 0) pdf.addPage();
        pdf.addImage(pageData, 'PNG', 0, 0, imgWidth, pageCanvas.height * (pageWidth / canvas.width));
  
        y += pageCanvas.height;
      }
  
      // Save the generated PDF
      pdf.save('resume.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      // Clean up by removing the cloned element
      document.body.removeChild(clone);
    }
  };
  

  const handleInputChange = (section, updatedData) => {
    if (data) {
      setData({ ...data, [section]: updatedData });
    }
  };

  const handleTemplateChange = (template) => setSelectedTemplate(template);

  return (
    <Router>
      <Container
        maxWidth="100%"
        sx={{ bgcolor: '#ffffff', py: 5, borderRadius: 2, boxShadow: 3 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="header" sx={{ fontWeight: 600, color: '#333' }}>
            Resume Builder
          </Typography>
          <FileUploadForm />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
          <Routes>
            <Route
              path="/"
              element={
                data && ( // Conditionally render ResumePreview only if data exists
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <TemplateSelection onSelectTemplate={handleTemplateChange} />
                    <div ref={resumeRef} style={{ display: 'none' }}>
                      <ResumePreview
                        template={selectedTemplate}
                        data={{
                          ...data,
                          skills: {
                            ...data.skills,
                            list1: skills.list1,
                            list2: skills.list2,
                          },
                        }}
                        setSkills={setSkills}
                        downloadable={true}
                      />
                    </div>
                    <ResumePreview
                      template={selectedTemplate}
                      data={{
                        ...data,
                        skills: {
                          ...data.skills,
                          list1: skills.list1,
                          list2: skills.list2,
                        },
                      }}
                      setSkills={setSkills}
                    />
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDownloadPDF}
                      >
                        Download as PDF
                      </Button>
                    </Box>
                  </div>
                )
              }
            />
          </Routes>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 5, color: '#777' }}>
          <Typography variant="body2">© 2024 Resume Builder. All rights reserved.</Typography>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
