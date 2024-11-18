import React from 'react';
import Template1 from '../../templates/Template1';
import Template2 from '../../templates/Template2';
import Template3 from '../../templates/Template3';
import { Box, Paper } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useStore } from "../../store"

const ResumePreview = ({ template, downloadable = false }) => {
  const { data, setData, skills, setSkills } = useStore();

  // const handleDragEnd = (result) => {
  //   const { destination, source } = result;

  //   // If there is no destination (dropped outside), return
  //   if (!destination) return;

  //   // If the item has not moved, return early
  //   if (
  //     destination.index === source.index &&
  //     destination.droppableId === source.droppableId
  //   ) {
  //     return;
  //   }

  //   // Safeguard against undefined lists
  //   const list1 = skills.list1 || [];
  //   const list2 = skills.list2 || [];

  //   // Handle moving items between the two lists
  //   const sourceListId = source.droppableId;
  //   const destinationListId = destination.droppableId;

  //   // Case for moving between list1 and list2
  //   if (
  //     (sourceListId === "list1" && destinationListId === "list2") ||
  //     (sourceListId === "list2" && destinationListId === "list1")
  //   ) {
  //     const sourceSkillsList = sourceListId === "list1" ? list1 : list2;
  //     const destinationSkillsList = destinationListId === "list1" ? list1 : list2;

  //     const [movedSkill] = sourceSkillsList.splice(source.index, 1);
  //     destinationSkillsList.splice(destination.index, 0, movedSkill);

  //     setSkills({
  //       list1: list1,
  //       list2: list2,
  //     });
  //   } else {
  //     // Case for reordering within the same list
  //     const sourceSkillsList = sourceListId === "list1" ? list1 : list2;
  //     const reorderedSkillsList = Array.from(sourceSkillsList);
  //     const [movedSkill] = reorderedSkillsList.splice(source.index, 1);
  //     reorderedSkillsList.splice(destination.index, 0, movedSkill);

  //     setSkills({
  //       list1: sourceListId === "list1" ? reorderedSkillsList : list1,
  //       list2: sourceListId === "list2" ? reorderedSkillsList : list2,
  //     });
  //   }
  // };

  const handleDragEnd = (result) => {
    const { destination, source } = result;
  
    // If there is no destination (dropped outside), return
    if (!destination) return;
  
    // If the item has not moved, return early
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }
  
    // Safeguard against undefined lists
    const list1 = skills.list1 || [];
    const list2 = skills.list2 || [];
    const list3 = data.sections.suggested_missions.items || [];
    const list4 = data.sections.experience.items.map((exp) => exp.missions || []);
  
    // Extract source and destination lists
    const sourceListId = source.droppableId;
    const destinationListId = destination.droppableId;
  
    // Helper function to get the appropriate list
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
  
    // Handle drag and drop logic
    const sourceList = getList(sourceListId);
    const destinationList = getList(destinationListId);
  
    if (!sourceList || !destinationList) return;
  
    // Remove the item from the source list
    const [movedItem] = sourceList.splice(source.index, 1);
  
    // Add the item to the destination list
    destinationList.splice(destination.index, 0, movedItem);
  
    // Update the state based on the lists that changed
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
    }
  };
  
  return (
      <Box sx={{ display: 'flex', flexDirection: "row", gap: 3, bgcolor: 'white' }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Paper elevation={3}>
            {template === 'Template1' && <Template1 data={data} skills={skills} downloadable={downloadable} />}
            {template === 'Template2' && <Template2 data={data} skills={skills} downloadable={downloadable} />}
            {template === 'Template3' && <Template3 data={data} skills={skills} downloadable={downloadable} />}
          </Paper>
          {!downloadable &&
            <Paper elevation={3} sx={{ display: "flex", flexDirection: "column" }}>
              <Paper elevation={3} sx={{ display: "flex", p: 8, width: "600px" }}>
                <Droppable droppableId="list3">
                  {(provided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <h2 style={{ marginBottom: "24px" }}>{data.sections.suggested_missions.name}</h2>
                      {data.sections.suggested_missions.items.map((suggested_mission, index) => (
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
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </Paper>
              <Paper elevation={3} sx={{ display: "flex", p: 8, width: "600px" }}>
                <Droppable droppableId="list1">
                  {(provided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <h2 style={{ marginBottom: "24px" }}>Suggested {data.sections.skills.name}</h2>
                      {skills.list1.map((skill, index) => (
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
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </Paper>
            </Paper>
          }
        </DragDropContext>
      </Box>
  )
};

export default ResumePreview;
