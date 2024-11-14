import React from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
} from '@mui/material';

const ExperienceForm = ({ data, onChange }) => {
  const handleInputChange = (index, field, value) => {
    const updatedPositions = [...data.positions];
    updatedPositions[index][field] = value;
    onChange({ ...data, positions: updatedPositions });
  };

  const handleResponsibilityChange = (index, respIndex, value) => {
    const updatedPositions = [...data.positions];
    updatedPositions[index].responsibilities[respIndex] = value;
    onChange({ ...data, positions: updatedPositions });
  };

  const addResponsibility = (index) => {
    const updatedPositions = [...data.positions];
    updatedPositions[index].responsibilities.push('');
    onChange({ ...data, positions: updatedPositions });
  };

  const removePosition = (index) => {
    const updatedPositions = data.positions.filter((_, i) => i !== index);
    onChange({ ...data, positions: updatedPositions });
  };

  return (
    <Box sx={{ mx: 'auto', p: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
        {data.subheadline}
      </Typography>
      {data.positions.map((position, index) => (
        <Box key={index} sx={{ mb: 4, p: 2, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#ffffff' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                value={position.job_title}
                onChange={(e) => handleInputChange(index, 'job_title', e.target.value)}
                variant="outlined"
                sx={{ mb: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => handleInputChange(index, 'job_title', position.job_title)}
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company"
                value={position.company}
                onChange={(e) => handleInputChange(index, 'company', e.target.value)}
                variant="outlined"
                sx={{ mb: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => handleInputChange(index, 'company', position.company)}
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={position.location}
                onChange={(e) => handleInputChange(index, 'location', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Duration"
                value={position.duration}
                onChange={(e) => handleInputChange(index, 'duration', e.target.value)}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Responsibilities</Typography>
            {position.responsibilities.map((resp, respIndex) => (
              <Box key={respIndex} sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label={`Responsibility ${respIndex + 1}`}
                  multiline
                  value={resp}
                  onChange={(e) => handleResponsibilityChange(index, respIndex, e.target.value)}
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => handleResponsibilityChange(index, respIndex, resp)}
                >
                  Save
                </Button>
              </Box>
            ))}
            <Button
              variant="contained"
              color="success"
              sx={{ mt: 2 }}
              onClick={() => addResponsibility(index)}
            >
              Add Responsibility
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Button
            variant="contained"
            color="error"
            onClick={() => removePosition(index)}
          >
            Remove Position
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default ExperienceForm;
