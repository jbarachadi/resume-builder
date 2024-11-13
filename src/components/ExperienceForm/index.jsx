import React from 'react';
import styles from './style.module.css';

const ExperienceForm = ({ data, onChange }) => {
  const handleInputChange = (index, field, value) => {
    const updatedPositions = [...data.positions];
    updatedPositions[index][field] = value;
    onChange({ ...data, positions: updatedPositions });
  };

  const handleResponsibilityChange = (index, respIndex, value) => {
    const updatedPositions = [...data.positions];
    updatedPositions[index].responsibilities[respIndex] = value;
    onChange({ ...data, positions: updatedPositions });
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.subheadline}>{data.subheadline}</h3>
      {data.positions.map((position, index) => (
        <div key={index} className={styles.jobEntry}>
          <h4 className={styles.jobTitle}>{position.job_title} at {position.company}</h4>
          <p className={styles.location}>{position.location} | {position.duration}</p>
          
          <input
            type="text"
            value={position.job_title}
            onChange={(e) => handleInputChange(index, 'job_title', e.target.value)}
            className={styles.textInput}
            placeholder="Job Title"
          />

          <input
            type="text"
            value={position.company}
            onChange={(e) => handleInputChange(index, 'company', e.target.value)}
            className={styles.textInput}
            placeholder="Company"
          />

          <input
            type="text"
            value={position.location}
            onChange={(e) => handleInputChange(index, 'location', e.target.value)}
            className={styles.textInput}
            placeholder="Location"
          />

          <input
            type="text"
            value={position.duration}
            onChange={(e) => handleInputChange(index, 'duration', e.target.value)}
            className={styles.textInput}
            placeholder="Duration"
          />

          <ul className={styles.responsibilities}>
            {position.responsibilities.map((resp, respIndex) => (
              <li key={respIndex}>
                <textarea
                  value={resp}
                  onChange={(e) => handleResponsibilityChange(index, respIndex, e.target.value)}
                  className={styles.textarea}
                  placeholder="Responsibility"
                />
              </li>
            ))}
          </ul>

          <div className={styles.buttonContainer}>
            <button type="button" className={`${styles.button} ${styles.addButton}`}>Add Responsibility</button>
            <button type="button" className={`${styles.button} ${styles.removeButton}`}>Remove Position</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceForm;
