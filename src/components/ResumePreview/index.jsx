import React from 'react';
import styles from './style.module.css';
import Template1 from '../../templates/Template1';
import Template2 from '../../templates/Template2';
import Template3 from '../../templates/Template3';

const ResumePreview = ({ template, data }) => (
  <div className={styles.resumePreview}>
    {template === 'Template1' && <Template1 data={data} />}
    {template === 'Template2' && <Template2 data={data} />}
    {template === 'Template3' && <Template3 data={data} />}
  </div>
);

export default ResumePreview;
