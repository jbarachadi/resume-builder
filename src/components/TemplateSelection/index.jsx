import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CircularProgress } from '@mui/material';

import { useStore } from "../../store";

const TemplateSelection = ({ onSelectTemplate }) => {
  const { selectedTemplate, loading } = useStore();

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 500, color: '#444', mb: 3 }}>
        Select a Template
      </Typography>

      {/* Grid Container with Overlay */}
      <Box sx={{ position: 'relative', my: 12 }}>
        {/* Overlay and loader */}
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: "-10%",
              left: 0,
              width: '100%',
              height: '120%',
              backdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(128, 128, 128, 0.3)',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2
            }}
          >
            <CircularProgress sx={{ color: '#fff' }} />
          </Box>
        )}

        {/* Templates Grid */}
        <Grid container spacing={3} justifyContent="center">
          {['Template1', 'Template2', 'Template3'].map((template, index) => (
            <Card
              key={template}
              sx={{
                aspectRatio: '1 / 1.414',
                width: "20vw",
                borderRadius: 2,
                mx: 6,
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: selectedTemplate === template ? "0 0 12px rgba(255, 0, 0, 0.6)" : '0 4px 12px rgba(0, 0, 0, 0.2)',
                },
                transform: selectedTemplate === template && 'scale(1.02)',
                boxShadow: selectedTemplate === template && "0 0 12px rgba(255, 0, 0, 0.6)",
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
    </Box>
  );
};

export default TemplateSelection;