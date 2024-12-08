import React, { useState, useEffect } from 'react';
import Template1 from '../../templates/Template1';
import Template2 from '../../templates/Template2';
import Template3 from '../../templates/Template3';
import { DragDropContext } from "react-beautiful-dnd";
import { Box } from '@mui/material';
import 'font-awesome/css/font-awesome.min.css';
import { useStore } from "../../store"

const Download = () => { 
  const { data, skills, selectedTemplate} = useStore();

  // const data = {
  //   "basics": {
  //     "customFields": [],
  //     "email": "sankpalprajakta1997@gmail.com",
  //     "headline": "Self-motivated, hard-working Electronic and Telecommunication Engineering graduate student with broad foundation in engineering principles.",
  //     "location": "A606, Grande view 7, Phase 4, Ambegaon Bk, Pune - 411046, Pune, India",
  //     "name": "Prajakta Jadhav",
  //     "phone": "(+91) 9028899984",
  //     "picture": {
  //       "url": ""
  //     },
  //     "url": {
  //       "href": "https://www.linkedin.com/in/prajakta-sankpal-1758b821b",
  //       "label": "LinkedIn Profile"
  //     }
  //   },
  //   "sections": {
  //     "awards": {
  //       "items": [
  //         {
  //           "date": "",
  //           "description": "In recognition of outstanding performance of Bharat Nissan Shubha Rambha Contest.",
  //           "issuer": "Bharat Nissan",
  //           "name": "Outstanding Performance Award"
  //         }
  //       ],
  //       "name": "Awards"
  //     },
  //     "certifications": {
  //       "items": [
  //         {
  //           "date": "03/2019",
  //           "description": "",
  //           "issuer": "",
  //           "name": "Short term training of PLC & SCADA",
  //           "url": {
  //             "href": "",
  //             "label": ""
  //           }
  //         },
  //         {
  //           "date": "02/2018",
  //           "description": "",
  //           "issuer": "",
  //           "name": "Workshop of Arduino based Design & Application",
  //           "url": {
  //             "href": "",
  //             "label": ""
  //           }
  //         },
  //         {
  //           "date": "03/2018",
  //           "description": "",
  //           "issuer": "",
  //           "name": "Participation in Micro Controller Master",
  //           "url": {
  //             "href": "",
  //             "label": ""
  //           }
  //         },
  //         {
  //           "date": "02/2016",
  //           "description": "",
  //           "issuer": "",
  //           "name": "Paper presentation on Cloud computing",
  //           "url": {
  //             "href": "",
  //             "label": ""
  //           }
  //         },
  //         {
  //           "date": "02/2015",
  //           "description": "",
  //           "issuer": "",
  //           "name": "Workshop for NRC completed",
  //           "url": {
  //             "href": "",
  //             "label": ""
  //           }
  //         }
  //       ],
  //       "name": "Certifications"
  //     },
  //     "current_skills": {
  //       "items": [
  //         {
  //           "level": 3,
  //           "name": "GT designer 3",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "GX works",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "Multisim",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "Proteous",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "AutoCAD - Electrical",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "Microsoft Word",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "Dev C",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "Keil",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "Circuit Simulation and Design",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "Mitsubishi FX5U Micro Controller",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "Embedded systems",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "C and Embedded C programming",
  //           "visible": true
  //         }
  //       ],
  //       "name": "Current Skills"
  //     },
  //     "education": {
  //       "items": [
  //         {
  //           "area": "Embedded Systems",
  //           "date": "10/2022 \u2013 CURRENT",
  //           "institution": "Techno Scripts Embedded training Institute",
  //           "score": "",
  //           "studyType": "Advance Embedded System",
  //           "summary": "",
  //           "url": {
  //             "href": "",
  //             "label": ""
  //           }
  //         },
  //         {
  //           "area": "Electronics and Telecommunication Engineering",
  //           "date": "09/2016 \u2013 10/2019",
  //           "institution": "Bharti Vidyapith College of Engineering",
  //           "score": "Final grade 69.56%",
  //           "studyType": "B.E.",
  //           "summary": "",
  //           "url": {
  //             "href": "",
  //             "label": ""
  //           }
  //         },
  //         {
  //           "area": "Electronic and Telecommunication Engineering",
  //           "date": "06/2013 \u2013 06/2016",
  //           "institution": "Dr. Bapuji Salunkhe Institute of Engineering, Tech",
  //           "score": "Final grade 70.59%",
  //           "studyType": "Diploma in Engineering",
  //           "summary": "",
  //           "url": {
  //             "href": "",
  //             "label": ""
  //           }
  //         },
  //         {
  //           "area": "",
  //           "date": "06/2012 \u2013 03/2013",
  //           "institution": "Shiye Highschool",
  //           "score": "Final grade 77.09%",
  //           "studyType": "SSC",
  //           "summary": "",
  //           "url": {
  //             "href": "",
  //             "label": ""
  //           }
  //         }
  //       ],
  //       "name": "Education"
  //     },
  //     "experience": {
  //       "items": [
  //         {
  //           "company": "Horizon Packtech",
  //           "date": "03/07/2023 \u2013 CURRENT",
  //           "location": "Pune, India",
  //           "missions": [
  //             "Develop, implement, and maintain PLC programs.",
  //             "Collaborate with engineers to design control systems.",
  //             "Conduct thorough testing and debugging of PLC code.",
  //             "Create comprehensive documentation for PLC systems.",
  //             "Integrate PLC systems with other control systems.",
  //             "Provide ongoing support for installed PLC systems.",
  //             "Conduct training sessions for operators.",
  //             "Ensure compliance with industry standards and safety regulations.",
  //             "Utilize AutoCAD for electrical wiring diagrams."
  //           ],
  //           "position": "PLC Programmer",
  //           "summary": "Develop and maintain PLC programs for packaging machinery. Collaborate on system design and provide ongoing support and training for operators.",
  //           "visible": true
  //         },
  //         {
  //           "company": "Kinetic Communication Ltd.",
  //           "date": "10/04/2023 \u2013 30/06/2023",
  //           "location": "Pune, India",
  //           "missions": [
  //             "Benchmark competitor DC to DC chargers.",
  //             "Develop and test embedded systems for vehicle clusters.",
  //             "Test and debug embedded systems.",
  //             "Perform LCD mapping.",
  //             "Conduct CAN Protocol testing."
  //           ],
  //           "position": "Assistant Engineer Grade 1 in EV Dept.",
  //           "summary": "Conducted benchmarking and program development for embedded systems in electric vehicles. Involved in testing and debugging processes.",
  //           "visible": true
  //         },
  //         {
  //           "company": "Bharat Nissan Automotive",
  //           "date": "01/10/2021 \u2013 28/04/2022",
  //           "location": "",
  //           "missions": [
  //             "Research sales opportunities to exceed goals.",
  //             "Coach sales associates on product specifications and techniques.",
  //             "Achieved recognition for outstanding performance.",
  //             "Performed 5 car bookings in 7 days."
  //           ],
  //           "position": "Sale Consultant",
  //           "summary": "Researched sales opportunities and coached associates to improve customer satisfaction. Achieved significant sales performance recognition.",
  //           "visible": true
  //         }
  //       ],
  //       "name": "Experience"
  //     },
  //     "interests": {
  //       "items": [],
  //       "name": "Interests"
  //     },
  //     "languages": {
  //       "items": [
  //         {
  //           "level": 2,
  //           "name": "MARATHI",
  //           "proficiency": "100%"
  //         },
  //         {
  //           "level": 5,
  //           "name": "ENGLISH",
  //           "proficiency": "100%"
  //         },
  //         {
  //           "level": 4,
  //           "name": "HINDI",
  //           "proficiency": "100%"
  //         }
  //       ],
  //       "name": "Languages"
  //     },
  //     "missing_skills": {
  //       "items": [
  //         {
  //           "description": "",
  //           "level": 3,
  //           "name": "Research Skills",
  //           "visible": true
  //         },
  //         {
  //           "description": "",
  //           "level": 3,
  //           "name": "Communication Skills",
  //           "visible": true
  //         },
  //         {
  //           "description": "",
  //           "level": 3,
  //           "name": "Problem-Solving Skills",
  //           "visible": true
  //         }
  //       ],
  //       "name": "Missing Skills"
  //     },
  //     "profiles": {
  //       "items": [
  //         {
  //           "name": "LinkedIn",
  //           "url": {
  //             "href": "https://www.linkedin.com/in/prajakta-sankpal-1758b821b",
  //             "label": "Prajakta Sankpal"
  //           }
  //         }
  //       ],
  //       "name": "Profiles"
  //     },
  //     "projects": {
  //       "items": [
  //         {
  //           "description": "Developed an ATM machine that can be used for taking out medicine.",
  //           "name": "ATM Machine for Medicine",
  //           "skills": [
  //             "Embedded systems",
  //             "Microcontroller programming"
  //           ]
  //         },
  //         {
  //           "description": "Created an IC tester using a microcontroller.",
  //           "name": "IC Tester",
  //           "skills": [
  //             "Microcontroller programming",
  //             "Embedded systems"
  //           ]
  //         },
  //         {
  //           "description": "Mini project for a Railway Crossing Indicator.",
  //           "name": "Railway Crossing Indicator",
  //           "skills": [
  //             "Embedded systems",
  //             "Circuit design"
  //           ]
  //         }
  //       ],
  //       "name": "Projects"
  //     },
  //     "publications": {
  //       "items": [
  //         {
  //           "date": "02/2016",
  //           "description": "",
  //           "issuer": "",
  //           "name": "Paper presentation on Cloud computing",
  //           "url": {
  //             "href": "",
  //             "label": ""
  //           }
  //         }
  //       ],
  //       "name": "Publications"
  //     },
  //     "references": {
  //       "columns": 1,
  //       "items": [],
  //       "name": "References",
  //       "separateLinks": true,
  //       "visible": true
  //     },
  //     "skills": {
  //       "items": [
  //         {
  //           "level": 3,
  //           "name": "GT designer 3",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "GX works",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "Multisim",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "Proteous",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "AutoCAD - Electrical",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "Microsoft Word",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "Dev C",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "Keil",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "Circuit Simulation and Design",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "Mitsubishi FX5U Micro Controller",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "Embedded systems",
  //           "visible": true
  //         },
  //         {
  //           "level": 3,
  //           "name": "C and Embedded C programming",
  //           "visible": true
  //         },
  //         {
  //           "description": "",
  //           "level": 3,
  //           "name": "Research Skills",
  //           "visible": true
  //         },
  //         {
  //           "description": "",
  //           "level": 3,
  //           "name": "Communication Skills",
  //           "visible": true
  //         },
  //         {
  //           "description": "",
  //           "level": 3,
  //           "name": "Problem-Solving Skills",
  //           "visible": true
  //         }
  //       ],
  //       "name": "Skills"
  //     },
  //     "suggested_missions": {
  //       "items": [
  //         "Conducted in-depth market research to identify potential sales opportunities and leads, exceeding sales goals and increasing profits.",
  //         "Analyzed industry trends and competitor strategies to develop effective sales strategies and product positioning.",
  //         "Effectively communicated project findings and recommendations to clients and team members, ensuring alignment and understanding of proposed solutions.",
  //         "Collaborated with cross-functional teams to integrate PLC systems with other control systems, such as Human-Machine Interfaces (HMIs), ensuring seamless system integration.",
  //         "Formulated and tested hypotheses to troubleshoot PLC code and resolve any issues that arose during testing or operation, ensuring proper functionality of control systems.",
  //         "Identified and resolved technical challenges in embedded system development, ensuring the successful implementation of two and three-wheeler cluster solutions."
  //       ],
  //       "name": "Suggested Missions"
  //     },
  //     "summary": {
  //       "content": "Self-motivated and hard-working Electronic and Telecommunication Engineering graduate with a strong foundation in engineering principles and experience in PLC programming and embedded systems. Demonstrates capability in program development, system design, and technical documentation.",
  //       "name": "Summary",
  //       "visible": true
  //     },
  //     "volunteer": {
  //       "items": [],
  //       "name": "Volunteering"
  //     }
  //   }
  // }

  // const skills = {
  //   list2: data.sections.skills.items.map((skill) => skill.name)
  // }

  const template = selectedTemplate // "Template3"

  const [isVisible, setIsVisible] = useState(true);

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 0);
  };

  useEffect(() => {
    handlePrint();

    const handleAfterPrint = () => {
      setIsVisible(true);
    };

    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);
   
  return (
    <Box sx={{ display: 'flex', flexDirection: "row", gap: 3, bgcolor: 'white' }}>
      <DragDropContext>
        {template === 'Template1' && <Template1 data={data} skills={skills} />}
        {template === 'Template2' && <Template2 data={data} skills={skills} />}
        {template === 'Template3' && <Template3 data={data} skills={skills} />}
      </DragDropContext>
    </Box>
  )
};

export default Download;