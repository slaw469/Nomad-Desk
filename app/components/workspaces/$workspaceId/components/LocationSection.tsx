import React from 'react';

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
    <div className="location-section">
      <h2 className="section-title">Location</h2>
      <div className="map-container">
        <img 
          src={`/api/placeholder/1200/400`} 
          alt="Map location" 
          className="map-placeholder" 
        />
        <div className="map-card">
          <h3 className="map-card-title">{title}</h3>
          <p className="map-card-address">
            {address.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < address.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          <p className="map-card-coordinates">
            Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  );
}