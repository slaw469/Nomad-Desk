// app/components/Common/ContactModal.tsx
import React from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceName: string;
  website?: string;
  phoneNumber?: string;
  address: string;
}

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  workspaceName,
  website,
  phoneNumber,
  address
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleWebsiteClick = () => {
    if (website) {
      window.open(website, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePhoneClick = () => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`);
    }
  };

  const handleDirectionsClick = () => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const modalStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  };

  const contentStyles: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '30px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '80vh',
    overflow: 'auto',
    position: 'relative',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '25px'
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2A3347',
    margin: 0,
    paddingRight: '20px'
  };

  const closeButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#9CA3AF',
    padding: '5px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const contactOptionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    marginBottom: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const contactOptionHoverStyles: React.CSSProperties = {
    ...contactOptionStyles,
    borderColor: '#4A6FDC',
    backgroundColor: '#F8FAFC',
    transform: 'translateY(-1px)'
  };

  const iconStyles: React.CSSProperties = {
    color: '#4A6FDC',
    flexShrink: 0
  };

  const infoStyles: React.CSSProperties = {
    flex: 1
  };

  const labelStyles: React.CSSProperties = {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2A3347',
    marginBottom: '3px'
  };

  const valueStyles: React.CSSProperties = {
    fontSize: '0.9rem',
    color: '#4B5563'
  };

  return (
    <div style={modalStyles} onClick={handleBackdropClick}>
      <div style={contentStyles}>
        <div style={headerStyles}>
          <h2 style={titleStyles}>Contact {workspaceName}</h2>
          <button 
            onClick={onClose} 
            style={closeButtonStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#4B5563';
              e.currentTarget.style.backgroundColor = '#F3F4F6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9CA3AF';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div>
          {website && (
            <div 
              style={contactOptionStyles}
              onClick={handleWebsiteClick}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, contactOptionHoverStyles)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, contactOptionStyles)}
            >
              <div style={iconStyles}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={infoStyles}>
                <div style={labelStyles}>Visit Website</div>
                <div style={valueStyles}>View hours, menu, and more information</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17l9.2-9.2M17 17V7H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          {phoneNumber && (
            <div 
              style={contactOptionStyles}
              onClick={handlePhoneClick}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, contactOptionHoverStyles)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, contactOptionStyles)}
            >
              <div style={iconStyles}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={infoStyles}>
                <div style={labelStyles}>Call</div>
                <div style={valueStyles}>{phoneNumber}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17l9.2-9.2M17 17V7H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          <div 
            style={contactOptionStyles}
            onClick={handleDirectionsClick}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, contactOptionHoverStyles)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, contactOptionStyles)}
          >
            <div style={iconStyles}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={infoStyles}>
              <div style={labelStyles}>Get Directions</div>
              <div style={valueStyles}>Open in Google Maps</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17l9.2-9.2M17 17V7H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#4B5563', lineHeight: '1.5' }}>
              <strong>Note:</strong> We're a discovery platform. Contact the workspace directly for availability, 
              reservations, and specific policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;