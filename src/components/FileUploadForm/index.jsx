import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Grid, Typography, Box, Paper } from "@mui/material";
import { useStore } from "../../store"

const FileUploadForm = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { setData, profilePicture, setProfilePicture } = useStore();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleProfilePictureChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("job_description", text);
    formData.append("file", file);

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("https://api.interviewaxis.com/modifier/resume_builder", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Save response to localStorage
      // localStorage.setItem("uploadResponse", JSON.stringify(response.data));
      setData(response.data)
      localStorage.setItem("resume_data", JSON.stringify(response.data));
      setMessage("File uploaded successfully!");
    } catch (error) {
      setMessage("Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: { xs: "none", md: 700 }, mx: "auto", textAlign: "center" }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Profile Picture Upload Field */}
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "48px 0 0 0"
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "2px dashed #ccc",
                borderRadius: "50%",
                width: "160px",
                mb: 2,
                aspectRatio: 1,
                backgroundColor: "#f9f9f9",
                position: "relative",
              }}
            >
              <img
                src={profilePicture ? profilePicture : "assets/placeholder_pp.jpg"}
                alt="Profile Preview"
                style={{
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  aspectRatio: 1,
                }}
              />
              <Button
                variant="contained"
                component="label"
                sx={{
                  position: "absolute",
                  bottom: "5px",
                  right: "5px",
                  backgroundColor: "#0D1E30",
                  color: "#fff",
                  textTransform: "none",
                  borderRadius: "50%",
                  padding: "8px",
                  minWidth: "35px",
                  height: "35px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#0A1723",
                  },
                }}
              >
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
                ✎
              </Button>
            </Box>
            {/* <Button
              variant="contained"
              component="label"
              sx={{
                backgroundColor: "#0D1E30",
                color: "#fff",
                textTransform: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#0A1723",
                },
              }}
              fullWidth
            >
              Upload Profile Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </Button> */}
          </Grid>

          {/* Text Input Field */}
          <Grid item xs={12} style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            padding: "48px 0 0 0",
            justifyContent: "center"
          }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 1,
                position: "absolute",
                transform: 'translate(-360px, 0)'
              }}
            >
              <Box
                sx={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: "2px solid #1976d2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  color: "#1976d2",
                  fontWeight: "bold",
                  fontSize: "16px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                01
              </Box>
              <Typography
                variant="body1"
                sx={{ fontWeight: "medium", color: "#555", textAlign: "center" }}
              >
                Step
              </Typography>
            </Box>

            <Paper
              elevation={3}
              sx={{
                padding: "24px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                textAlign: "center",
                width: { xs: "100%", md: "30vw" },
                margin: "0 auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: "16px", color: "#333" }}
              >
                Type or paste a job description
              </Typography>
              <TextField
                fullWidth
                label="Type job description"
                variant="outlined"
                value={text}
                onChange={(e) => setText(e.target.value)}
                multiline 
                rows={4}
              />
            </Paper>
          </Grid>

          {/* File Upload Field */}
          <Grid item xs={12} style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            padding: "48px 0 0 0",
            justifyContent: "center"
          }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 1,
                position: "absolute",
                transform: 'translate(-360px, 0)'
              }}
            >
              <Box
                sx={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: "2px solid #1976d2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  color: "#1976d2",
                  fontWeight: "bold",
                  fontSize: "16px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                02
              </Box>
              <Typography
                variant="body1"
                sx={{ fontWeight: "medium", color: "#555", textAlign: "center" }}
              >
                Step
              </Typography>
            </Box>

            <Paper
              elevation={3}
              sx={{
                padding: "24px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                textAlign: "center",
                width: { xs: "100%", md: "30vw" },
                margin: "0 auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: "16px", color: "#333" }}
              >
                Upload your Resume
              </Typography>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{
                  backgroundColor: "#002855",
                  color: "#fff",
                  textTransform: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#004080",
                  },
                }}
              >
                Upload File
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected File: {file.name}
                </Typography>
              )}

              <Typography
                variant="body2"
                sx={{
                  marginTop: "16px",
                  color: "#666",
                }}
              >
                DOC, DOCX, PDF (Max - 10MB)
              </Typography>
            </Paper>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} style={{
            padding: "48px 0 0 0"
          }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{
                width: { xs: "100%", md: "30vw" },
                backgroundColor: "red",
                color: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                padding: "10px 20px",
                "&:hover": {
                  backgroundColor: "darkred",
                },
                "&:disabled": {
                  backgroundColor: "lightgray",
                },
              }}
            >
              {loading ? "Uploading..." : "Upload File"}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Message */}
      {message && (
        <Typography variant="body2" color={message.includes("successfully") ? "green" : "error"} sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploadForm;
