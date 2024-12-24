import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box } from "@mui/material";

import Download from './components/Download';
import Builder from './components/Builder';

function App() {
  return (
    <Box>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Builder />
            }
          />
          <Route
            path="/download"
            element={
              <Download />
            }
          />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
