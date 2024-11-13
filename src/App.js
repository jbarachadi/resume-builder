import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TemplateSelection from './components/TemplateSelection';
import SummaryForm from './components/SummaryForm';
import SkillsForm from './components/SkillsForm';
import ExperienceForm from './components/ExperienceForm';
import ResumePreview from './components/ResumePreview';
import { initialData } from './data';
import styles from './App.module.css';

function App() {
  const [data, setData] = useState(initialData);
  const [selectedTemplate, setSelectedTemplate] = useState('Template1');

  const handleInputChange = (section, updatedData) => {
    setData({ ...data, [section]: updatedData });
  };

  const handleTemplateChange = (template) => setSelectedTemplate(template);

  return (
    <Router>
      <div className={styles.appContainer}>
        <header className={styles.header}>
          Resume Builder
        </header>

        <main className={styles.mainContent}>
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
        </main>

        <footer className={styles.footer}>
          © 2024 Resume Builder. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
