import  { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import styles from './workspace.module.css';

interface Workspace {
  id: string;
  title: string;
  type: string;
  distance: string;
  amenities: string[];
  price: string;
  rating: number;
  photo: string;
}

export default function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    const fetchWorkspaces = async () => {
      setLoading(true);
      try {
        // Mock data
        const mockWorkspaces: Workspace[] = [
          {
            id: '1',
            title: 'Central Library Workspace',
            type: 'Library',
            distance: '2.1 miles away',
            amenities: ['Free Wi-Fi', 'Quiet Zone'],
            price: 'Free',
            rating: 4.98,
            photo: '/api/placeholder/400/250'
          },
          {
            id: '2',
            title: 'University Library',
            type: 'Library',
            distance: '3.5 miles away',
            amenities: ['Free Wi-Fi', 'Group Rooms'],
            price: 'Free',
            rating: 4.9,
            photo: '/api/placeholder/400/250'
          },
          {
            id: '3',
            title: 'Downtown Café',
            type: 'Café',
            distance: '0.8 miles away',
            amenities: ['Great Coffee', 'Wi-Fi'],
            price: '$5/hr min',
            rating: 4.7,
            photo: '/api/placeholder/400/250'
          },
          {
            id: '4',
            title: 'Innovation Hub',
            type: 'Co-working',
            distance: '1.2 miles away',
            amenities: ['Meeting Rooms', 'High-Speed Wi-Fi'],
            price: '$15/hr',
            rating: 4.9,
            photo: '/api/placeholder/400/250'
          },
          {
            id: '5',
            title: 'Community Center',
            type: 'Community',
            distance: '2.5 miles away',
            amenities: ['Free Wi-Fi', 'Quiet'],
            price: 'Free',
            rating: 4.6,
            photo: '/api/placeholder/400/250'
          }
        ];
        
        setWorkspaces(mockWorkspaces);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkspaces();
  }, []);
  
  const filteredWorkspaces = filter === 'all' 
    ? workspaces 
    : workspaces.filter(workspace => workspace.type.toLowerCase() === filter);
  
  return (
    <div className={styles.workspaceListContainer}>
      <div className={styles.workspaceListHeader}>
        <h1>Find Your Perfect Workspace</h1>
        <p>Discover quiet, comfortable spaces to focus and be productive.</p>
        
        <div className={styles.workspaceFilters}>
          <button 
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`${styles.filterButton} ${filter === 'library' ? styles.active : ''}`}
            onClick={() => setFilter('library')}
          >
            Libraries
          </button>
          <button 
            className={`${styles.filterButton} ${filter === 'café' ? styles.active : ''}`}
            onClick={() => setFilter('café')}
          >
            Cafés
          </button>
          <button 
            className={`${styles.filterButton} ${filter === 'co-working' ? styles.active : ''}`}
            onClick={() => setFilter('co-working')}
          >
            Co-working Spaces
          </button>
          <button 
            className={`${styles.filterButton} ${filter === 'community' ? styles.active : ''}`}
            onClick={() => setFilter('community')}
          >
            Community Centers
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className={styles.loadingIndicator}>Loading workspaces...</div>
      ) : (
        <div className={styles.workspaceGrid}>
          {filteredWorkspaces.map(workspace => (
            <div key={workspace.id} className={styles.workspaceCard}>
              <div className={styles.cardImage}>
                <Link to="/workspaces/$workspaceId" params={{ workspaceId: workspace.id }}>
                  <img src={workspace.photo} alt={workspace.title} />
                </Link>
                <div className={styles.cardFavorite}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93792 22.4518 9.22252 22.4518 8.5C22.4518 7.77748 22.3095 7.06208 22.0329 6.39464C21.7563 5.7272 21.351 5.12076 20.84 4.61Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className={styles.cardContent}>
                <Link to="/workspaces/$workspaceId" params={{ workspaceId: workspace.id }} className={styles.cardTitle}>
                  {workspace.title}
                </Link>
                <p className={styles.cardLocation}>{workspace.distance}</p>
                <div className={styles.cardAmenities}>
                  {workspace.amenities.map((amenity, index) => (
                    <span key={index} className={styles.cardAmenity}>{amenity}</span>
                  ))}
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.cardPrice}>{workspace.price}</div>
                  <div className={styles.cardRating}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#4A6FDC" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#4A6FDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {workspace.rating.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}