import React from 'react';
import styles from './style.module.css';

const SummaryForm = ({ data, onChange }) => {
  const handleInputChange = (e) => {
    onChange({ ...data, text: e.target.value });
  };

  return (
    <div className={styles.formContainer}>
      <h3>{data.subheadline}</h3>
      <textarea
        value={data.text}
        onChange={handleInputChange}
        className={styles.textarea}
      />
    </div>
  );
};

export default SummaryForm;
