// app/components/Common/PhotoGalleryModal.tsx
import React, { useState, useEffect } from 'react';

interface Photo {
  url: string;
  alt: string;
}

interface PhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  initialIndex?: number;
  workspaceName: string;
}

const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({
  isOpen,
  onClose,
  photos,
  initialIndex = 0,
  workspaceName,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          navigatePrevious();
          break;
        case 'ArrowRight':
          navigateNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex]);

  if (!isOpen || !photos.length) return null;

  const navigateNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
  };

  const navigatePrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const headerStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 30px',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
    zIndex: 1010,
  };

  const titleStyles: React.CSSProperties = {
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: '600',
    margin: 0,
  };

  const closeButtonStyles: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: 'white',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '20px',
  };

  const navigationStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
  };

  const navButtonStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: 'white',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 1010,
  };

  const imageContainerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '80px 120px 120px',
  };

  const imageStyles: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: '8px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
  };

  const footerStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '20px 30px',
    background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const counterStyles: React.CSSProperties = {
    color: 'white',
    fontSize: '1rem',
    fontWeight: '500',
  };

  const thumbnailContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    overflow: 'auto',
    maxWidth: '400px',
    padding: '5px',
  };

  const thumbnailStyles: React.CSSProperties = {
    width: '60px',
    height: '60px',
    borderRadius: '4px',
    objectFit: 'cover',
    cursor: 'pointer',
    opacity: 0.6,
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    flexShrink: 0,
  };

  const activeThumbnailStyles: React.CSSProperties = {
    ...thumbnailStyles,
    opacity: 1,
    border: '2px solid white',
  };

  return (
    <div style={modalStyles} onClick={handleBackdropClick}>
      {/* Header */}
      <div style={headerStyles}>
        <h2 style={titleStyles}>
          {workspaceName}
          {' '}
          Photos
        </h2>
        <button
          onClick={onClose}
          style={closeButtonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Main Image */}
      <div style={navigationStyles}>
        {photos.length > 1 && (
          <button
            onClick={navigatePrevious}
            style={{ ...navButtonStyles, left: '30px' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <div style={imageContainerStyles}>
          <img
            src={photos[activeIndex].url}
            alt={photos[activeIndex].alt}
            style={imageStyles}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'http://localhost:5003/api/placeholder/800/600?text=Image+Not+Available';
            }}
          />
        </div>

        {photos.length > 1 && (
          <button
            onClick={navigateNext}
            style={{ ...navButtonStyles, right: '30px' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Footer */}
      <div style={footerStyles}>
        <div style={counterStyles}>
          {activeIndex + 1}
          {' '}
          of
          {photos.length}
        </div>

        {photos.length > 1 && (
          <div style={thumbnailContainerStyles}>
            {photos.map((photo, index) => (
              <img
                key={index}
                src={photo.url}
                alt={photo.alt}
                style={index === activeIndex ? activeThumbnailStyles : thumbnailStyles}
                onClick={() => setActiveIndex(index)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `http://localhost:5003/api/placeholder/60/60?text=${index + 1}`;
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGalleryModal;
