import React from 'react';
import styles from './style.module.css';

const TemplateSelection = ({ onSelectTemplate }) => (
  <div className={styles.templateSelection}>
    <h2>Select a Template</h2>
    <div className={styles.templateImages}>
      <img src={'../assets/logo512.png'} className={styles.templateImage} onClick={() => onSelectTemplate('Template1')} alt="Template 1" />
      <img src={'../assets/logo512.png'} className={styles.templateImage} onClick={() => onSelectTemplate('Template2')} alt="Template 2" />
      <img src={'../assets/logo512.png'} className={styles.templateImage} onClick={() => onSelectTemplate('Template3')} alt="Template 3" />
    </div>
  </div>
);

export default TemplateSelection;
