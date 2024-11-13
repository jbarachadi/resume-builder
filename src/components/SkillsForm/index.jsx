import React from 'react';
import styles from './style.module.css';

const SkillsForm = ({ data, onChange }) => {
  const handleSkillChange = (index, value) => {
    const updatedSkills = data.list.map((skill, i) => (i === index ? value : skill));
    onChange({ ...data, list: updatedSkills });
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = data.list.filter((_, i) => i !== index);
    onChange({ ...data, list: updatedSkills });
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.subheadline}>{data.subheadline}</h3>
      {data.list.map((skill, index) => (
        <div key={index} className={styles.skillInputContainer}>
          <label htmlFor={`skill-${index}`} className={styles.label}>Skill</label>
          <input
            type="text"
            id={`skill-${index}`}
            value={skill}
            onChange={(e) => handleSkillChange(index, e.target.value)}
            placeholder="Enter skill"
            className={styles.input}
          />
          <button
            type="button"
            className={styles.saveButton}
            onClick={() => handleSkillChange(index, skill)}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => handleRemoveSkill(index)}
            className={`${styles.button} ${styles.removeButton}`}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className={`${styles.button} ${styles.addButton}`}
        onClick={() => onChange({ ...data, list: [...data.list, ''] })}
      >
        Add Skill
      </button>
    </div>
  );
};

export default SkillsForm;
