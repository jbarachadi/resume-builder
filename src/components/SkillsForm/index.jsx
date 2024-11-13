import React from 'react';
import styles from './style.module.css';

const SkillsForm = ({ data, onChange }) => {
  const handleSkillChange = (index, event) => {
    const updatedSkills = data.list.map((skill, i) =>
      i === index ? event.target.value : skill
    );
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
        <div key={index} className={styles.skillInput}>
          <input
            type="text"
            value={skill}
            onChange={(e) => handleSkillChange(index, e)}
            placeholder="Enter skill"
            className={styles.input}
          />
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
