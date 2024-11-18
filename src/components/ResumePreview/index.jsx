import React from 'react';
import Template1 from '../../templates/Template1';
import Template2 from '../../templates/Template2';
import Template3 from '../../templates/Template3';
import { Box, Paper } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useStore } from "../../store"

const ResumePreview = ({ template, downloadable = false }) => {
  const { data, skills, setSkills } = useStore();

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

    // Handle moving items between the two lists
    const sourceListId = source.droppableId;
    const destinationListId = destination.droppableId;

    // Case for moving between list1 and list2
    if (
      (sourceListId === "list1" && destinationListId === "list2") ||
      (sourceListId === "list2" && destinationListId === "list1")
    ) {
      const sourceSkillsList = sourceListId === "list1" ? list1 : list2;
      const destinationSkillsList = destinationListId === "list1" ? list1 : list2;

      const [movedSkill] = sourceSkillsList.splice(source.index, 1);
      destinationSkillsList.splice(destination.index, 0, movedSkill);

      setSkills({
        list1: list1,
        list2: list2,
      });
    } else {
      // Case for reordering within the same list
      const sourceSkillsList = sourceListId === "list1" ? list1 : list2;
      const reorderedSkillsList = Array.from(sourceSkillsList);
      const [movedSkill] = reorderedSkillsList.splice(source.index, 1);
      reorderedSkillsList.splice(destination.index, 0, movedSkill);

      setSkills({
        list1: sourceListId === "list1" ? reorderedSkillsList : list1,
        list2: sourceListId === "list2" ? reorderedSkillsList : list2,
      });
    }
  };

  return (
      <Box sx={{ maxWidth: "1400px", display: 'flex', flexDirection: "row", gap: 3, bgcolor: 'white' }} >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Paper elevation={3}>
            {template === 'Template1' && <Template1 data={data} skills={skills} downloadable={downloadable} />}
            {template === 'Template2' && <Template2 data={data} skills={skills} downloadable={downloadable} />}
            {template === 'Template3' && <Template3 data={data} skills={skills} downloadable={downloadable} />}
          </Paper>
          {!downloadable &&
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
          }
        </DragDropContext>
      </Box>
  )
};

export default ResumePreview;
