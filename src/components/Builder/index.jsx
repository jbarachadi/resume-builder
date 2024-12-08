import React, { useRef } from 'react';
import TemplateSelection from '../TemplateSelection';
import ResumePreview from '../ResumePreview';
import FileUploadForm from '../FileUploadForm';
import { Container, Box, Typography, Button } from '@mui/material';
import { useStore } from "../../store"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Builder = () => {
  const navigate = useNavigate();
  const { data, skills, selectedTemplate, setSelectedTemplate, profilePicture } = useStore();
  const resumeRef = useRef();

  const handleTemplateChange = (template) => setSelectedTemplate(template);

  const downloadPDF = async () => {
    data["template"] = selectedTemplate
    data["skills"] = skills
    data["photo"] = profilePicture

    try {
      const response = await axios.post('http://localhost:5050/generate_pdf', data, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
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
        {data && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TemplateSelection onSelectTemplate={handleTemplateChange} />
            <div ref={resumeRef} style={{ display: 'none' }}>
              <ResumePreview
                template={selectedTemplate}
                downloadable={true}
              />
            </div>
            <ResumePreview
              template={selectedTemplate}
            />
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={
                  () => navigate("/download")
                }
              >
                Download as PDF
              </Button>
            </Box>
          </div>
        )}
        <Box sx={{ textAlign: 'center', mt: 5, color: '#777' }}>
          <Typography variant="body2">© 2024 Resume Builder. All rights reserved.</Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Builder