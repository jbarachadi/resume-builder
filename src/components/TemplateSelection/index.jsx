import React from 'react';
import { Box, Typography, Grid, Card, CardMedia } from '@mui/material';

const TemplateSelection = ({ onSelectTemplate }) => (
  <Box sx={{ textAlign: 'center', py: 4 }}>
    <Typography variant="h4" sx={{ fontWeight: 500, color: '#444', mb: 3 }}>
      Select a Template
    </Typography>
    <Grid container spacing={3} justifyContent="center" sx={{ my: 2 }}>
      {['Template1', 'Template2', 'Template3'].map((template, index) => (
        <Card
        sx={{
          aspectRatio: '1 / 1', // Ensures a 1:1 aspect ratio (square)
          width: 180,
          borderRadius: 2,
          mx: 2,
          overflow: 'hidden',
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          },
        }}
        onClick={() => onSelectTemplate(template)}
      >
        <CardMedia
          component="img"
          image={`../assets/temp${index + 1}.png`}
          alt={`Template ${index + 1}`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Card>
      
      ))}
    </Grid>
  </Box>
);

export default TemplateSelection;
