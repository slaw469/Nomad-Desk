import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Story from './Story';
import Values from './Values';
import Stats from './Stats';
import Skills from './Skills';
import Faq from './Faq';
import Contact from './Contact';
import Footer from './Footer';

const NomadDeskAbout: React.FC = () => (
  <div className="nomad-desk">
    <Header />
    <Hero />
    <Story />
    <Values />
    <Stats />
    <Skills />
    <Faq />
    <Contact />
    <Footer />
  </div>
);

export default NomadDeskAbout;
