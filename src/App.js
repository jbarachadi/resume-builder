import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TemplateSelection from './components/TemplateSelection';
import SummaryForm from './components/SummaryForm';
import SkillsForm from './components/SkillsForm';
import ExperienceForm from './components/ExperienceForm';
import ResumePreview from './components/ResumePreview';
import { initialData } from './data';
import { Container, Box, Typography } from '@mui/material';

function App() {
  const [data, setData] = useState(initialData);
  const [selectedTemplate, setSelectedTemplate] = useState('Template2');

  const handleInputChange = (section, updatedData) => {
    setData({ ...data, [section]: updatedData });
  };

  const handleTemplateChange = (template) => setSelectedTemplate(template);

  return (
    <Router>
      <Container maxWidth="lg" sx={{ bgcolor: '#ffffff', py: 5, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="header" sx={{ fontWeight: 600, color: '#333' }}>
            Resume Builder
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SummaryForm
                    data={data.resume.summary}
                    onChange={(updated) => handleInputChange('summary', updated)}
                  />
                  <SkillsForm
                    data={data.resume.skills}
                    onChange={(updated) => handleInputChange('skills', updated)}
                  />
                  <ExperienceForm
                    data={data.resume.experience}
                    onChange={(updated) => handleInputChange('experience', updated)}
                  />
                  <TemplateSelection onSelectTemplate={handleTemplateChange} />
                  <ResumePreview template={selectedTemplate} data={data.resume} />
                </>
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
