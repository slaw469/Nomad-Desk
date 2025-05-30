import React from 'react';
import { CheckCircle, Users, Globe } from 'lucide-react';
import ValueCard from './ValueCard';
import './aboutstyles/Values.css';

const Values: React.FC = () => (
  <section className="values">
    <div className="container">
      <div className="values-header">
        <h2 className="values-title">My Values</h2>
        <p className="values-subtitle">
          These core principles guide everything I do at Nomad Desk, from the features I develop to how I engage with users.
        </p>
      </div>

      <div className="values-grid">
        <ValueCard
          icon={<CheckCircle size={32} color="white" />}
          title="Quality"
          description="I prioritize quality in every aspect of Nomad Desk, ensuring reliable information and a seamless user experience for students and professionals."
        />
        <ValueCard
          icon={<Users size={32} color="white" />}
          title="Community"
          description="As a student myself, I understand the power of community. Nomad Desk is built to connect like-minded individuals who value productive environments."
        />
        <ValueCard
          icon={<Globe size={32} color="white" />}
          title="Accessibility"
          description="I'm committed to making great workspaces accessible to everyone on campus and beyond, creating a platform that works for all users regardless of needs."
        />
      </div>
    </div>
  </section>
);

export default Values;
