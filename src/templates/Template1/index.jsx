import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './style.module.css';

const Template1 = ({ data, setSkills }) => {
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
    <div className={styles.sheet}>
      <div className={`${styles.twoColumn} ${styles.resume}`}>
        <section className={`${styles.resume__section} ${styles.resume__header}`}>
          <div className={styles.resume__content}>
            <h1>{basics.headline}</h1>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                <i className="fa fa-location-arrow"></i>
              </span>
              <span className={styles.infoText}>{sections.location}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                <i className="fa fa-envelope"></i>
              </span>
              <span className={styles.infoText}>{sections.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                <i className="fa fa-phone"></i>
              </span>
              <span className={styles.infoText}>{sections.phone}</span>
            </div>
          </div>
        </section>

        <div className={styles.resume__columns}>
          <div className={styles.resume__main}>
            <section className={`${styles.resume__section} ${styles.resume__summary}`}>
              <div className={styles.resume__content}>
                <div className={styles.resume__sectionTitle}>
                  <i className="fa fa-pencil-square-o"></i>
                  <h2>{sections.summary.name}</h2>
                </div>
                <p>{sections.summary.text}</p>
              </div>
            </section>

            <section className={`${styles.resume__section} ${styles.resume__experience}`}>
              <div className={styles.resume__content}>
                <div className={styles.resume__sectionTitle}>
                  <i className="fa fa-briefcase"></i>
                  <h2>{sections.experience.name}</h2>
                </div>
                {sections.experience.items.map((experience, index) => (
                  <div key={index} className={styles.xpItem}>
                    <div className={styles.xpJob}>
                      {experience.position} <span>@ {experience.company}</span>
                      <br />
                      <small>{experience.location}</small>
                    </div>
                    <div className={styles.xpDate}>{experience.date}</div>
                    {/* <div className={styles.xpDetail}>
                      <ul>
                        {experience.responsibilities.map((responsibility, idx) => (
                          <li key={idx}>{responsibility}</li>
                        ))}
                      </ul>
                    </div> */}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className={styles.resume__side}>
            <section className={`${styles.resume__section} ${styles.resume__skills}`}>
              <div className={styles.resume__content}>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="list1">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={styles.skillsList}
                      >
                        <div className={styles.resume__sectionTitle}>
                          <i className="fa fa-align-center"></i>
                          <h2>Suggested {sections.skills.name}</h2>
                        </div>
                        {skills.list1.map((skill, index) => (
                          <Draggable key={skill} draggableId={`list1-${skill}`} index={index}>
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
                  <Droppable droppableId="list2">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={styles.skillsList}
                      >
                        <div className={styles.resume__sectionTitle}>
                          <i className="fa fa-align-center"></i>
                          <h2>Current {sections.skills.name}</h2>
                        </div>
                        {skills.list2.map((skill, index) => (
                          <Draggable key={skill} draggableId={`list2-${skill}`} index={index}>
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

            {sections.languages && <section className={`${styles.resume__section} ${styles.resume__languages}`}>
              <div className={styles.resume__content}>
                <div className={styles.resume__sectionTitle}>
                  <i className="fa fa-globe"></i>
                  <h2>{sections.languages.name}</h2>
                </div>
                {sections.languages.items.map((language, index) => (
                  <div key={index} className={styles.extra}>
                    <div className={styles.extraInfo}>
                      {language.name} <small>({language.level})</small>
                    </div>
                    <div className={styles.extraDetails}>
                      <div
                        className={styles.extraDetails__progress}
                        style={{ width: language.proficiency || '90%'}}
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
