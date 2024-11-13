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

  const addResponsibility = (index) => {
    const updatedPositions = [...data.positions];
    updatedPositions[index].responsibilities.push('');
    onChange({ ...data, positions: updatedPositions });
  };

  const removePosition = (index) => {
    const updatedPositions = data.positions.filter((_, i) => i !== index);
    onChange({ ...data, positions: updatedPositions });
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.subheadline}>{data.subheadline}</h3>
      {data.positions.map((position, index) => (
        <div key={index} className={styles.jobEntry}>
          <label htmlFor={`jobTitle-${index}`} className={styles.label}>Job Title</label>
          <input
            type="text"
            id={`jobTitle-${index}`}
            value={position.job_title}
            onChange={(e) => handleInputChange(index, 'job_title', e.target.value)}
            className={styles.textInput}
            placeholder="Job Title"
          />
          <button type="button" className={styles.saveButton} onClick={() => handleInputChange(index, 'job_title', position.job_title)}>
            Save
          </button>

          <label htmlFor={`company-${index}`} className={styles.label}>Company</label>
          <input
            type="text"
            id={`company-${index}`}
            value={position.company}
            onChange={(e) => handleInputChange(index, 'company', e.target.value)}
            className={styles.textInput}
            placeholder="Company"
          />
          <button type="button" className={styles.saveButton} onClick={() => handleInputChange(index, 'company', position.company)}>
            Save
          </button>

          <label htmlFor={`location-${index}`} className={styles.label}>Location</label>
          <input
            type="text"
            id={`location-${index}`}
            value={position.location}
            onChange={(e) => handleInputChange(index, 'location', e.target.value)}
            className={styles.textInput}
            placeholder="Location"
          />
          <button type="button" className={styles.saveButton} onClick={() => handleInputChange(index, 'location', position.location)}>
            Save
          </button>

          <label htmlFor={`duration-${index}`} className={styles.label}>Duration</label>
          <input
            type="text"
            id={`duration-${index}`}
            value={position.duration}
            onChange={(e) => handleInputChange(index, 'duration', e.target.value)}
            className={styles.textInput}
            placeholder="Duration"
          />
          <button type="button" className={styles.saveButton} onClick={() => handleInputChange(index, 'duration', position.duration)}>
            Save
          </button>

          <ul className={styles.responsibilities}>
            {position.responsibilities.map((resp, respIndex) => (
              <li key={respIndex}>
                <label htmlFor={`responsibility-${index}-${respIndex}`} className={styles.label}>Responsibility</label>
                <textarea
                  id={`responsibility-${index}-${respIndex}`}
                  value={resp}
                  onChange={(e) => handleResponsibilityChange(index, respIndex, e.target.value)}
                  className={styles.textarea}
                  placeholder="Responsibility"
                />
                <button type="button" className={styles.saveButton} onClick={() => handleResponsibilityChange(index, respIndex, resp)}>
                  Save
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={`${styles.button} ${styles.addButton}`}
              onClick={() => addResponsibility(index)}
            >
              Add Responsibility
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.removeButton}`}
              onClick={() => removePosition(index)}
            >
              Remove Position
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceForm;
