// app/components/workspaces/MapWorkspaceDetail.tsx - CLEAN VERSION
import React, { useEffect, useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import styles from './workspace.module.css';
import GoogleMap from '../Common/GoogleMap';
import Loading from '../Common/Loading';
import BackButton from '../Common/BackButton';
import ContactModal from '../Common/ContactModal';
import PhotoGalleryModal from '../Common/PhotoGalleryModal';
import mapsService, { Location } from '../../services/mapsService';
import workspaceService from '../../services/workspaceService';
import favoritesService from '../../services/favoritesService';
import shareService from '../../services/shareService';
import BookingCard from './$workspaceId/components/BookingCard';

interface WorkspaceDetails {
  id: string;
  name: string;
  address: string;
  coordinates: Location;
  photos: string[];
  rating?: number;
  types: string[];
  website?: string;
  phoneNumber?: string;
  openingHours?: string[];
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
}

interface SimilarWorkspace {
  id: string;
  name: string;
  type: string;
  address: string;
  coordinates: Location;
  distance?: string;
  amenities: string[];
  photos?: string[];
  price?: string;
  rating?: number;
}

const MapWorkspaceDetail: React.FC = () => {
  const { placeId } = useParams({ strict: false });
  const [workspace, setWorkspace] = useState<WorkspaceDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [similarWorkspaces, setSimilarWorkspaces] = useState<SimilarWorkspace[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // New state for modals and interactions
  const [contactModalOpen, setContactModalOpen] = useState<boolean>(false);
  const [photoGalleryOpen, setPhotoGalleryOpen] = useState<boolean>(false);
  const [photoGalleryIndex, setPhotoGalleryIndex] = useState<number>(0);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false);
  const [shareLoading, setShareLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Helper function to get workspace type
  const getWorkspaceType = (types: string[]): string => {
    if (types.includes('library')) return 'Library';
    if (types.includes('cafe')) return 'Café';
    if (types.includes('restaurant')) return 'Restaurant';
    if (types.includes('book_store')) return 'Bookstore';
    if (types.includes('establishment') && types.includes('point_of_interest')) return 'Co-working Space';
    return 'Workspace';
  };

  // Helper function to get workspace price based on types
  const getWorkspacePrice = (types: string[]): string => {
    if (types.includes('library') || types.includes('university')) {
      return 'Free';
    }
    if (types.includes('cafe') || types.includes('restaurant') || types.includes('book_store')) {
      return 'Purchase Recommended';
    }
    if (types.includes('establishment')) {
      return 'Contact for Pricing';
    }
    return 'Free';
  };

  // Format date from timestamp
  const formatDate = (timestamp: number): string => new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get photo URL
  const getPhotoUrl = (photoReference: string, maxWidth = 400): string => mapsService.getPhotoUrl(photoReference, maxWidth);

  // Check if workspace is favorited
  const checkFavoriteStatus = async (workspaceId: string) => {
    try {
      const favoriteStatus = await favoritesService.isFavorited(workspaceId);
      setIsFavorited(favoriteStatus);
    } catch (err) {
      console.error('Error checking favorite status:', err);
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!workspace) return;

    setFavoriteLoading(true);
    try {
      const favoriteData = {
        workspaceName: workspace.name,
        workspaceAddress: workspace.address,
        workspaceType: getWorkspaceType(workspace.types),
        workspacePhoto: workspace.photos.length > 0 ? getPhotoUrl(workspace.photos[0]) : undefined,
        coordinates: workspace.coordinates,
        rating: workspace.rating,
        price: getWorkspacePrice(workspace.types),
      };

      const result = await favoritesService.toggleFavorite(workspace.id, favoriteData);
      setIsFavorited(result.isFavorited);
      showNotification(result.message);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      showNotification('Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Handle share
  const handleShare = async () => {
    if (!workspace) return;

    setShareLoading(true);
    try {
      const shareData = shareService.formatWorkspaceShareData(
        workspace.id,
        workspace.name,
        getWorkspaceType(workspace.types),
        workspace.address,
      );

      const result = await shareService.shareWorkspace(shareData);

      if (result.success) {
        if (result.method === 'clipboard') {
          showNotification('Link copied to clipboard!');
        } else {
          showNotification('Shared successfully!');
        }
      }
    } catch (err) {
      console.error('Error sharing:', err);
      showNotification('Failed to share workspace');
    } finally {
      setShareLoading(false);
    }
  };

  // Show notification
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle photo gallery
  const handleViewAllPhotos = () => {
    setPhotoGalleryIndex(0);
    setPhotoGalleryOpen(true);
  };

  const handlePhotoClick = (index: number) => {
    setPhotoGalleryIndex(index);
    setPhotoGalleryOpen(true);
  };

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const key = await mapsService.getApiKey();
        console.log('API key retrieved successfully');
        setApiKey(key);
        return key;
      } catch (err) {
        console.error('Failed to get API key:', err);
        setError('Failed to load Maps API key');
        return '';
      }
    };

    const fetchPlaceDetails = async () => {
      if (!placeId) {
        setError('No place ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const key = await fetchApiKey();
        if (!key) return;

        console.log('Fetching place details for ID:', placeId);

        const placeDetails = await mapsService.getPlaceDetails(
          placeId,
          'name,formatted_address,geometry,photos,rating,types,website,formatted_phone_number,opening_hours,reviews',
        );

        console.log('Place details retrieved:', placeDetails.name);

        const workspaceData: WorkspaceDetails = {
          id: placeId,
          name: placeDetails.name,
          address: placeDetails.formatted_address,
          coordinates: {
            lat: placeDetails.geometry.location.lat,
            lng: placeDetails.geometry.location.lng,
          },
          photos: placeDetails.photos
            ? placeDetails.photos.map((photo) => photo.photo_reference)
            : [],
          rating: placeDetails.rating,
          types: placeDetails.types,
          website: placeDetails.website,
          phoneNumber: placeDetails.formatted_phone_number,
          openingHours: placeDetails.opening_hours?.weekday_text,
          reviews: placeDetails.reviews,
        };

        setWorkspace(workspaceData);

        await checkFavoriteStatus(placeId);

        if (workspaceData) {
          try {
            const similar = await workspaceService.getSimilarWorkspaces(
              workspaceData.id,
              getWorkspaceType(workspaceData.types),
              workspaceData.coordinates,
            );
            setSimilarWorkspaces(similar);
          } catch (err) {
            console.error('Error fetching similar workspaces:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching place details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load workspace details');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [placeId]);

  if (loading) {
    return <Loading message="Loading workspace details..." />;
  }

  if (error) {
    return (
      <div className={styles.workspaceContainer}>
        <BackButton />
        <div className={styles.errorMessage}>
          <h2>Error Loading Workspace</h2>
          <p>{error}</p>
          <Link to="/search" className={`${styles.btn} ${styles.primaryButton}`}>
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className={styles.workspaceContainer}>
        <BackButton />
        <div className={styles.errorMessage}>
          <h2>Workspace Not Found</h2>
          <p>The workspace you're looking for doesn't exist or couldn't be loaded.</p>
          <Link to="/search" className={`${styles.btn} ${styles.primaryButton}`}>
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  // Prepare photos data for gallery
  const galleryPhotos = workspace.photos.map((photoRef, index) => ({
    url: getPhotoUrl(photoRef, 800),
    alt: `${workspace.name} - Photo ${index + 1}`,
  }));

  return (
    <div className={styles.workspaceContainer}>
      <BackButton />

      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#10B981',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        >
          {notification}
        </div>
      )}

      <div className={styles.workspaceHeader}>
        <div className={styles.workspaceTitle}>
          <h1>{workspace.name}</h1>
          <div className={styles.workspaceSubtitle}>
            <span>{getWorkspaceType(workspace.types)}</span>
            <span>•</span>
            <span>{workspace.address.split(',')[0]}</span>
            {workspace.rating && (
              <div className={styles.rating}>
                <div className={styles.ratingStars}>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={i < Math.floor(workspace.rating ?? 0) ? '#4A6FDC' : 'none'}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        stroke="#4A6FDC"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ))}
                </div>
                <span className={styles.ratingNumber}>{workspace.rating.toFixed(1)}</span>
                {workspace.reviews && (
                  <a href="#reviews" className={styles.reviewsCount}>
                    (
                    {workspace.reviews.length}
                    {' '}
                    reviews)
                  </a>
                )}
              </div>
            )}
          </div>
          <div className={styles.workspaceMeta}>
            <div className={styles.workspaceMetaItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{workspace.address}</span>
            </div>
            {workspace.openingHours && workspace.openingHours.length > 0 && (
              <div className={styles.workspaceMetaItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>
                  Hours:
                  {workspace.openingHours[0].split(': ')[1]}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.workspaceActions}>
          <button
            className={`${styles.actionButton} ${styles.favorite} ${isFavorited ? styles.favorited : ''}`}
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
          >
            {favoriteLoading ? (
              <div style={{ width: '18px', height: '18px' }}>
                <Loading message="" />
              </div>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93792 22.4518 9.22252 22.4518 8.5C22.4518 7.77748 22.3095 7.06208 22.0329 6.39464C21.7563 5.7272 21.351 5.12076 20.84 4.61Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {isFavorited ? 'Favorited' : 'Favorite'}
          </button>
          <button
            className={`${styles.actionButton} ${styles.share}`}
            onClick={handleShare}
            disabled={shareLoading}
          >
            {shareLoading ? (
              <div style={{ width: '18px', height: '18px' }}>
                <Loading message="" />
              </div>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.59 13.51L15.42 17.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            Share
          </button>
        </div>
      </div>

      <div className={styles.workspaceGallery}>
        <div className={`${styles.galleryItem} ${styles.galleryMain}`}>
          {apiKey ? (
            <GoogleMap
              apiKey={apiKey}
              center={workspace.coordinates}
              zoom={15}
              markerTitle={workspace.name}
              address={workspace.address}
              height="100%"
              width="100%"
            />
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
            }}
            >
              <p>Map loading failed</p>
            </div>
          )}
        </div>
        <div className={styles.galleryItem} onClick={() => handlePhotoClick(0)}>
          <img
            src={workspace.photos && workspace.photos.length > 0
              ? getPhotoUrl(workspace.photos[0])
              : `${import.meta.env.VITE_API_BASE_URL}/placeholder/400/200?text=${encodeURIComponent(workspace.name)}`}
            alt={workspace.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `${import.meta.env.VITE_API_BASE_URL}/placeholder/400/200?text=${encodeURIComponent(workspace.name)}`;
            }}
          />
        </div>
        <div className={styles.galleryItem} onClick={() => handlePhotoClick(1)}>
          <img
            src={workspace.photos && workspace.photos.length > 1
              ? getPhotoUrl(workspace.photos[1])
              : `${import.meta.env.VITE_API_BASE_URL}/placeholder/400/200?text=Interior`}
            alt={`${workspace.name} Interior`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `${import.meta.env.VITE_API_BASE_URL}/placeholder/400/200?text=Interior`;
            }}
          />
          {workspace.photos.length > 2 && (
            <button
              className={styles.viewAllPhotos}
              onClick={(e) => {
                e.stopPropagation();
                handleViewAllPhotos();
              }}
            >
              View all photos
            </button>
          )}
        </div>
      </div>

      <div className={styles.workspaceContent}>
        <div className={styles.workspaceDetails}>
          <div className={styles.tabs}>
            <div
              className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </div>
            <div
              className={`${styles.tab} ${activeTab === 'reviews' ? styles.active : ''}`}
              onClick={() => setActiveTab('reviews')}
              id="reviews"
            >
              Reviews
            </div>
            <div
              className={`${styles.tab} ${activeTab === 'location' ? styles.active : ''}`}
              onClick={() => setActiveTab('location')}
            >
              Location
            </div>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <>
                <div className={styles.tabSection}>
                  <h2 className={styles.sectionTitle}>About this space</h2>
                  <p className={styles.sectionContent}>
                    {workspace.name}
                    {' '}
                    is a
                    {getWorkspaceType(workspace.types).toLowerCase()}
                    {' '}
                    located in
                    {workspace.address.split(',')[1]}
                    .
                    This workspace offers a comfortable environment for work and study, and is an excellent choice for focused productivity.
                  </p>
                </div>

                {workspace.openingHours && workspace.openingHours.length > 0 && (
                  <div className={styles.tabSection}>
                    <h2 className={styles.sectionTitle}>Hours of Operation</h2>
                    <div className={styles.hoursContainer}>
                      {workspace.openingHours.map((day, index) => (
                        <div key={index} className={styles.hourRow}>
                          <span className={styles.dayName}>
                            {day.split(': ')[0]}
                            :
                          </span>
                          <span className={styles.dayHours}>{day.split(': ')[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.tabSection}>
                  <h2 className={styles.sectionTitle}>Amenities</h2>
                  <div className={styles.amenitiesList}>
                    <div className={styles.amenityItem}>
                      <svg className={styles.amenityIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12.55C9.97 16.84 14.03 16.84 19 12.55" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 9C8.67 14.56 15.33 14.56 22 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.53 16.11C10.05 17.1 11.95 17.1 13.47 16.11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Wi-Fi</span>
                    </div>
                    {getWorkspaceType(workspace.types) === 'Café' && (
                      <div className={styles.amenityItem}>
                        <svg className={styles.amenityIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 8H19C20.1046 8 21 8.89543 21 10V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V10C3 8.89543 3.89543 8 5 8H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M13 5V8M17 5V8M7 5V8M11 5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M7 3V5M12 3V5M17 3V5M4 5C4 3.89543 4.89543 3 6 3H18C19.1046 3 20 3.89543 20 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Coffee & Refreshments</span>
                      </div>
                    )}
                    <div className={styles.amenityItem}>
                      <svg className={styles.amenityIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.59 13.51L15.42 17.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Power Outlets</span>
                    </div>
                    {getWorkspaceType(workspace.types) === 'Library' && (
                      <div className={styles.amenityItem}>
                        <svg className={styles.amenityIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 8H19C20.1046 8 21 8.89543 21 10V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V10C3 8.89543 3.89543 8 5 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M18 8H6C4.89543 8 4 7.10457 4 6V4C4.00006 2.89543 4.89549 2 6.00006 2H18C19.1046 2 20 2.89543 20 4V6C20 7.10457 19.1046 8 18 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Study Rooms</span>
                      </div>
                    )}
                    <div className={styles.amenityItem}>
                      <svg className={styles.amenityIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 6V10C1 10.6 1.4 11 2 11H6C6.6 11 7 10.6 7 10V6C7 5.4 6.6 5 6 5H2C1.4 5 1 5.4 1 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17 6V10C17 10.6 17.4 11 18 11H22C22.6 11 23 10.6 23 10V6C23 5.4 22.6 5 22 5H18C17.4 5 17 5.4 17 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 6V10C9 10.6 9.4 11 10 11H14C14.6 11 15 10.6 15 10V6C15 5.4 14.6 5 14 5H10C9.4 5 9 5.4 9 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1 14V18C1 18.6 1.4 19 2 19H6C6.6 19 7 18.6 7 18V14C7 13.4 6.6 13 6 13H2C1.4 13 1 13.4 1 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 14V18C9 18.6 9.4 19 10 19H14C14.6 19 15 18.6 15 18V14C15 13.4 14.6 13 14 13H10C9.4 13 9 13.4 9 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17 14V18C17 18.6 17.4 19 18 19H22C22.6 19 23 18.6 23 18V14C23 13.4 22.6 13 22 13H18C17.4 13 17 13.4 17 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>Quiet Environment</span>
                    </div>
                  </div>
                </div>

                {workspace.website && (
                  <div className={styles.tabSection}>
                    <h2 className={styles.sectionTitle}>Additional Information</h2>
                    <div className={styles.additionalInfoItem}>
                      <span className={styles.infoLabel}>Website:</span>
                      <a href={workspace.website} target="_blank" rel="noopener noreferrer" className={styles.infoValue}>
                        {workspace.website}
                      </a>
                    </div>
                    {workspace.phoneNumber && (
                      <div className={styles.additionalInfoItem}>
                        <span className={styles.infoLabel}>Phone:</span>
                        <span className={styles.infoValue}>{workspace.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {activeTab === 'reviews' && workspace.reviews && workspace.reviews.length > 0 && (
              <div className={styles.tabSection}>
                <h2 className={styles.sectionTitle}>Reviews</h2>
                <div className={styles.reviewStats}>
                  <div className={styles.overallRating}>
                    <div className={styles.ratingBig}>{workspace.rating?.toFixed(1)}</div>
                    <div className={styles.ratingStarsBig}>
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill={i < Math.floor(workspace.rating || 0) ? '#4A6FDC' : 'none'}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                            stroke="#4A6FDC"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ))}
                    </div>
                    <div className={styles.ratingCount}>
                      {workspace.reviews.length}
                      {' '}
                      reviews
                    </div>
                  </div>
                </div>

                <div className={styles.reviewsList}>
                  {workspace.reviews.map((review, index) => (
                    <div key={index} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewer}>
                          <div className={styles.reviewerAvatar}>
                            {review.author_name.charAt(0)}
                          </div>
                          <div className={styles.reviewerInfo}>
                            <div className={styles.reviewerName}>{review.author_name}</div>
                            <div className={styles.reviewDate}>{formatDate(review.time)}</div>
                          </div>
                        </div>
                        <div className={styles.reviewRating}>
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill={i < Math.floor(review.rating) ? '#4A6FDC' : 'none'}
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                stroke="#4A6FDC"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className={styles.reviewContent}>
                        <p>{review.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div className={styles.tabSection}>
                <h2 className={styles.sectionTitle}>Location</h2>
                <p className={styles.sectionContent}>
                  {workspace.name}
                  {' '}
                  is located at
                  {workspace.address}
                  .
                </p>
                {apiKey && (
                  <div className={styles.locationMapContainer} style={{ height: '400px', marginTop: '20px' }}>
                    <GoogleMap
                      apiKey={apiKey}
                      center={workspace.coordinates}
                      zoom={15}
                      markerTitle={workspace.name}
                      address={workspace.address}
                      height="100%"
                      width="100%"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <BookingCard
          workspaceId={workspace.id}
          workspaceName={workspace.name}
          workspaceAddress={workspace.address}
          workspaceType={getWorkspaceType(workspace.types)}
          workspacePhoto={workspace.photos && workspace.photos.length > 0 ? getPhotoUrl(workspace.photos[0]) : undefined}
          price={getWorkspacePrice(workspace.types)}
          priceDescription={getWorkspacePrice(workspace.types) === 'Free' ? '' : ''}
          rating={workspace.rating || 4.5}
          reviewCount={workspace.reviews ? workspace.reviews.length : 0}
          onContactHost={() => setContactModalOpen(true)}
        />
      </div>

      <div className={styles.similarWorkspaces}>
        <h2 className={styles.similarTitle}>Similar Workspaces Nearby</h2>
        <div className={styles.workspaceCards}>
          {similarWorkspaces.length > 0 ? (
            similarWorkspaces.map((similar, index) => (
              <div key={index} className={styles.workspaceCard}>
                <div className={styles.cardImage}>
                  <Link to="/workspaces/map/$placeId" params={{ placeId: similar.id }}>
                    <img
                      src={similar.photos && similar.photos.length > 0
                        ? getPhotoUrl(similar.photos[0])
                        : `${import.meta.env.VITE_API_BASE_URL}/placeholder/400/250?text=${encodeURIComponent(similar.name)}`}
                      alt={similar.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `${import.meta.env.VITE_API_BASE_URL}/placeholder/400/250?text=${encodeURIComponent(similar.name)}`;
                      }}
                    />
                  </Link>
                  <div className={styles.cardFavorite}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93792 22.4518 9.22252 22.4518 8.5C22.4518 7.77748 22.3095 7.06208 22.0329 6.39464C21.7563 5.7272 21.351 5.12076 20.84 4.61Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <Link to="/workspaces/map/$placeId" params={{ placeId: similar.id }} className={styles.cardTitle}>
                    {similar.name}
                  </Link>
                  <p className={styles.cardLocation}>
                    {similar.distance ? similar.distance : 'Nearby'}
                    {' '}
                    •
                    {similar.address.split(',')[0]}
                  </p>
                  <div className={styles.cardAmenities}>
                    <span className={styles.cardAmenity}>{similar.type}</span>
                    {similar.amenities.slice(0, 1).map((amenity, idx) => (
                      <span key={idx} className={styles.cardAmenity}>{amenity}</span>
                    ))}
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.cardPrice}>{similar.price}</div>
                    <div className={styles.cardRating}>
                      {similar.rating ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#4A6FDC" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#4A6FDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {similar.rating.toFixed(1)}
                        </>
                      ) : (
                        'No rating'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={styles.workspaceCard}>
                <div className={styles.cardImage}>
                  <Link to="/search">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/placeholder/400/250?text=Similar+Workspace`}
                      alt="Similar Workspace"
                    />
                  </Link>
                  <div className={styles.cardFavorite}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93792 22.4518 9.22252 22.4518 8.5C22.4518 7.77748 22.3095 7.06208 22.0329 6.39464C21.7563 5.7272 21.351 5.12076 20.84 4.61Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <Link to="/search" className={styles.cardTitle}>
                    {getWorkspaceType(workspace.types)}
                  </Link>
                  <p className={styles.cardLocation}>
                    Nearby Location
                  </p>
                  <div className={styles.cardAmenities}>
                    <span className={styles.cardAmenity}>{getWorkspaceType(workspace.types)}</span>
                    <span className={styles.cardAmenity}>Wi-Fi</span>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.cardPrice}>
                      {getWorkspacePrice(workspace.types)}
                    </div>
                    <div className={styles.cardRating}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#4A6FDC" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#4A6FDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      4.5
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        workspaceName={workspace.name}
        website={workspace.website}
        phoneNumber={workspace.phoneNumber}
        address={workspace.address}
      />

      <PhotoGalleryModal
        isOpen={photoGalleryOpen}
        onClose={() => setPhotoGalleryOpen(false)}
        photos={galleryPhotos}
        initialIndex={photoGalleryIndex}
        workspaceName={workspace.name}
      />
    </div>
  );
};

export default MapWorkspaceDetail;
