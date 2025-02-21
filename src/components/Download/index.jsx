import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Template1 from '../../templates/Template1';
import Template2 from '../../templates/Template2';
import Template3 from '../../templates/Template3';
import { DragDropContext } from "react-beautiful-dnd";
import { Box } from '@mui/material';
import 'font-awesome/css/font-awesome.min.css';
import { useStore } from "../../store"

const Download = () => {
  const navigate = useNavigate();
  const { data, skills, selectedTemplate} = useStore();

  const template = selectedTemplate

  // const [isVisible, setIsVisible] = useState(true);

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  useEffect(() => {
    handlePrint();

    const handleAfterPrint = () => {
      // setIsVisible(true);
      // navigate("/")
    };

    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);
   
  return (
    <Box sx={{ display: 'flex', flexDirection: "row", gap: 3, bgcolor: 'white', justifyContent: "center" }}>
      <DragDropContext>
        {template === 'Template1' && <Template1 data={data} skills={skills} />}
        {template === 'Template2' && <Template2 data={data} skills={skills} />}
        {template === 'Template3' && <Template3 data={data} skills={skills} />}
      </DragDropContext>
    </Box>
  )
};

export default Download;