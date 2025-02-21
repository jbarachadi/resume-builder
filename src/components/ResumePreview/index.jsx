import React from 'react';
import Template1 from '../../templates/Template1';
import Template2 from '../../templates/Template2';
import Template3 from '../../templates/Template3';
import { Box, Paper, Divider,useMediaQuery, useTheme } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useStore } from "../../store"

const ResumePreview = ({ template, downloadable = false }) => {
  const { data, setData, skills, setSkills } = useStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDragEnd = (result) => {
    const { destination, source } = result;
  
    if (!destination) return;
  
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }
  
    const list1 = skills.list1 || [];
    const list2 = skills.list2 || [];
    const list3 = data.sections.suggested_missions.items || [];
    const list4 = data.sections.experience.items.map((exp) => exp.missions || []);
  
    const sourceListId = source.droppableId;
    const destinationListId = destination.droppableId;
  
    const getList = (droppableId) => {
      if (droppableId === "list1") return list1;
      if (droppableId === "list2") return list2;
      if (droppableId === "list3") return list3;
      if (droppableId.startsWith("list4")) {
        const index = parseInt(droppableId.split("-")[1], 10);
        return list4[index];
      }
      return [];
    };
  
    const sourceList = getList(sourceListId);
    const destinationList = getList(destinationListId);
  
    if (!sourceList || !destinationList) return;
  
    const [movedItem] = sourceList.splice(source.index, 1);
  
    destinationList.splice(destination.index, 0, movedItem);
  
    if (destinationListId === "list1" || destinationListId === "list2") {
      if (sourceListId === "list1" || destinationListId === "list1") {
        setSkills({ ...skills, list1 });
      }
      if (sourceListId === "list2" || destinationListId === "list2") {
        setSkills({ ...skills, list2 });
      }
    } else {
      if (sourceListId === "list3" || destinationListId === "list3") {
        setData({
          ...data,
          sections: {
            ...data.sections,
            suggested_missions: { ...data.sections.suggested_missions, items: list3 },
          },
        });
      }
      if (sourceListId.startsWith("list4") || destinationListId.startsWith("list4")) {
        const updatedExperienceItems = data.sections.experience.items.map((item, idx) => ({
          ...item,
          missions: idx === parseInt(sourceListId.split("-")[1], 10) ? sourceList : idx === parseInt(destinationListId.split("-")[1], 10) ? destinationList : item.missions,
        }));
        setData({
          ...data,
          sections: {
            ...data.sections,
            experience: {
              ...data.sections.experience,
              items: updatedExperienceItems
            }
          },
        });
      }
      setSkills({ list1, list2 });
    }
  };
  
  return (
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : "row", gap: 3, bgcolor: 'white'}}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Paper elevation={3} sx={{order: isMobile ? '2' : ''}}>
            {template === 'Template1' && <Template1 data={data} skills={skills} downloadable={downloadable} />}
            {template === 'Template2' && <Template2 data={data} skills={skills} downloadable={downloadable} />}
            {template === 'Template3' && <Template3 data={data} skills={skills} downloadable={downloadable} />}
          </Paper>
          {!downloadable &&
            <Paper elevation={3} sx={{ display: "flex", flexDirection: "column" }}>
              <Box elevation={3} sx={{ display: "flex", width: isMobile ? '43vh' : '600px' }}>
                <Droppable droppableId="list3">
                  {(provided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ width: "100%" }}
                    >
                      <h2 style={{ padding: "24px", backgroundColor: "#002855", width: "100%", color: "white" }}>{data.sections.suggested_missions.name}</h2>
                      <Box sx={{ p: 3, pt: 1 }}>
                        {data.sections.suggested_missions.items.map((suggested_mission, index) => (
                          <>
                            <Draggable key={suggested_mission} draggableId={`list3-${suggested_mission}`} index={index}>
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {suggested_mission}
                                </li>
                              )}
                            </Draggable>
                            {index !== data.sections.suggested_missions.items.length - 1 && <Divider />}
                          </>
                        ))}
                      </Box>
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </Box>
              <Box elevation={3} sx={{ display: "flex", width: isMobile ? '43vh' : '600px' }}>
                <Droppable droppableId="list1">
                  {(provided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ width: "100%" }}
                    >
                      <h2 style={{ padding: "24px", backgroundColor: "#002855", width: "100%", color: "white" }}>Suggested {data.sections.skills.name}</h2>
                      <Box sx={{ p: 3, pt: 1 }}>
                        {skills.list1.map((skill, index) => (
                          <>
                            <Draggable key={skill} draggableId={`list1-${skill}`} index={index}>
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {skill}
                                </li>
                              )}
                            </Draggable>
                            {index !== skills.list1.length - 1 && <Divider />}
                          </>
                        ))}
                      </Box>
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </Box>
            </Paper>
          }
        </DragDropContext>
      </Box>
  )
};

export default ResumePreview;