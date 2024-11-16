import React from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from "./style.module.css";

const Template2 = ({ data, setSkills }) => {
  const {
    profile,
    headline,
    summary,
    skills,
    experience,
    education,
    certifications,
    projects,
    references,
  } = data;

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    const reorderedSkills = Array.from(skills.list);
    const [movedSkill] = reorderedSkills.splice(source.index, 1);
    reorderedSkills.splice(destination.index, 0, movedSkill);

    setSkills(reorderedSkills);
  };

  return (
    <div className={styles.resume}>
      {/* Left Section */}
      <div className={styles.resume_left}>
        {/* Profile */}
        <div className={styles.resume_profile}>
          <img src={profile.photo || "https://via.placeholder.com/150"} alt="Profile Pic" />
        </div>

        {/* Contact Info */}
        <div className={styles.resume_content}>
          <div className={`${styles.resume_item} ${styles.resume_info}`}>
            <div className={styles.title}>
              <p className={styles.bold}>{profile.name || "Name Not Provided"}</p>
              <p className={styles.regular}>{headline}</p>
            </div>
            <ul>
              <li>
                <div className={styles.icon}>
                  <i className="fas fa-map-signs"></i>
                </div>
                <div className={styles.data}>{profile.location || "Location Not Provided"}</div>
              </li>
              <li>
                <div className={styles.icon}>
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <div className={styles.data}>{profile.phone || "Phone Not Provided"}</div>
              </li>
              <li>
                <div className={styles.icon}>
                  <i className="fas fa-envelope"></i>
                </div>
                <div className={styles.data}>{profile.email || "Email Not Provided"}</div>
              </li>
            </ul>
          </div>

          {/* Skills */}
          <div className={`${styles.resume_item} ${styles.resume_skills}`}>
            <div className={styles.title}>
              <p className={styles.bold}>{skills.subheadline}</p>
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="skillsList">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={styles.skillsList}
                  >
                    {skills.list.map((skill, index) => (
                      <Draggable key={index} draggableId={String(index)} index={index}>
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
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className={styles.resume_right}>
        {/* Summary */}
        <div className={`${styles.resume_item} ${styles.resume_about}`}>
          <div className={styles.title}>
            <p className={styles.bold}>{summary.subheadline}</p>
          </div>
          <p>{summary.text}</p>
        </div>

        {/* Work Experience */}
        <div className={`${styles.resume_item} ${styles.resume_work}`}>
          <div className={styles.title}>
            <p className={styles.bold}>{experience.subheadline}</p>
          </div>
          <ul>
            {experience.positions.map((position, index) => (
              <li key={index}>
                <div className={styles.date}>{position.duration}</div>
                <div className={styles.info}>
                  <p className={styles.semi_bold}>{position.job_title}</p>
                  <p>{position.company}, {position.location}</p>
                  <ul>
                    {position.responsibilities.map((task, taskIndex) => (
                      <li key={taskIndex}>{task}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Education */}
        <div className={`${styles.resume_item} ${styles.resume_education}`}>
          <div className={styles.title}>
            <p className={styles.bold}>{education.subheadline}</p>
          </div>
          <ul>
            {education.details.map((degree, index) => (
              <li key={index}>
                <div className={styles.date}>{degree.year}</div>
                <div className={styles.info}>
                  <p className={styles.semi_bold}>{degree.degree}</p>
                  <p>{degree.institution}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Certifications */}
        <div className={`${styles.resume_item} ${styles.resume_certifications}`}>
          <div className={styles.title}>
            <p className={styles.bold}>{certifications.subheadline}</p>
          </div>
          <ul>
            {certifications.list.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </div>

        {/* Projects */}
        <div className={`${styles.resume_item} ${styles.resume_projects}`}>
          <div className={styles.title}>
            <p className={styles.bold}>{projects.subheadline}</p>
          </div>
          <ul>
            {projects.list.map((project, index) => (
              <li key={index}>
                <p className={styles.semi_bold}>{project.project_name}</p>
                <p>{project.description}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* References */}
        <div className={`${styles.resume_item} ${styles.resume_references}`}>
          <div className={styles.title}>
            <p className={styles.bold}>{references.subheadline}</p>
          </div>
          <p>{references.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Template2;
