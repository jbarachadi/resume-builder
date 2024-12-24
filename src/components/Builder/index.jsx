import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';

import TemplateSelection from '../TemplateSelection';
import ResumePreview from '../ResumePreview';
import FileUploadForm from '../FileUploadForm';
import NavBar from '../NavBar';

import { useStore } from "../../store"
import axios from 'axios';

const Builder = () => {
  const navigate = useNavigate();
  const { data, skills, selectedTemplate, setSelectedTemplate, profilePicture, userData, setUserData } = useStore();
  const resumeRef = useRef();

  const fetchAllUsersData = async () => {
    try {
      const response = await axios.get(
        "https://www.interviewaxis.com/api/v1/user-data",
        { withCredentials: true }
      );

      console.log("fetchAllUsersData : ", response.data.data)

      if (response.status >= 200 && response.status < 300) {
        return Array.isArray(response.data.data) ? response.data.data : [];
      } else {
        throw new Error("Failed to fetch users data");
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
      return [];
    }
  };

  const checkSessionStatus = async () => {
    try {
      const response = await fetch('https://www.interviewaxis.com/api/v1/check-session', {
        method: 'GET', 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();

      console.log("checkSessionStatus : ", data)
  
      return data; 
    } catch (error) {
      console.error("Error checking session status:", error);
      return null;
    }
  };

  const processSessionData = async () => {
    const usersData = await fetchAllUsersData();
    const sessionData = await checkSessionStatus();

    if (sessionData && sessionData.logged_in===true) {
      const loggedInUser = sessionData.user;
      const matchedUser = usersData.find((user) => user.id === loggedInUser.id);     

      if (matchedUser) {
        setUserData({
          user_id: matchedUser.id,
          user_name: matchedUser.name,
          user_role: loggedInUser.role,
        });
        
      } else {
        console.error("User data not found in users data");
      }
    } else {
      //  window.location.href = "https://www.interviewaxis.com/login";
    }
  };

  useEffect(() => {
    processSessionData();
  }, []);

  const handleTemplateChange = (template) => setSelectedTemplate(template);

  // const downloadPDF = async () => {
  //   data["template"] = selectedTemplate
  //   data["skills"] = skills
  //   data["photo"] = profilePicture

  //   try {
  //     const response = await axios.post('http://194.146.13.24:5050/generate_pdf', data, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       responseType: 'blob',
  //     });

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', 'resume.pdf');
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   }
  // };

  return (
    <Box>
      <NavBar />
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, height: "100%" }}>
        <Container
          maxWidth="100%"
          sx={{ bgcolor: '#ffffff', py: 5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" component="header" sx={{ fontWeight: 600, color: '#333' }}>
              Modify your resume
            </Typography>
            <Typography variant="p" component="header" sx={{ pt: 2, fontWeight: 200, color: '#333' }}>
              Add missing skills to your CV in one click !
            </Typography>
            <FileUploadForm />
          </Box>
          {data && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TemplateSelection onSelectTemplate={handleTemplateChange} />
              <div ref={resumeRef} style={{ display: 'none' }}>
                <ResumePreview
                  template={selectedTemplate}
                  downloadable={true}
                />
              </div>
              <ResumePreview
                template={selectedTemplate}
              />
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={
                    () => navigate("/download")
                  }
                >
                  Download as PDF
                </Button>
              </Box>
            </div>
          )}
          <Box sx={{ textAlign: 'center', mt: 5, color: '#777' }}>
            <Typography variant="body2">© 2024 Resume Builder. All rights reserved.</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Builder