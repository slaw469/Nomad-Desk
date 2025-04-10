import React from 'react';
import SkillCard from './SkillCard';
import "./aboutstyles/Skills.css";

const Skills: React.FC = () => {
  return (
    <section className="skills">
      <div className="container">
        <div className="skills-header">
          <h2 className="skills-title">Skills & Experience</h2>
          <p className="skills-subtitle">
            As a computer science student passionate about creating practical solutions, I bring a diverse skill set to Nomad Desk.
          </p>
        </div>
        
        <div className="skills-grid">
          <SkillCard 
            name="Web Development"
            role="Front-End Focus"
            image="/api/placeholder/300/300?text=Web+Dev"
            bio="React, JavaScript, HTML/CSS, and responsive design principles to create intuitive and accessible user interfaces."
          />
          <SkillCard 
            name="UI/UX Design"
            role="User-Centered Design"
            image="/api/placeholder/300/300?text=UI/UX"
            bio="Creating seamless user experiences through wireframing, prototyping, and user testing to ensure Nomad Desk is intuitive for everyone."
          />
          <SkillCard 
            name="Database Management"
            role="Data Architecture"
            image="/api/placeholder/300/300?text=Database"
            bio="Building efficient database structures to manage workspace information, user profiles, and booking systems securely."
          />
          <SkillCard 
            name="UT Dallas"
            role="Computer Science Major"
            image="/api/placeholder/300/300?text=UTD"
            bio="Currently pursuing a degree in Computer Science with coursework in algorithms, software engineering, and human-computer interaction."
          />
          <SkillCard 
            name="Hackathon Participant"
            role="Problem Solver"
            image="/api/placeholder/300/300?text=Hackathon"
            bio="Active in the university hackathon community, developing quick solutions to real-world problems under time constraints."
          />
          <SkillCard 
            name="Research Assistant"
            role="Data Analysis"
            image="/api/placeholder/300/300?text=Research"
            bio="Experience analyzing patterns and user behavior to improve digital services and identify key areas for enhancement."
          />
        </div>
      </div>
    </section>
  );
};

export default Skills;