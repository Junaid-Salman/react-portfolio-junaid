import project1 from "../assets/projects/project-1.jpg";
import project2 from "../assets/projects/project-2.jpg";
import project3 from "../assets/projects/project-3.jpg";
import project4 from "../assets/projects/project-4.jpg";
import project5 from "../assets/projects/project-5.jpg";
import project6 from "../assets/projects/project-6.jpg";

export const HERO_CONTENT = `I am a passionate and dedicated Computer Engineering Graduate with a focus on full-stack development and AI-driven solutions. My experience includes developing robust and scalable web applications using technologies such as the MERN stack and Material-UI, as well as creating advanced machine learning and network security. With hands-on experience in both front-end and back-end development, I aim to leverage my technical skills and innovative mindset to deliver impactful solutions that enhance user experiences and drive business success.`;

export const ABOUT_TEXT = `Hi, I'm Junaid Salman, a passionate and motivated Computer Engineer with a knack for solving complex problems through technology. I have completed my Bachelor's in Computer Engineering from COMSATS University, Lahore, and have developed expertise in AI and Machine Learning, the MERN stack, React.js, and IoT. Throughout my journey, I’ve worked on a variety of projects, from building AI models for demand forecasting to developing machine learning-based Intrusion Detection Systems (IDS) for IoMT networks. I’m always eager to learn and thrive on new challenges. My work is driven by a strong attention to detail and a collaborative approach, ensuring I deliver innovative, reliable solutions that make an impact.`;

export const EXPERIENCES = [
  {
    year: "SEPTEMBER 2023 - NOVEMBER 2023",
    role: "Development Internee",
    company: "9exGen Solutions",
    description: `Developed AI models for demand and sales forecasting using ARIMA, XGBoost, and LSTM. Worked with Material-UI in React, leveraging pre-built components for customization, theming, and accessibility to create modern, responsive user interfaces.`,
    technologies: ["Javascript", "React.js", "Material UI", "Python"],
  },
  {
    year: "JULY 2024 - AUGUST 2024",
    role: "Machine Learning Intern",
    company: "Digital Empowerment Pakistan",
    description: `Designed and developed user interfaces for web applications using Next.js and React. Worked closely with backend developers to integrate frontend components with Node.js APIs. Implemented responsive designs and optimized frontend performance.`,
    technologies: ["Python", "Snort", "Vue.js", "mySQL"],
  },
  {
    year: "JULY 2023 - AUGUST 2023",
    role: "Game Programmer",
    company: "MindStorm Studios' Summer Internship Program",
    description: `Covered fundamental 3D game development skills, including managing GameObjects, Rigidbody, colliders, and using components like AudioSource and Animator. Gained experience with advanced 3D topics like terrain design, Cinemachine, raycasting, animation control, and visual scripting.`,
    technologies: ["Unity 3D", "C#"],
  },
  {
    year: "JULY 2024 - AUGUST 2024",
    role: "Cyber-Security Intern",
    company: "CodeAlpha",
    description: `Developed a Python-based network sniffer to capture and analyze traffic, providing insights into data flow and network packet structures. Also created a network-based IDS using Snort and Suricata, configuring custom rules to detect cyber threats like DDoS and port scans.`,
    technologies: ["Wireshark", "Python", "Snort", "Suricata"],
  },
];

export const PROJECTS = [
  {
    title: "E-Commerce Website",
    image: project1,
    description:
      "A fully functional e-commerce website with features like product listing, shopping cart, and user authentication.",
    technologies: ["HTML", "CSS", "React", "Node.js", "MongoDB"],
  },
  {
    title: "ML based Network Intrusion Detection System",
    image: project2,
    description:
      "This project develops a machine learning-based Intrusion Detection System (IDS) for Internet of Medical Things (IoMT) networks. The IDS monitors network traffic, detects anomalies, and mitigates cyber threats in real-time, ensuring the security and integrity of sensitive medical data.",
    technologies: ["Wireshark", "Python", "Angular", "Firebase"],
  },
  {
    title: "Sales and Demand Forecasting Using Advanced Time Series Forecasting Models",
    image: project3,
    description:
      "Utilization of Advanced Time Series Forecasting Models such as FB Prophet, XGBoost and ARIMA/SARIMA",
    technologies: ["Python", "XGBoost", "", ""],
  },
  {
    title: "Portfolio Website",
    image: project4,
    description:
      "A personal portfolio website showcasing projects, skills, and contact information.",
    technologies: ["React", "Vite", "Framer"],
  },
  {
    title: "Development of Heart Health Data Collection Node ad Disease Prediction using ML model",
    image: project5,
    description:
      "This project creates a heart health monitoring system that collects data from wearable IoMT devices and uses a machine learning model to predict heart diseases. It provides continuous health monitoring and predictive insights to enhance patient care.",
    technologies: ["ESP32", "Python", "Vue.js", "Express", "mySQL"],
  },
  {
    title: "Development and Implementation of Pi-Hole",
    image: project6,
    description:
      "A general purpose networkwide ad-blocker, on a Raspberry Pi to block ads on any device connected to your home network.",
    technologies: ["Raspberry-Pi", "VMware", "Ubuntu OS"],
  },
];

export const CONTACT = {
  address: "Lahore, Paksiatn",
  phoneNo: "+92 3486892824 ",
  email: "junaidsalman380@gmail.com",
};
