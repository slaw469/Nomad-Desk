// components/SpaceFinderAnimation.tsx
import React, { useState, useEffect } from 'react';
import styles from "../../../styles/spaceFinderAnimation.module.css";

// SVG Icons for the animation
const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const WifiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
    <line x1="12" y1="20" x2="12.01" y2="20"></line>
  </svg>
);

const CoffeeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
    <line x1="6" y1="1" x2="6" y2="4"></line>
    <line x1="10" y1="1" x2="10" y2="4"></line>
    <line x1="14" y1="1" x2="14" y2="4"></line>
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const SpaceFinderAnimation: React.FC = () => {
  const [step, setStep] = useState(0);
  const [hoveredSpace, setHoveredSpace] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prevStep) => (prevStep + 1) % 4);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const spaces = [
    {
      id: 1,
      name: "Sunny Corner Cafe",
      type: "Cafe",
      icon: <CoffeeIcon />,
      colorClass: styles.cafeColor,
      features: ["Fast WiFi", "Coffee", "Casual"]
    },
    {
      id: 2,
      name: "Central Library",
      type: "Library",
      icon: <BookIcon />,
      colorClass: styles.libraryColor,
      features: ["Silent", "Long Hours", "Power Outlets"]
    },
    {
      id: 3,
      name: "The Hub Coworking",
      type: "Coworking",
      icon: <UsersIcon />,
      colorClass: styles.coworkingColor,
      features: ["Meeting Rooms", "24/7 Access", "Community"]
    },
    {
      id: 4,
      name: "Campus Study Center",
      type: "Campus",
      icon: <CalendarIcon />,
      colorClass: styles.campusColor,
      features: ["Bookable Rooms", "Group Tables", "Resources"]
    }
  ];

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Find Your Perfect Space</div>
            <div className={styles.searchContainer}>
              <div className={styles.searchBar}>
                <span className={styles.searchIcon}><MapPinIcon /></span>
                <span className={styles.searchText}>Search location...</span>
              </div>
              <div className={styles.wifiIndicator}>
                <WifiIcon />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Browse Options</div>
            <div className={styles.spaceGrid}>
              {spaces.map(space => (
                <div
                  key={space.id}
                  className={`${styles.spaceCard} ${space.colorClass} ${hoveredSpace === space.id ? styles.spaceCardHovered : ''}`}
                  onMouseEnter={() => setHoveredSpace(space.id)}
                  onMouseLeave={() => setHoveredSpace(null)}
                >
                  <div className={styles.spaceCardContent}>
                    <div className={styles.spaceIcon}>
                      {space.icon}
                    </div>
                    <div className={styles.spaceInfo}>
                      <div className={styles.spaceName}>{space.name}</div>
                      <div className={styles.spaceType}>{space.type}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Select Your Space</div>
            <div className={styles.selectedSpace}>
              <div className={styles.selectedSpaceHeader}>
                <span className={styles.selectedSpaceIcon}><CoffeeIcon /></span>
                <span className={styles.selectedSpaceName}>Sunny Corner Cafe</span>
              </div>
              <div className={styles.selectedSpaceDetails}>
                <div className={styles.availabilityIndicator}>
                  <div className={styles.availabilityDot}></div>
                  <span>Available now</span>
                </div>
                <div className={styles.featureTags}>
                  {["Fast WiFi", "Coffee", "Casual"].map(feature => (
                    <div key={feature} className={styles.featureTag}>
                      {feature}
                    </div>
                  ))}
                </div>
                <button className={styles.bookButton}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>Ready to Work!</div>
            <div className={styles.confirmedSpace}>
              <div className={styles.confirmedIcon}><CoffeeIcon /></div>
              <div className={styles.confirmedInfo}>
                <div className={styles.confirmedName}>Sunny Corner Cafe</div>
                <div className={styles.confirmedStatus}>Your space is confirmed</div>
                <div className={styles.directionsButton}>
                  Get Directions
                </div>
              </div>
              <div className={styles.bookedBadge}>
                Booked
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.stepsIndicator}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`${styles.stepDot} ${step === i ? styles.activeStepDot : ''}`}
            onClick={() => setStep(i)}
          ></div>
        ))}
      </div>
      <div className={styles.animationContainer}>
        {renderStep()}
      </div>
    </div>
  );
};

export default SpaceFinderAnimation;