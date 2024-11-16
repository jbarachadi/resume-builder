import React from 'react';
import Template1 from '../../templates/Template1';
import Template2 from '../../templates/Template2';
import Template3 from '../../templates/Template3';
import { Box, Paper } from '@mui/material';

const ResumePreview = ({ template, data, setSkills }) => (
  <Paper elevation={3} sx={{ width: '800px', p: 3, borderRadius: 2, bgcolor: '#f9fafb' }}>
    <Box>
      {template === 'Template1' && <Template1 data={data} setSkills={setSkills} />}
      {template === 'Template2' && <Template2 data={data} setSkills={setSkills} />}
      {template === 'Template3' && <Template3 data={data} setSkills={setSkills} />}
    </Box>
  </Paper>
);

export default ResumePreview;
