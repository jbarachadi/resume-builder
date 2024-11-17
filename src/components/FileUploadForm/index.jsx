import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Grid, Typography, Box } from "@mui/material";
import { useStore } from "../../store"

const FileUploadForm = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { data, setData, skills, setSkills } = useStore();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
      const response = await axios.post("http://194.146.13.24:5050/upload_file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Save response to localStorage
      // localStorage.setItem("uploadResponse", JSON.stringify(response.data));
      setData(response.data)
      console.log(response.data)
      setMessage("File uploaded successfully!");
    } catch (error) {
      setMessage("Failed to upload file. Please try again.");
    } finally {
      console.log("Store set successfully")
      console.log(data)
      console.log(skills)
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 400, mx: "auto", textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Upload File
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Text Input Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Type job description"
              variant="outlined"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Grid>

          {/* File Upload Field */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              fullWidth
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
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? "Uploading..." : "Submit"}
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
