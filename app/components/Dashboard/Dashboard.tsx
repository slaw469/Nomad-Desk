// app/components/dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from './AuthContext';
import styles from './dashboard.module.css';

// Import icons (using the same icons you already have)
const NetworkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

// Import other icons as in your original code...
const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { user, logout } = useAuth();
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  // Your mock data can remain the same as in your original component
  // Mock data for upcoming bookings
  const upcomingBookings = [
    {
      id: '1',
      space: 'Central Library Workspace',
      date: 'Monday, April 15, 2025',
      time: '9:00 AM - 1:00 PM',
      type: 'Study Room',
      imageUrl: '/api/placeholder/300/200'
    },
    {
      id: '2',
      space: 'Downtown Café',
      date: 'Wednesday, April 17, 2025',
      time: '2:00 PM - 5:00 PM',
      type: 'Individual Desk',
      imageUrl: '/api/placeholder/300/200'
    }
  ];

  // Mock data for past bookings
  const pastBookings = [
    {
      id: '3',
      space: 'Innovation Hub Coworking',
      date: 'Monday, April 8, 2025',
      time: '10:00 AM - 4:00 PM',
      type: 'Meeting Room',
      imageUrl: '/api/placeholder/300/200'
    },
    {
      id: '4',
      space: 'Sunny Corner Cafe',
      date: 'Friday, April 5, 2025',
      time: '9:00 AM - 12:00 PM',
      type: 'Individual Desk',
      imageUrl: '/api/placeholder/300/200'
    }
  ];

  // Mock data for favorite spaces
  const favoriteSpaces = [
    {
      id: '5',
      name: 'Central Library Workspace',
      type: 'Library',
      distance: '2.1 miles away',
      rating: 4.98,
      amenities: ['Free Wi-Fi', 'Power Outlets'],
      imageUrl: '/api/placeholder/300/200'
    },
    {
      id: '6',
      name: 'Innovation Hub Coworking',
      type: 'Co-working',
      distance: '1.2 miles away',
      rating: 4.9,
      amenities: ['Meeting Rooms', 'High-Speed Wi-Fi'],
      imageUrl: '/api/placeholder/300/200'
    },
    {
      id: '7',
      name: 'Downtown Café',
      type: 'Café',
      distance: '0.8 miles away',
      rating: 4.7,
      amenities: ['Great Coffee', 'Wi-Fi'],
      imageUrl: '/api/placeholder/300/200'
    }
  ];

  // Define the interface for booking objects
  interface Booking {
    id: string;
    space: string;
    date: string;
    time: string;
    type: string;
    imageUrl: string;
  }

  // Function to render upcoming or past bookings
  const renderBookings = (bookings: Booking[]) => {
    return (
      <div className={styles.bookingsGrid}>
        {bookings.map(booking => (
          <div key={booking.id} className={styles.bookingCard}>
            <div className={styles.bookingImage}>
              <img src={booking.imageUrl} alt={booking.space} />
            </div>
            <div className={styles.bookingContent}>
              <h3 className={styles.bookingTitle}>{booking.space}</h3>
              <div className={styles.bookingDetails}>
                <div className={styles.bookingDetail}>
                  <CalendarIcon />
                  <span>{booking.date}</span>
                </div>
                <div className={styles.bookingDetail}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>{booking.time}</span>
                </div>
                <div className={styles.bookingDetail}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 9h18" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>{booking.type}</span>
                </div>
              </div>
              <div className={styles.bookingActions}>
                {activeTab === 'upcoming' ? (
                  <>
                    <button className={`${styles.actionButton} ${styles.primaryButton}`}>Modify</button>
                    <button className={`${styles.actionButton} ${styles.secondaryButton}`}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className={`${styles.actionButton} ${styles.primaryButton}`}>Book Again</button>
                    <button className={`${styles.actionButton} ${styles.secondaryButton}`}>Review</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleLogout = () => {
    logout();
    // No need to navigate as the logout function will handle it
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardSidebar}>
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>{getUserInitials()}</div>
          <div className={styles.userInfo}>
            <h3 className={styles.userName}>{user?.name || 'User'}</h3>
            <p className={styles.userEmail}>{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        
        <nav className={styles.sidebarNav}>
          <Link to="/dashboard" className={`${styles.sidebarLink} ${styles.active}`}>
            <CalendarIcon />
            <span>My Bookings</span>
          </Link>
          <Link to="/workspaces" className={styles.sidebarLink}>
            <MapPinIcon />
            <span>Find Spaces</span>
          </Link>
          <Link to="/favorites" className={styles.sidebarLink}>
            <BookmarkIcon />
            <span>Favorites</span>
          </Link>
          <Link to="/network" className={styles.sidebarLink}>
        <NetworkIcon />
            <span>My Network</span>
        </Link>
          <Link to="/notifications" className={styles.sidebarLink}>
            <BellIcon />
            <span>Notifications</span>
          </Link>
          <Link to="/profile" className={styles.sidebarLink}>
            <UserIcon />
            <span>Profile</span>
          </Link>
          <Link to="/settings" className={styles.sidebarLink}>
            <SettingsIcon />
            <span>Settings</span>
          </Link>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
      
      <div className={styles.dashboardContent}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>My Dashboard</h1>
          <div className={styles.dashboardActions}>
            <div className={styles.searchBar}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input type="text" placeholder="Search bookings..." />
            </div>
            <button className={styles.notificationButton}>
              <BellIcon />
              <span className={styles.notificationBadge}>3</span>
            </button>
          </div>
        </div>
        
        {/* Booking Summary Cards */}
        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIconWrapper}>
              <CalendarIcon />
            </div>
            <div className={styles.summaryInfo}>
              <h3 className={styles.summaryValue}>2</h3>
              <p className={styles.summaryLabel}>Upcoming Bookings</p>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.summaryIconWrapper}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
                <line x1="10" y1="8" x2="10" y2="11"></line>
                <line x1="6" y1="16" x2="16" y2="16"></line>
                <line x1="3" y1="7" x2="5" y2="7"></line>
                <line x1="3" y1="11" x2="5" y2="11"></line>
                <line x1="12" y1="5" x2="15" y2="5"></line>
                <line x1="12" y1="9" x2="15" y2="9"></line>
              </svg>
            </div>
            <div className={styles.summaryInfo}>
              <h3 className={styles.summaryValue}>15</h3>
              <p className={styles.summaryLabel}>Past Bookings</p>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
  <div className={styles.summaryIconWrapper}>
    <NetworkIcon />
  </div>
  <div className={styles.summaryInfo}>
    <h3 className={styles.summaryValue}>6</h3>
    <p className={styles.summaryLabel}>Connections</p>
  </div>
</div>
          
          <div className={styles.summaryCard}>
            <div className={styles.summaryIconWrapper}>
              <BookmarkIcon />
            </div>
            <div className={styles.summaryInfo}>
              <h3 className={styles.summaryValue}>3</h3>
              <p className={styles.summaryLabel}>Favorite Spaces</p>
            </div>
          </div>
        </div>
        
        {/* Bookings Section with Tabs */}
        <div className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>My Bookings</h2>
            <div className={styles.sectionTabs}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'upcoming' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'past' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('past')}
              >
                Past
              </button>
            </div>
          </div>
          
          {activeTab === 'upcoming' && renderBookings(upcomingBookings)}
          {activeTab === 'past' && renderBookings(pastBookings)}
          
          {upcomingBookings.length === 0 && activeTab === 'upcoming' && (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <CalendarIcon />
              </div>
              <h3 className={styles.emptyStateTitle}>No upcoming bookings</h3>
              <p className={styles.emptyStateMessage}>Time to discover and book your next productive workspace!</p>
              <Link to="/workspaces" className={`${styles.ctaButton} ${styles.primaryButton}`}>Find Spaces</Link>
            </div>
          )}
        </div>
        
        {/* Favorite Spaces Section */}
        <div className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>My Favorite Spaces</h2>
            <Link to="/favorites" className={styles.viewAllLink}>View All</Link>
          </div>
          
          <div className={styles.favoriteSpacesGrid}>
            {favoriteSpaces.map(space => (
              <div key={space.id} className={styles.favoriteSpaceCard}>
                <div className={styles.favoriteSpaceImage}>
                  <img src={space.imageUrl} alt={space.name} />
                  <button className={styles.favoriteButton}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF7E5F" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93792 22.4518 9.22252 22.4518 8.5C22.4518 7.77748 22.3095 7.06208 22.0329 6.39464C21.7563 5.7272 21.351 5.12076 20.84 4.61Z" stroke="#FF7E5F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div className={styles.favoriteSpaceContent}>
                  <div className={styles.favoriteSpaceHeader}>
                    <h3 className={styles.favoriteSpaceName}>{space.name}</h3>
                    <div className={styles.favoriteSpaceRating}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#4A6FDC" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#4A6FDC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{space.rating}</span>
                    </div>
                  </div>
                  <div className={styles.favoriteSpaceInfo}>
                    <div className={styles.favoriteSpaceType}>
                      <span>{space.type}</span>
                      <span className={styles.favoriteSpaceDot}>•</span>
                      <span>{space.distance}</span>
                    </div>
                    <div className={styles.favoriteSpaceAmenities}>
                      {space.amenities.map((amenity, index) => (
                        <span key={index} className={styles.favoriteSpaceAmenity}>{amenity}</span>
                      ))}
                    </div>
                  </div>
                  <Link to={`/workspaces/${space.id}`} className={styles.bookSpaceButton}>Book Now</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recently Viewed Section */}
        <div className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recently Viewed</h2>
          </div>
          
          <div className={styles.recentlyViewedList}>
            <div className={styles.recentlyViewedItem}>
              <img 
                src="/api/placeholder/80/80" 
                alt="University Library" 
                className={styles.recentlyViewedImage} 
              />
              <div className={styles.recentlyViewedInfo}>
                <h4 className={styles.recentlyViewedName}>University Library</h4>
                <p className={styles.recentlyViewedDetail}>Library • 3.5 miles away</p>
              </div>
              <Link to="/workspaces/2" className={styles.recentlyViewedAction}>View</Link>
            </div>
            
            <div className={styles.recentlyViewedItem}>
              <img 
                src="/api/placeholder/80/80" 
                alt="Artisan Coffee Study Hub" 
                className={styles.recentlyViewedImage} 
              />
              <div className={styles.recentlyViewedInfo}>
                <h4 className={styles.recentlyViewedName}>Artisan Coffee Study Hub</h4>
                <p className={styles.recentlyViewedDetail}>Café • 1.2 miles away</p>
              </div>
              <Link to="/workspaces/8" className={styles.recentlyViewedAction}>View</Link>
            </div>
            
            <div className={styles.recentlyViewedItem}>
              <img 
                src="/api/placeholder/80/80" 
                alt="Community Center" 
                className={styles.recentlyViewedImage} 
              />
              <div className={styles.recentlyViewedInfo}>
                <h4 className={styles.recentlyViewedName}>Community Center</h4>
                <p className={styles.recentlyViewedDetail}>Community • 2.5 miles away</p>
              </div>
              <Link to="/workspaces/5" className={styles.recentlyViewedAction}>View</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;