import React from 'react';
import { Box, Typography, Grid, Card, CardMedia } from '@mui/material';

const TemplateSelection = ({ onSelectTemplate }) => (
  <Box sx={{ textAlign: 'center', py: 4 }}>
    <Typography variant="h4" sx={{ fontWeight: 500, color: '#444', mb: 3 }}>
      Select a Template
    </Typography>
    <Grid container spacing={3} justifyContent="center">
      {['Template1', 'Template2', 'Template3'].map((template, index) => (
        <Grid item key={index}>
          <Card
            sx={{
              width: 180,
              borderRadius: 2,
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
              image={'../assets/logo512.png'}
              alt={`Template ${index + 1}`}
              sx={{ borderRadius: 2 }}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default TemplateSelection;
