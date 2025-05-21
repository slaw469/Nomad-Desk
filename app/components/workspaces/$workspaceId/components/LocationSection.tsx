// app/components/workspaces/$workspaceId/components/LocationSection.tsx
import React from 'react';
import styles from '../../workspace.module.css';
import GoogleMap from '../../../Common/GoogleMap';

interface LocationSectionProps {
  title: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const LocationSection: React.FC<LocationSectionProps> = ({
  title,
  address,
  coordinates
}) => {
  // This should be stored in environment variables in a real application
  // For this example, we'll use a placeholder that you should replace with your actual key
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

  return (
    <div className={styles.locationSection}>
      <h2 className={styles.sectionTitle}>Location</h2>
      <div className={styles.mapContainer}>
        <GoogleMap 
          apiKey={googleMapsApiKey}
          center={coordinates}
          markerTitle={title}
          address={address}
          height="400px"
          width="100%"
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
};

export default LocationSection;