import React from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';

const SkillsForm = ({ data, onChange }) => {
  const handleSkillChange = (index, value) => {
    const updatedSkills = data.list.map((skill, i) => (i === index ? value : skill));
    onChange({ ...data, list: updatedSkills });
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = data.list.filter((_, i) => i !== index);
    onChange({ ...data, list: updatedSkills });
  };

  return (
    <Box sx={{ width: '100%', mx: 'auto', p: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, borderBottom: '2px solid #007bff', pb: 1 }}>
        {data.subheadline}
      </Typography>
      {data.list.map((skill, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#ffffff', boxShadow: 1 }}>
          <TextField
            fullWidth
            label="Skill"
            value={skill}
            onChange={(e) => handleSkillChange(index, e.target.value)}
            variant="outlined"
            sx={{ mb: 1 }}
          />
          {/* <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleSkillChange(index, skill)}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleRemoveSkill(index)}
            >
              Remove
            </Button>
          </Box> */}
        </Box>
      ))}
      {/* <Button
        variant="contained"
        color="success"
        onClick={() => onChange({ ...data, list: [...data.list, ''] })}
        sx={{ width: '100%' }}
      >
        Add Skill
      </Button> */}
    </Box>
  );
};

export default SkillsForm;
