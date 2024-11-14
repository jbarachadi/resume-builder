import React from 'react';
import Template1 from '../../templates/Template1';
import Template2 from '../../templates/Template2';
import Template3 from '../../templates/Template3';
import { Box, Paper } from '@mui/material';

const ResumePreview = ({ template, data }) => (
  <Paper elevation={3} sx={{ width: '100%', p: 3, borderRadius: 2, bgcolor: '#f9fafb' }}>
    <Box>
      {template === 'Template1' && <Template1 data={data} />}
      {template === 'Template2' && <Template2 data={data} />}
      {template === 'Template3' && <Template3 data={data} />}
    </Box>
  </Paper>
);

export default ResumePreview;
