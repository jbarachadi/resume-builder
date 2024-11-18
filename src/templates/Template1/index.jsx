import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './style.module.css';

const Template1 = ({ data, skills, downloadable }) => {  
  const { basics, sections } = data;

  return (
    <div className={styles.sheet} style={{ backgroundColor: 'white' }}>
      <div className={`${styles.twoColumn} ${styles.resume}`}>
        <section className={`${styles.resume__section} ${styles.resume__header}`}>
          <div className={styles.resume__content}>
            <h1>{basics.name}</h1>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                <i className="fa fa-location-arrow"></i>
              </span>
              <span className={styles.infoText}>{basics.location}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                <i className="fa fa-envelope"></i>
              </span>
              <span className={styles.infoText}>{basics.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                <i className="fa fa-phone"></i>
              </span>
              <span className={styles.infoText}>{basics.phone}</span>
            </div>
          </div>
        </section>

        <div className={styles.resume__columns}>
          <div className={styles.resume__main}>
            {sections?.summary &&
              <section className={`${styles.resume__section} ${styles.resume__summary}`}>
                <div className={styles.resume__content}>
                  <div className={styles.resume__sectionTitle}>
                    <i className="fa fa-pencil-square-o"></i>
                    <h2>{sections.summary.name}</h2>
                  </div>
                  <p>{sections.summary.content}</p>
                </div>
              </section>
            }

            {sections?.experience.items.length !== 0 && sections?.experience.items[0]["position"] &&
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
                      <div className={styles.xpDetail}>
                        <ul>
                          {experience.missions.map((mission, idx) => (
                            <li key={idx}>{mission}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            }
          </div>

          <div className={styles.resume__side}>
            <section className={`${styles.resume__section} ${styles.resume__skills}`}>
              {sections?.skills.items.length !== 0 && sections?.skills.items[0]["name"] &&
                <div className={styles.resume__content}>
                  {downloadable ?
                    <div className={styles.skillsList}>
                      <div className={styles.resume__sectionTitle}>
                        <i className="fa fa-align-center"></i>
                        <h2>{sections.skills.name}</h2>
                      </div>
                      {skills.list2.map((skill) => (
                        <div className={styles.extra}>
                          <div className={styles.extraInfo}>{skill}</div>
                          <div className={styles.extraDetails}>
                            <div
                              className={styles.extraDetails__progress}
                              style={{ width: '90%' }}
                            ></div>
                          </div>
                        </div>))}
                    </div>
                    : <Droppable droppableId="list2">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={styles.skillsList}
                          >
                            <div className={styles.resume__sectionTitle}>
                              <i className="fa fa-align-center"></i>
                              <h2>{sections.skills.name}</h2>
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
                  }
                </div>
              }
            </section>

            {sections.languages.items.length !== 0 && sections?.languages.items[0]["name"] &&
              <section className={`${styles.resume__section} ${styles.resume__languages}`}>
                <div className={styles.resume__content}>
                  <div className={styles.resume__sectionTitle}>
                    <i className="fa fa-globe"></i>
                    <h2>{sections.languages.name}</h2>
                  </div>
                  {sections.languages.items.map((language, index) => (
                    <div key={index} className={styles.extra}>
                      <div className={styles.extraInfo}>
                        {language.name} <small>{language.level}</small>
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
              </section>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template1;
