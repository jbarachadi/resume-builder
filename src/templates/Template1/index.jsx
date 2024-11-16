import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './style.module.css';

const Template1 = ({ data, setSkills }) => {
  // Handle drag-and-drop logic
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedSkills = Array.from(data.skills.list);
    const [movedSkill] = reorderedSkills.splice(result.source.index, 1);
    reorderedSkills.splice(result.destination.index, 0, movedSkill);

    setSkills(reorderedSkills); // Update the skills list
  };

  return (
    <div className={styles.sheet}>
      <div className={`${styles.twoColumn} ${styles.resume}`}>
        <section className={`${styles.resume__section} ${styles.resume__header}`}>
          <div className={styles.resume__content}>
            <h1>{data.headline}</h1>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                <i className="fa fa-location-arrow"></i>
              </span>
              <span className={styles.infoText}>{data.location}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                <i className="fa fa-envelope"></i>
              </span>
              <span className={styles.infoText}>{data.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                <i className="fa fa-phone"></i>
              </span>
              <span className={styles.infoText}>{data.phone}</span>
            </div>
          </div>
        </section>

        <div className={styles.resume__columns}>
          <div className={styles.resume__main}>
            <section className={`${styles.resume__section} ${styles.resume__summary}`}>
              <div className={styles.resume__content}>
                <div className={styles.resume__sectionTitle}>
                  <i className="fa fa-pencil-square-o"></i>
                  <h2>{data.summary.subheadline}</h2>
                </div>
                <p>{data.summary.text}</p>
              </div>
            </section>

            <section className={`${styles.resume__section} ${styles.resume__experience}`}>
              <div className={styles.resume__content}>
                <div className={styles.resume__sectionTitle}>
                  <i className="fa fa-briefcase"></i>
                  <h2>{data.experience.subheadline}</h2>
                </div>
                {data.experience.positions.map((position, index) => (
                  <div key={index} className={styles.xpItem}>
                    <div className={styles.xpJob}>
                      {position.job_title} <span>@ {position.company}</span>
                      <br />
                      <small>{position.location}</small>
                    </div>
                    <div className={styles.xpDate}>{position.duration}</div>
                    <div className={styles.xpDetail}>
                      <ul>
                        {position.responsibilities.map((responsibility, idx) => (
                          <li key={idx}>{responsibility}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className={styles.resume__side}>
            <section className={`${styles.resume__section} ${styles.resume__skills}`}>
              <div className={styles.resume__content}>
                <div className={styles.resume__sectionTitle}>
                  <i className="fa fa-align-center"></i>
                  <h2>{data.skills.subheadline}</h2>
                </div>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="skillsList">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={styles.skillsList}
                      >
                        {data.skills.list.map((skill, index) => (
                          <Draggable key={skill} draggableId={skill} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={styles.extra}
                              >
                                <div className={styles.extraInfo}>{skill}</div>
                                <div className={styles.extraDetails}>
                                  <div
                                    className={styles.extraDetails__progress}
                                    style={{ width: '90%' }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </section>

            {data.languages && <section className={`${styles.resume__section} ${styles.resume__languages}`}>
              <div className={styles.resume__content}>
                <div className={styles.resume__sectionTitle}>
                  <i className="fa fa-globe"></i>
                  <h2>{data.languages.subheadline}</h2>
                </div>
                {data.languages.list.map((language, index) => (
                  <div key={index} className={styles.extra}>
                    <div className={styles.extraInfo}>
                      {language.name} <small>({language.level})</small>
                    </div>
                    <div className={styles.extraDetails}>
                      <div
                        className={styles.extraDetails__progress}
                        style={{ width: language.proficiency }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template1;
