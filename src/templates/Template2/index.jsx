import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import DraggableMissions from "../DraggableMissions";
import styles from "./style.module.css";

const Template2 = ({ data, skills, downloadable }) => {
  const { basics, sections } = data;

  return (
    <div className={styles.resume}>
      {/* Left Section */}
      <div className={styles.resume_left}>
        {/* Profile */}
        <div className={styles.resume_profile}>
          <img src={basics?.photo || "https://via.placeholder.com/150"} alt="Profile Pic" />
        </div>

        {/* Contact Info */}
        <div className={styles.resume_content}>
          <div className={`${styles.resume_item} ${styles.resume_info}`}>
            <div className={styles.title}>
              <p className={styles.bold}>{basics.name || "Name Not Provided"}</p>
              <p className={styles.regular}>{basics.headline}</p>
            </div>
            <ul>
              <li>
                <div className={styles.icon}>
                  <i className="fas fa-map-signs"></i>
                </div>
                <div className={styles.data}>{basics.location || "Location Not Provided"}</div>
              </li>
              <li>
                <div className={styles.icon}>
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <div className={styles.data}>{basics.phone || "Phone Not Provided"}</div>
              </li>
              <li>
                <div className={styles.icon}>
                  <i className="fas fa-envelope"></i>
                </div>
                <div className={styles.data}>{basics.email || "Email Not Provided"}</div>
              </li>
            </ul>
          </div>

          {/* Skills */}
          {sections?.skills.items.length !== 0 && sections?.skills.items[0]["name"] &&
            <div className={`${styles.resume_item} ${styles.resume_skills}`}>
              {downloadable ?
                <ul className={styles.skillsList}>
                  <div className={styles.title}>
                    <p className={styles.bold}>{sections.skills.name}</p>
                  </div>
                  {skills.list2.map((skill) => (
                    <li className={styles.skillItem}>
                      {skill}
                    </li>))}
                </ul>
                : <>
                  <Droppable droppableId="list2">
                    {(provided) => (
                      <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={styles.skillsList}
                      >
                        <div className={styles.title}>
                          <p className={styles.bold}>{sections.skills.name}</p>
                        </div>
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
                </>
              }
            </div>
          }
        </div>
      </div>

      {/* Right Section */}
      <div className={styles.resume_right}>
        {/* Summary */}
        {sections?.summary &&
          <div className={`${styles.resume_item} ${styles.resume_about}`}>
            <div className={styles.title}>
              <p className={styles.bold}>{sections.summary.name}</p>
            </div>
            <p>{sections.summary.content}</p>
          </div>
        }

        {/* Work Experience */}
        {sections?.experience.items.length !== 0 && sections?.experience.items[0]["position"] &&
          <div className={`${styles.resume_item} ${styles.resume_work}`}>
            <div className={styles.title}>
              <p className={styles.bold}>{sections.experience.name}</p>
            </div>
            <ul>
              {sections.experience.items.map((experience, index) => (
                <li key={index}>
                  <div className={styles.date}>{experience.date}</div>
                  <div className={styles.info}>
                    <p className={styles.semi_bold}>{experience.position}</p>
                    <p>{experience.company}, {experience.location}</p>
                    <DraggableMissions droppableId={`list4-${index}`} experience={experience} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        }

        {/* Education */}
        {sections?.education.items.length !== 0 && sections?.education.items[0]["institution"] &&
          <div className={`${styles.resume_item} ${styles.resume_education}`}>
            <div className={styles.title}>
              <p className={styles.bold}>{sections.education.name}</p>
            </div>
            <ul>
              {sections.education.items.map((degree, index) => (
                <li key={index}>
                  <div className={styles.date}>{degree.date}</div>
                  <div className={styles.info}>
                    <p className={styles.semi_bold}>{degree.studyType}</p>
                    <p>{degree.institution}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        }

        {/* Certifications */}
        {sections?.certifications.items.length !== 0 && sections?.certifications.items[0]["name"] &&
          <div className={`${styles.resume_item} ${styles.resume_certifications}`}>
            <div className={styles.title}>
              <p className={styles.bold}>{sections.certifications.name}</p>
            </div>
            <ul>
              {sections.certifications.items.map((cert, index) => (
                <li key={index}>{cert.name}</li>
              ))}
            </ul>
          </div>
        }

        {/* Projects */}
        {sections?.projects.items.length !== 0 && sections?.projects.items[0]["name"] &&
          <div className={`${styles.resume_item} ${styles.resume_projects}`}>
            <div className={styles.title}>
              <p className={styles.bold}>{sections.projects.name}</p>
            </div>
            <ul>
              {sections.projects.items.map((project, index) => (
                <li key={index}>
                  <p className={styles.semi_bold}>{project.name}</p>
                  <p>{project.description}</p>
                </li>
              ))}
            </ul>
          </div>
        }

        {/* References */}
        {sections?.references.items.length !== 0 && sections?.references.items[0]["name"] &&
          <div className={`${styles.resume_item} ${styles.resume_references}`}>
            <div className={styles.title}>
              <p className={styles.bold}>{sections.references.name}</p>
            </div>
            <p>{sections.references.text}</p>
          </div>
        }
      </div>
    </div>
  );
};

export default Template2;
