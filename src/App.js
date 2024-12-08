import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Download from './components/Download';
import Builder from './components/Builder';

function App() {
  return (
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
  );
}

export default App;
