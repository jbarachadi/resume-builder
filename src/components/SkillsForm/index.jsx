import React from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const SkillsForm = ({ data, setSkills, onChange }) => {
  const handleSkillChange = (index, value) => {
    const updatedSkills = data.list.map((skill, i) => (i === index ? value : skill));
    onChange({ ...data, list: updatedSkills });
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = data.list.filter((_, i) => i !== index);
    onChange({ ...data, list: updatedSkills });
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) return;

    const updatedSkills = Array.from(data.list);
    const [removed] = updatedSkills.splice(source.index, 1);
    updatedSkills.splice(destination.index, 0, removed);

    onChange({ ...data, list: updatedSkills });
    setSkills(updatedSkills); // Update the skills list in the parent state
  };

  return (
    <Box sx={{ width: '400px', mx: 'auto', p: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, borderBottom: '2px solid #007bff', pb: 1 }}>
        {data.subheadline}
      </Typography>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="skillsList">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {data.list.map((skill, index) => (
                <Draggable key={index} draggableId={String(index)} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        width: snapshot.isDragging ? "1px" : "100%",
                        position: snapshot.isDragging ? "absolute" : "relative",
                        zIndex: snapshot.isDragging ? 9999 : "auto",
                        opacity: snapshot.isDragging ? 0.5 : 1,
                        margin: '8px',
                        padding: "16px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        ...provided.draggableProps.style
                      }}
                    >
                      <Typography variant="body1" style={{ width: "100%" }}>
                        {skill}
                      </Typography>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default SkillsForm;
