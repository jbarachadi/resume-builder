import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './style.module.css';

const Template3 = ({ data, setSkills }) => {
  const { headline, summary, skills, experience, education, certifications, projects, references } = data;

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedSkills = Array.from(skills.list);
    const [movedSkill] = reorderedSkills.splice(result.source.index, 1);
    reorderedSkills.splice(result.destination.index, 0, movedSkill);

    setSkills(reorderedSkills); // Update the skills list in the parent state
  };

  return (
    <div className={styles.resumeContainer}>
      <header className={styles.header}>
        <h1>{headline}</h1>
        <div className={styles.contactInfo}>
          <a href="#">Download PDF</a> | <a href="mailto:name@yourdomain.com">name@yourdomain.com</a> | (313) - 867-5309
        </div>
      </header>

      <section className={styles.section}>
        <h2>{summary.subheadline}</h2>
        <p>{summary.text}</p>
      </section>

      <section className={styles.section}>
        <h2>{skills.subheadline}</h2>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="skillsList">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={styles.skillsList}
              >
                {skills.list.map((skill, index) => (
                  <Draggable key={skill} draggableId={skill} index={index}>
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
        <h2>{experience.subheadline}</h2>
        {experience.positions.map((position, index) => (
          <div key={index} className={styles.job}>
            <h3>{position.job_title}</h3>
            <h4>{position.company} - {position.location}</h4>
            <span>{position.duration}</span>
            <ul>
              {position.responsibilities.map((task, i) => (
                <li key={i}>{task}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2>{education.subheadline}</h2>
        {education.details.map((edu, index) => (
          <div key={index}>
            <h3>{edu.degree}</h3>
            <p>{edu.institution} - {edu.year}</p>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2>{certifications.subheadline}</h2>
        <ul>
          {certifications.list.map((cert, index) => (
            <li key={index}>{cert}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>{projects.subheadline}</h2>
        {projects.list.map((project, index) => (
          <div key={index}>
            <h3>{project.project_name}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </section>

      <footer className={styles.footer}>
        <p>{references.subheadline}: {references.text}</p>
      </footer>
    </div>
  );
};

export default Template3;
