import React from 'react';

const Template2 = ({ data }) => (
  <div style={{ fontFamily: 'Arial, sans-serif' }}>
    <h1>{data.headline}</h1>
    <h2>{data.summary.subheadline}</h2>
    <p>{data.summary.text}</p>
  </div>
);

export default Template2;
