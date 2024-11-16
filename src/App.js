import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TemplateSelection from './components/TemplateSelection';
import SummaryForm from './components/SummaryForm';
import SkillsForm from './components/SkillsForm';
import ExperienceForm from './components/ExperienceForm';
import ResumePreview from './components/ResumePreview';
import FileUploadForm from './components/FileUploadForm';
import { Container, Box, Typography } from '@mui/material';

function App() {
  const [data, setData] = useState(null); // Initialize as null to check if data exists
  const [skills, setSkills] = useState({
    list1: [],
    list2: [],
  });
  const [selectedTemplate, setSelectedTemplate] = useState('Template3');

  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem("uploadResponse");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData); // Set the data if it exists
      setSkills({
        list1: parsedData.sections?.missing_skills?.items?.map((item) => item.name) || [],
        list2: parsedData.sections?.current_skills?.items?.map((item) => item.name) || []
      });
    }
  }, []);

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
