import React, { ReactNode } from 'react';
import './aboutstyles/StatCard.css';

interface StatCardProps {
  number: string;
  label: string;
  icon: ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, icon }) => (
  <div className="stat-card">
    <div className="stat-icon-container">
      {icon}
    </div>
    <div className="stat-number">{number}</div>
    <div className="stat-label">{label}</div>
  </div>
);

export default StatCard;
