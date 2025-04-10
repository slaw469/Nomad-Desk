import React, { ReactNode } from 'react';
import "./aboutstyles/ValueCard.css";

interface ValueCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description }) => {
  return (
    <div className="value-card">
      <div className="value-card-icon-container">
        {icon}
      </div>
      <h3 className="value-card-title">{title}</h3>
      <p className="value-card-description">{description}</p>
    </div>
  );
};

export default ValueCard;