import React from 'react';
import {
  Building, MapPin, Users, BookOpen,
} from 'lucide-react';
import StatCard from './StatCard';
import './aboutstyles/Stats.css';

const Stats: React.FC = () => (
  <section className="stats">
    <div className="container">
      <div className="stats-grid">
        <StatCard
          number="100+"
          label="UTD Workspaces"
          icon={<Building size={32} className="stat-icon" />}
        />
        <StatCard
          number="12+"
          label="Campus Buildings"
          icon={<MapPin size={32} className="stat-icon" />}
        />
        <StatCard
          number="500+"
          label="Student Users"
          icon={<Users size={32} className="stat-icon" />}
        />
        <StatCard
          number="2,000+"
          label="Study Sessions"
          icon={<BookOpen size={32} className="stat-icon" />}
        />
      </div>
    </div>
  </section>
);

export default Stats;
