import React from 'react';
import styles from '../../workspace.module.css';

interface LocationSectionProps {
  title: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function LocationSection({
  title,
  address,
  coordinates
}: LocationSectionProps) {
  return (
    <div className={styles.locationSection}>
      <h2 className={styles.sectionTitle}>Location</h2>
      <div className={styles.mapContainer}>
        <img 
          src={`/api/placeholder/1200/400`} 
          alt="Map location" 
          className={styles.mapPlaceholder} 
        />
        <div className={styles.mapCard}>
          <h3 className={styles.mapCardTitle}>{title}</h3>
          <p className={styles.mapCardAddress}>
            {address.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < address.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          <p className={styles.mapCardCoordinates}>
            Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  );
}