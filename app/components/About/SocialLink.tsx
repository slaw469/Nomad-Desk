import React, { ReactNode } from 'react';
import './aboutstyles/SocialLink.css';

interface SocialLinkProps {
  icon: ReactNode;
}

const SocialLink: React.FC<SocialLinkProps> = ({ icon }) => (
  <a
    href="#"
    className="social-link"
  >
    {icon}
  </a>
);

export default SocialLink;
