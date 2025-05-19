import React from 'react';
import "./aboutstyles/SkillCard.css";

interface SkillCardProps {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ name, role, image, bio }) => {
  return (
    <div className="skill-card">
      <img src={image} alt={name} className="skill-image" />
      <div className="skill-content">
        <h3 className="skill-name">{name}</h3>
        <p className="skill-role">{role}</p>
        <p className="skill-bio">{bio}</p>
      </div>
    </div>
  );
};

export default SkillCard;