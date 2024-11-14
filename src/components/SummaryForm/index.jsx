import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';

const SummaryForm = ({ data, onChange }) => {
  const [summaryText, setSummaryText] = useState(data.text);

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setSummaryText(newText);
    onChange({ ...data, text: newText });
  };

  const handleSave = () => {
    const newData = { ...data, text: summaryText };
    localStorage.setItem('resumeSummary', JSON.stringify(newData));
    console.log("Changes saved:", newData);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        p: 3,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        boxShadow: 3,
        mx: 'auto',
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
        {data.subheadline}
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={6}
        value={summaryText}
        onChange={handleInputChange}
        variant="outlined"
        placeholder="Enter summary here..."
        sx={{ mb: 3 }}
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ py: 1 }}
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default SummaryForm;
