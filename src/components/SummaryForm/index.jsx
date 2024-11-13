import React, { useState } from 'react';
import styles from './style.module.css';

const SummaryForm = ({ data, onChange }) => {
  const [summaryText, setSummaryText] = useState(data.text);

  // Handle input change and update state
  const handleInputChange = (e) => {
    const newText = e.target.value;
    setSummaryText(newText);
    onChange({ ...data, text: newText });  // Update parent component
  };

  const handleSave = () => {
    const newData = { ...data, text: summaryText };
    localStorage.setItem('resumeSummary', JSON.stringify(newData)); // Save updated data
    console.log("Changes saved:", newData);
  };

  return (
    <div className={styles.formContainer}>
      <h3>{data.subheadline}</h3>
      <textarea
        value={summaryText}
        onChange={handleInputChange}
        className={styles.textarea}
        placeholder="Enter summary here..."
      />
      <button onClick={handleSave} className={styles.saveButton}>
        Save Changes
      </button>
    </div>
  );
};

export default SummaryForm;
