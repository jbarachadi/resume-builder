import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './style.module.css';

const Template3 = ({ data, setSkills }) => {
  const { basics, sections, skills } = data;

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
        list1: sourceListId === "list1" ? sourceSkillsList : list1,
        list2: sourceListId === "list2" ? sourceSkillsList : list2,
      });
    } else {
      // Case for reordering within the same list
      const sourceSkillsList = sourceListId === "list1" ? list1 : list2;
      const reorderedSkillsList = Array.from(sourceSkillsList);
      const [movedSkill] = reorderedSkillsList.splice(source.index, 1);
      reorderedSkillsList.splice(destination.index, 0, movedSkill);

      setSkills((prevSkills) => {
        return {
          ...prevSkills,
          [sourceListId]: reorderedSkillsList,
        }
      });
    }
  };

  return (
    <div className={styles.resumeContainer}>
      <header className={styles.header}>
        <h1>{basics.headline}</h1>
        <div className={styles.contactInfo}>
          <a href="#">Download PDF</a> | <a href="mailto:name@yourdomain.com">name@yourdomain.com</a> | (313) - 867-5309
        </div>
      </header>

      <section className={styles.section}>
        <h2>{sections.summary.name}</h2>
        <p>{sections.summary.content}</p>
      </section>

      <section className={styles.section}>
        <h2>{skills.name}</h2>
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* First Skills List */}
          <Droppable droppableId="list1">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={styles.skillsList}
              >
                <h2>Suggested {sections.skills.name}</h2>
                {skills.list1.map((skill, index) => (
                  <Draggable key={skill} draggableId={`list1-${skill}`} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={styles.skillItem}
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
          <Droppable droppableId="list2">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={styles.skillsList}
              >
                <h2>Current {sections.skills.name}</h2>
                {skills.list2.map((skill, index) => (
                  <Draggable key={skill} draggableId={`list2-${skill}`} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={styles.skillItem}
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
        </DragDropContext>
      </section>

      <section className={styles.section}>
        <h2>{sections.experience.name}</h2>
        {sections.experience.items.map((experience, index) => (
          <div key={index} className={styles.job}>
            <h3>{experience.position}</h3>
            <h4>{experience.company} - {experience.location}</h4>
            <span>{experience.date}</span>
            {/* <ul>
              {experience.responsibilities.map((task, i) => (
                <li key={i}>{task}</li>
              ))}
            </ul> */}
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2>{sections.education.name}</h2>
        {sections.education.items.map((edu, index) => (
          <div key={index}>
            <h3>{edu.studyType}</h3>
            <p>{edu.institution} - {edu.date}</p>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2>{sections.certifications.name}</h2>
        <ul>
          {sections.certifications.items.map((cert, index) => (
            <li key={index}>{cert.name}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>{sections.projects.name}</h2>
        {sections.projects.items.map((project, index) => (
          <div key={index}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </section>

      <footer className={styles.footer}>
        <p>{sections.references.name}: {sections.references.text}</p>
      </footer>
    </div>
  );
};

export default Template3;
