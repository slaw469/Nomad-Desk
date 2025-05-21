// app/components/workspaces/$workspaceId/components/LocationSection.tsx
import React, { useEffect, useState } from 'react';
import styles from '../../workspace.module.css';
import GoogleMap from '../../../Common/GoogleMap';
import mapsService from '../../../../services/mapsService';

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
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch API key on component mount
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const key = await mapsService.getApiKey();
        setApiKey(key);
      } catch (err) {
        console.error('Failed to load Google Maps API key:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  return (
    <div className={styles.locationSection}>
      <h2 className={styles.sectionTitle}>Location</h2>
      <div className={styles.mapContainer}>
        {loading ? (
          <div style={{ 
            height: '400px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            borderRadius: '12px'
          }}>
            <p>Loading map...</p>
          </div>
        ) : apiKey ? (
          <GoogleMap 
            apiKey={apiKey}
            center={coordinates}
            markerTitle={title}
            address={address}
            height="400px"
            width="100%"
          />
        ) : (
          <div style={{ 
            height: '400px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            borderRadius: '12px'
          }}>
            <p>Unable to load map</p>
          </div>
        )}
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