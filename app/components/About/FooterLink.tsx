import React from 'react';
import "./aboutstyles/FooterLink.css";

interface FooterLinkProps {
  text: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ text }) => {
  return (
    <a href="#" className="footer-link">
      {text}
    </a>
  );
};

export default FooterLink;