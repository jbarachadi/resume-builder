import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import DraggableMissions from '../DraggableMissions';
import styles from './style.module.css';

const Template3 = ({ data, skills, downloadable }) => {
  const { basics, sections } = data;

  return (
    <div className={styles.resumeContainer}>
      <header className={styles.header}>
        <h1>{basics.name}</h1>
        <div className={styles.contactInfo}>
          <a href={basics.email}>{basics.email}</a> | {basics.phone}
        </div>
      </header>

      {sections?.summary &&
        <section className={styles.section}>
          <h2>{sections.summary.name}</h2>
          <p>{sections.summary.content}</p>
        </section>
      }

      {sections?.skills.items.length !== 0 && sections?.skills.items[0]["name"] &&
        <section className={styles.section}>
          <h2>{skills.name}</h2>
          {downloadable ? 
            <>
              <h2>{sections.skills.name}</h2>
              <ul className={styles.skillsList}>
                {skills.list2.map((skill) => (
                  <li className={styles.skillItem}>
                    • {skill}
                  </li>))}
              </ul>
            </>
            : <Droppable droppableId="list2" direction='horizontal'>
              {(provided) => (
                <>
                  <h2>{sections.skills.name}</h2>
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={styles.skillsList}
                  >
                    {skills.list2.map((skill, index) => (
                      <Draggable key={skill} draggableId={`list2-${skill}`} index={index}>
                        {(provided, snapshot) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={styles.skillItem}
                            style={{
                              ...provided.draggableProps.style,
                              width: snapshot.isDragging ? "1px" : "auto",
                              position: snapshot.isDragging ? "absolute" : "relative",
                              zIndex: snapshot.isDragging ? 9999 : "auto",
                              opacity: snapshot.isDragging ? 0.5 : 1,
                            }}
                          >
                            • {skill}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                </>
              )}
            </Droppable>
          }
        </section>
      }

      {sections?.languages.items.length !== 0 && sections?.languages.items[0]["name"] &&
        <section className={styles.section}>
          <h2>{sections.languages.name}</h2>
          <ul className={styles.skillsList}>
            {sections.languages.items.map((language) => (
              <li className={styles.skillItem}>
                • {language.name}
              </li>))}
          </ul>
        </section>
      }

      {sections?.experience.items.length !== 0 && sections?.experience.items[0]["position"] &&
        <section className={styles.section}>
          <h2>{sections.experience.name}</h2>
          {sections.experience.items.map((experience, index) => (
            <div key={index} className={styles.job}>
              <h3>{experience.position}</h3>
              <h4>{experience.company} - {experience.location}</h4>
              <span>{experience.date}</span>
              <DraggableMissions droppableId={`list4-${index}`} experience={experience} />
            </div>
          ))}
        </section>
      }

      {sections?.education.items.length !== 0 && sections?.education.items[0]["institution"] &&
        <section className={styles.section}>
          <h2>{sections.education.name}</h2>
          {sections.education.items.map((edu, index) => (
            <div key={index}>
              <h3>{edu.studyType}</h3>
              <p>{edu.institution} - {edu.date}</p>
            </div>
          ))}
        </section>
      }

      {sections?.certifications.items.length !== 0 && sections?.certifications.items[0]["name"] &&
        <section className={styles.section}>
          <h2>{sections.certifications.name}</h2>
          <ul>
            {sections.certifications.items.map((cert, index) => (
              <li key={index}>{cert.name}</li>
            ))}
          </ul>
        </section>
      }

      {sections?.projects.items.length !== 0 && sections?.projects.items[0]["name"] &&
        <section className={styles.section}>
          <h2>{sections.projects.name}</h2>
          {sections.projects.items.map((project, index) => (
            <div key={index}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </div>
          ))}
        </section>
      }

      {sections?.references.items.length !== 0 && sections?.references.items[0]["name"] &&
        <section className={styles.section}>
          <h2>{sections.references.name}</h2>
          {sections.references.items.map((reference, index) => (
            <div key={index}>
              <p>{reference.name} - {reference.email} - {reference.phone}</p>
            </div>
          ))}
        </section>
      }
    </div>
  );
};

export default Template3;
