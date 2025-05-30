// app/components/Favorites/Favorites.tsx
import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import styles from './Favorites.module.css';
import Loading from '../Common/Loading';
import favoritesService, { type Favorite } from '../../services/favoritesService';

const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="M19,6V20a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [removingFavorites, setRemovingFavorites] = useState<Set<string>>(new Set());

  // Fetch favorites on component mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const favoritesData = await favoritesService.getFavorites();
      setFavorites(favoritesData);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  // Handle removing a favorite
  const handleRemoveFavorite = async (workspaceId: string) => {
    try {
      setRemovingFavorites(prev => new Set(prev).add(workspaceId));
      await favoritesService.removeFavorite(workspaceId);
      // Remove from local state
      setFavorites(prev => prev.filter(fav => fav.workspace.id !== workspaceId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Failed to remove favorite. Please try again.');
    } finally {
      setRemovingFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(workspaceId);
        return newSet;
      });
    }
  };

  // Get photo URL for workspace
  const getPhotoUrl = (photoReference?: string): string => {
    if (!photoReference) {
      return 'http://localhost:5001/api/placeholder/400/250?text=Workspace';
    }
    return photoReference;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter favorites by type
  const filteredFavorites = favorites.filter(favorite => {
    if (filterType === 'all') return true;
    return favorite.workspace.type.toLowerCase().includes(filterType.toLowerCase());
  });

  // Sort favorites
  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name':
        return a.workspace.name.localeCompare(b.workspace.name);
      case 'rating':
        return (b.workspace.rating || 0) - (a.workspace.rating || 0);
      default:
        return 0;
    }
  });

  // Get unique workspace types for filter
  const workspaceTypes = Array.from(new Set(favorites.map(fav => fav.workspace.type)));

  if (loading) {
    return <Loading message="Loading your favorites..." fullScreen={true} />;
  }

  return (
    <div className={styles.favoritesContainer}>
      {/* Navigation Header */}
      <div className={styles.favoritesNavigation}>
        <Link to="/dashboard" className={styles.backButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Dashboard
        </Link>
        
        <div className={styles.breadcrumb}>
          <Link to="/dashboard" className={styles.breadcrumbLink}>Dashboard</Link>
          <span className={styles.breadcrumbSeparator}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className={styles.breadcrumbCurrent}>My Favorites</span>
        </div>
      </div>

      {/* Header */}
      <div className={styles.favoritesHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <BookmarkIcon />
          </div>
          <div className={styles.headerText}>
            <h1>My Favorite Workspaces</h1>
            <p>Your saved workspaces for quick access and future bookings</p>
          </div>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{favorites.length}</span>
            <span className={styles.statLabel}>Total Favorites</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{workspaceTypes.length}</span>
            <span className={styles.statLabel}>Types Saved</span>
          </div>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={fetchFavorites} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      )}

      {favorites.length > 0 && (
        <>
          {/* Controls */}
          <div className={styles.favoritesControls}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Filter by Type:</label>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Types ({favorites.length})</option>
                {workspaceTypes.map(type => {
                  const count = favorites.filter(fav => fav.workspace.type === type).length;
                  return (
                    <option key={type} value={type.toLowerCase()}>
                      {type} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className={styles.sortGroup}>
              <label className={styles.sortLabel}>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Favorites Grid */}
          <div className={styles.favoritesGrid}>
            {sortedFavorites.map(favorite => (
              <div key={favorite.id} className={styles.favoriteCard}>
                <div className={styles.favoriteImage}>
                  <Link to="/workspaces/map/$placeId" params={{ placeId: favorite.workspace.id }}>
                    <img 
                      src={getPhotoUrl(favorite.workspace.photo)} 
                      alt={favorite.workspace.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'http://localhost:5001/api/placeholder/400/250?text=Workspace';
                      }}
                    />
                  </Link>
                  <button 
                    className={styles.removeButton}
                    onClick={() => handleRemoveFavorite(favorite.workspace.id)}
                    disabled={removingFavorites.has(favorite.workspace.id)}
                    title="Remove from favorites"
                  >
                    {removingFavorites.has(favorite.workspace.id) ? (
                      <div className={styles.removeButtonSpinner}>
                        <Loading message="" />
                      </div>
                    ) : (
                      <TrashIcon />
                    )}
                  </button>
                </div>
                <div className={styles.favoriteContent}>
                  <div className={styles.favoriteHeader}>
                    <Link to="/workspaces/map/$placeId" params={{ placeId: favorite.workspace.id }} className={styles.favoriteTitle}>
                      {favorite.workspace.name}
                    </Link>
                    {favorite.workspace.rating && (
                      <div className={styles.favoriteRating}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#4A6FDC" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#4A6FDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{favorite.workspace.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.favoriteInfo}>
                    <div className={styles.favoriteType}>
                      <span className={styles.typeTag}>{favorite.workspace.type}</span>
                      <span className={styles.priceTag}>{favorite.workspace.price}</span>
                    </div>
                    
                    <div className={styles.favoriteLocation}>
                      <MapPinIcon />
                      <span>{favorite.workspace.address.split(',')[0]}</span>
                    </div>
                    
                    <div className={styles.favoriteMeta}>
                      <CalendarIcon />
                      <span>Saved {formatDate(favorite.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className={styles.favoriteActions}>
                    <Link 
                      to="/workspaces/map/$placeId" 
                      params={{ placeId: favorite.workspace.id }} 
                      className={styles.viewButton}
                    >
                      View Details
                    </Link>
                    <Link 
                      to="/workspaces/map/$placeId" 
                      params={{ placeId: favorite.workspace.id }} 
                      className={styles.bookButton}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {favorites.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <BookmarkIcon />
          </div>
          <h2 className={styles.emptyStateTitle}>No Favorite Workspaces Yet</h2>
          <p className={styles.emptyStateMessage}>
            Start exploring workspaces and save your favorites for quick access. When you find a workspace you love, 
            click the heart icon to add it to your favorites.
          </p>
          <div className={styles.emptyStateActions}>
            <Link to="/search" className={styles.discoverButton}>
              Discover Workspaces
            </Link>
            <Link to="/dashboard" className={styles.dashboardButton}>
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;