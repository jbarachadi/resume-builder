import React from 'react';
import styles from './style.module.css';

const Resume = ({ data }) => {
  return (
    <div id="container">
      <div id="profile">
        {/* <div id="image">
          <img id="profile-photo" src={data.profile.photo} alt="Profile-Image" />
          <a href="#"><i className={`fas fa-pen ${styles.strokeTransparent}`}></i></a>
        </div> */}
        {/* <p id="name">{data.profile.name}<br /><span id="email">{data.profile.email}</span></p> */}
        {/* <p id="designation">{data.profile.designation}<br /><span id="college">{data.profile.college}</span></p> */}
        {/* <div id="social-links">
          {data.profile.socialLinks.map((link, index) => (
            <a key={index} href={link.url}>
              <i className={`fab fa-${link.platform} ${styles.strokeTransparent}`}></i>
            </a>
          ))}
        </div> */}
        <a id="edit-intro" href="#"><i className="fas fa-pen-alt blue"></i>&nbsp;&nbsp;Edit Intro</a>
        <hr width="100%" />
        <div id="about">
          <p style={{ display: 'inline' }}>About</p>
          <a href="#"><i className={`fas fa-pen ${styles.strokeTransparentBlue}`}></i></a>
        </div>
        {/* <p id="year-graduation">Expected Year of Graduation<br /><strong>{data.profile.yearOfGraduation}</strong></p> */}
        {/* <p id="education">Education<br /><strong>{data.education}</strong></p> */}
        {/* <p id="more-about">More about me<br /><span>{data.profile.moreAbout}</span></p> */}
        {/* <p id="telephone">Telephone<br /><strong>{data.profile.telephone}</strong></p> */}
        {/* <p id="fax">Fax<br /><strong>{data.profile.fax}</strong></p> */}
      </div>

      <div id="info-cards">
        {data.experience.positions.map((work, index) => (
          <div className={styles.card} key={index}>
            <p><i className="fas fa-briefcase"></i>&nbsp;&nbsp;&nbsp;{work.job_title}</p>
            <a href="#">+ Add work experience</a>
          </div>
        ))}
        {/* {data.workshops.map((workshop, index) => (
          <div className={styles.card} key={index}>
            <p><i className="fas fa-briefcase"></i>&nbsp;&nbsp;&nbsp;Workshop</p>
            <ul>
              {workshop.items.map((item, idx) => (
                <li key={idx}>
                  <p className={styles.tags}>
                    {item.title}<br /><span>{item.location} | <span>{item.duration}</span></span>
                  </p>
                  <a className="edit" href="#"><i className={`fas fa-pen ${styles.strokeTransparentBlue}`}></i></a>
                </li>
              ))}
            </ul>
            <a href="#">+ Add workshops attended</a>
          </div>
        ))} */}
        {data.education.details.map((edu, index) => (
          <div className={styles.card} key={index}>
            <p><i className="fas fa-graduation-cap"></i>&nbsp;&nbsp;&nbsp;Education</p>
            <ul>
              <li>
                <p className={styles.tags}>{edu.institution}<br /><span>{edu.degree} | <span>{edu.year}</span></span></p>
                <a className="edit" href="#"><i className={`fas fa-pen ${styles.strokeTransparentBlue}`}></i></a>
              </li>
            </ul>
            <a href="#">+ Add new</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resume;
