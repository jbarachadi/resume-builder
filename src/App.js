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
  const [data, setData] = useState(initialData.resume);
  const [skills, setSkills] = useState(data.skills.list);

  const [selectedTemplate, setSelectedTemplate] = useState('Template2');

  const handleInputChange = (section, updatedData) => {
    setData({ ...data, [section]: updatedData });
  };

  const handleTemplateChange = (template) => setSelectedTemplate(template);

  return (
    <Router>
      <Container maxWidth="100%" sx={{ bgcolor: '#ffffff', py: 5, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="header" sx={{ fontWeight: 600, color: '#333' }}>
            Resume Builder
          </Typography>
          <TemplateSelection onSelectTemplate={handleTemplateChange} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {/* <SummaryForm
                    data={data.summary}
                    onChange={(updated) => handleInputChange('summary', updated)}
                  /> */}
                  <SkillsForm
                    data={data.skills}
                    onChange={(updated) => handleInputChange('skills', updated)}
                  />
                  {/* <ExperienceForm
                    data={data.experience}
                    onChange={(updated) => handleInputChange('experience', updated)}
                  /> */}
                  <ResumePreview template={selectedTemplate} data={{ ...data, skills: { ...data.skills, list: skills } }} setSkills={setSkills} />
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
