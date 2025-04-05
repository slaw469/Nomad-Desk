// app/routes/workspaces/$workspaceId/components/WorkspaceGallery.tsx
import React, { useState } from 'react';

interface Photo {
  url: string;
  alt: string;
}

interface WorkspaceGalleryProps {
  photos: Photo[];
}

export default function WorkspaceGallery({ photos }: WorkspaceGalleryProps) {
  const [showModal, setShowModal] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  
  if (!photos || photos.length === 0) {
    return null;
  }
  
  // We'll display at most 3 photos in the grid
  const displayPhotos = photos.slice(0, 3);
  
  const openGalleryModal = (index: number) => {
    setActivePhotoIndex(index);
    setShowModal(true);
  };
  
  const closeGalleryModal = () => {
    setShowModal(false);
  };
  
  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setActivePhotoIndex((prevIndex) => 
        prevIndex === 0 ? photos.length - 1 : prevIndex - 1
      );
    } else {
      setActivePhotoIndex((prevIndex) => 
        prevIndex === photos.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  return (
    <>
      <div className="workspace-gallery">
        <div className="gallery-item gallery-main">
          <img 
            src={displayPhotos[0].url} 
            alt={displayPhotos[0].alt} 
            onClick={() => openGalleryModal(0)}
          />
        </div>
        
        {displayPhotos.length > 1 && (
          <div className="gallery-item">
            <img 
              src={displayPhotos[1].url} 
              alt={displayPhotos[1].alt} 
              onClick={() => openGalleryModal(1)}
            />
          </div>
        )}
        
        {displayPhotos.length > 2 && (
          <div className="gallery-item">
            <img 
              src={displayPhotos[2].url} 
              alt={displayPhotos[2].alt} 
              onClick={() => openGalleryModal(2)}
            />
            
            {photos.length > 3 && (
              <button 
                className="view-all-photos"
                onClick={() => openGalleryModal(0)}
              >
                View all photos
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Photo Gallery Modal */}
      {showModal && (
        <div className="gallery-modal">
          <div className="gallery-modal-content">
            <button className="modal-close" onClick={closeGalleryModal}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="gallery-modal-navigation">
              <button className="nav-button prev" onClick={() => navigatePhoto('prev')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div className="gallery-modal-image">
                <img src={photos[activePhotoIndex].url} alt={photos[activePhotoIndex].alt} />
              </div>
              
              <button className="nav-button next" onClick={() => navigatePhoto('next')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="gallery-modal-count">
              {activePhotoIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}