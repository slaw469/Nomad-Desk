// app/components/network/Network.tsx
import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from "../../../contexts/AuthContext";
import styles from './sidebarstyles/network.module.css';

// Icons

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
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

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// Interface for connection
interface Connection {
  id: string;
  name: string;
  profession: string;
  location: string;
  imageUrl: string;
  mutualConnections: number;
  status: 'connected' | 'pending' | 'suggestion';
  lastActive?: string;
  interests?: string[];
}

const Network: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'requests' | 'suggestions'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  
  // Filter options
  const allInterests = ['Design', 'Development', 'Marketing', 'Business', 'Education', 'Remote Work', 'Productivity', 'Writing', 'Entrepreneurship'];
  const allProfessions = ['UX Designer', 'Software Engineer', 'Product Manager', 'Marketing Specialist', 'Content Writer', 'Data Scientist', 'Educator', 'Entrepreneur'];
  
  // Load mock connections data
  useEffect(() => {
    // This would typically be an API call
    const mockConnections: Connection[] = [
      {
        id: '1',
        name: 'Alex Johnson',
        profession: 'Software Engineer',
        location: 'San Francisco, CA',
        imageUrl: '/api/placeholder/80/80',
        mutualConnections: 3,
        status: 'connected',
        lastActive: '2 days ago',
        interests: ['Development', 'Remote Work']
      },
      {
        id: '2',
        name: 'Sara Williams',
        profession: 'Content Writer',
        location: 'New York, NY',
        imageUrl: '/api/placeholder/80/80',
        mutualConnections: 5,
        status: 'connected',
        lastActive: '5 hours ago',
        interests: ['Writing', 'Remote Work']
      },
      {
        id: '3',
        name: 'Taylor Chen',
        profession: 'Marketing Specialist',
        location: 'Chicago, IL',
        imageUrl: '/api/placeholder/80/80',
        mutualConnections: 2,
        status: 'pending',
        interests: ['Marketing', 'Business']
      },
      {
        id: '4',
        name: 'Jordan Smith',
        profession: 'UX Designer',
        location: 'Austin, TX',
        imageUrl: '/api/placeholder/80/80',
        mutualConnections: 4,
        status: 'pending',
        interests: ['Design', 'Productivity']
      },
      {
        id: '5',
        name: 'Morgan Davis',
        profession: 'Product Manager',
        location: 'Seattle, WA',
        imageUrl: '/api/placeholder/80/80',
        mutualConnections: 6,
        status: 'suggestion',
        interests: ['Business', 'Productivity']
      },
      {
        id: '6',
        name: 'Jamie Wilson',
        profession: 'Data Scientist',
        location: 'Boston, MA',
        imageUrl: '/api/placeholder/80/80',
        mutualConnections: 3,
        status: 'suggestion',
        interests: ['Development', 'Education']
      },
      {
        id: '7',
        name: 'Riley Cooper',
        profession: 'Educator',
        location: 'Portland, OR',
        imageUrl: '/api/placeholder/80/80',
        mutualConnections: 1,
        status: 'suggestion',
        interests: ['Education', 'Remote Work']
      },
      {
        id: '8',
        name: 'Casey Turner',
        profession: 'Entrepreneur',
        location: 'Miami, FL',
        imageUrl: '/api/placeholder/80/80',
        mutualConnections: 2,
        status: 'suggestion',
        interests: ['Entrepreneurship', 'Business']
      }
    ];
    
    setConnections(mockConnections);
  }, []);

  // Filter connections based on active tab, search query, and filters
  const filteredConnections = connections
    .filter(connection => {
      // Filter by tab
      if (activeTab === 'requests' && connection.status !== 'pending') {
        return false;
      }
      if (activeTab === 'suggestions' && connection.status !== 'suggestion') {
        return false;
      }
      if (activeTab === 'all' && connection.status === 'suggestion') {
        return false;
      }
      
      // Filter by search query
      if (searchQuery && !connection.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !connection.profession.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by selected interests
      if (selectedInterests.length > 0 && 
          !connection.interests?.some(interest => selectedInterests.includes(interest))) {
        return false;
      }
      
      // Filter by selected professions
      if (selectedProfessions.length > 0 && 
          !selectedProfessions.includes(connection.profession)) {
        return false;
      }
      
      return true;
    });

  // Accept a connection request
  const acceptRequest = (id: string) => {
    setConnections(connections.map(connection => 
      connection.id === id ? { ...connection, status: 'connected' } : connection
    ));
  };

  // Reject a connection request
  const rejectRequest = (id: string) => {
    setConnections(connections.filter(connection => connection.id !== id));
  };

  // Remove a connection
  const removeConnection = (id: string) => {
    setConnections(connections.filter(connection => connection.id !== id));
  };

  // Send a connection request
  const sendRequest = (id: string) => {
    // In a real app, this would send a request to the backend
    alert(`Connection request sent to ${connections.find(c => c.id === id)?.name}`);
    setConnections(connections.filter(connection => connection.id !== id));
  };

  // Toggle interest filter
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // Toggle profession filter
  const toggleProfession = (profession: string) => {
    if (selectedProfessions.includes(profession)) {
      setSelectedProfessions(selectedProfessions.filter(p => p !== profession));
    } else {
      setSelectedProfessions([...selectedProfessions, profession]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedInterests([]);
    setSelectedProfessions([]);
    setSearchQuery('');
  };

  // Get counts
  const getConnectionCount = (status?: 'connected' | 'pending' | 'suggestion') => {
    if (!status) {
      return connections.filter(c => c.status !== 'suggestion').length;
    }
    return connections.filter(c => c.status === status).length;
  };

  return (
    <div className={styles.networkContainer}>
      <div className={styles.networkHeader}>
        <div className={styles.headerTop}>
          <h1 className={styles.networkTitle}>My Network</h1>
          <div className={styles.headerActions}>
            <div className={styles.searchContainer}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button 
                  className={styles.clearSearchButton}
                  onClick={() => setSearchQuery('')}
                >
                  <CloseIcon />
                </button>
              )}
            </div>
            <button 
              className={`${styles.filterButton} ${showFilters ? styles.activeFilter : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon />
              <span>Filters</span>
              {(selectedInterests.length > 0 || selectedProfessions.length > 0) && (
                <span className={styles.filterCount}>
                  {selectedInterests.length + selectedProfessions.length}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className={styles.filtersPanel}>
            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Interests</h3>
              <div className={styles.filterOptions}>
                {allInterests.map(interest => (
                  <button
                    key={interest}
                    className={`${styles.filterOption} ${selectedInterests.includes(interest) ? styles.selectedFilter : ''}`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            
            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Profession</h3>
              <div className={styles.filterOptions}>
                {allProfessions.map(profession => (
                  <button
                    key={profession}
                    className={`${styles.filterOption} ${selectedProfessions.includes(profession) ? styles.selectedFilter : ''}`}
                    onClick={() => toggleProfession(profession)}
                  >
                    {profession}
                  </button>
                ))}
              </div>
            </div>
            
            <div className={styles.filterActions}>
              <button 
                className={styles.clearFiltersButton}
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
        
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('all')}
          >
            My Connections
            <span className={styles.tabCount}>{getConnectionCount('connected')}</span>
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'requests' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Pending Requests
            <span className={styles.tabCount}>{getConnectionCount('pending')}</span>
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'suggestions' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('suggestions')}
          >
            Suggestions
            <span className={styles.tabCount}>{getConnectionCount('suggestion')}</span>
          </button>
        </div>
      </div>
      
      <div className={styles.networkContent}>
        {filteredConnections.length > 0 ? (
          <div className={styles.connectionsList}>
            {filteredConnections.map(connection => (
              <div key={connection.id} className={styles.connectionCard}>
                <div className={styles.connectionAvatar}>
                  <img src={connection.imageUrl} alt={connection.name} />
                </div>
                <div className={styles.connectionInfo}>
                  <h3 className={styles.connectionName}>{connection.name}</h3>
                  <p className={styles.connectionProfession}>{connection.profession}</p>
                  <p className={styles.connectionLocation}>{connection.location}</p>
                  
                  {connection.interests && (
                    <div className={styles.connectionInterests}>
                      {connection.interests.map((interest, index) => (
                        <span key={index} className={styles.interestTag}>{interest}</span>
                      ))}
                    </div>
                  )}
                  
                  <p className={styles.connectionMutual}>
                    <span className={styles.mutualCount}>{connection.mutualConnections}</span> mutual connections
                  </p>
                  
                  {connection.lastActive && (
                    <p className={styles.lastActive}>Last active: {connection.lastActive}</p>
                  )}
                </div>
                <div className={styles.connectionActions}>
                  {connection.status === 'connected' && (
                    <>
                      <Link to={`/messages/${connection.id}`} className={styles.messageButton}>
                        <MessageIcon />
                        <span>Message</span>
                      </Link>
                      <button
                        className={styles.scheduleButton}
                        onClick={() => {
                          // Navigate to schedule page or open modal in a real app
                          alert(`Schedule session with ${connection.name}`);
                        }}
                      >
                        <CalendarIcon />
                        <span>Schedule</span>
                      </button>
                      <button
                        className={styles.removeButton}
                        onClick={() => removeConnection(connection.id)}
                      >
                        <span>Remove</span>
                      </button>
                    </>
                  )}
                  
                  {connection.status === 'pending' && (
                    <>
                      <button
                        className={styles.acceptButton}
                        onClick={() => acceptRequest(connection.id)}
                      >
                        <CheckIcon />
                        <span>Accept</span>
                      </button>
                      <button
                        className={styles.ignoreButton}
                        onClick={() => rejectRequest(connection.id)}
                      >
                        <CloseIcon />
                        <span>Ignore</span>
                      </button>
                    </>
                  )}
                  
                  {connection.status === 'suggestion' && (
                    <button
                      className={styles.connectButton}
                      onClick={() => sendRequest(connection.id)}
                    >
                      <PlusIcon />
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <UserIcon />
            </div>
            <h2 className={styles.emptyStateTitle}>
              {searchQuery || selectedInterests.length > 0 || selectedProfessions.length > 0
                ? 'No connections match your filters'
                : activeTab === 'requests'
                  ? 'No pending connection requests'
                  : activeTab === 'suggestions'
                    ? 'No connection suggestions right now'
                    : 'No connections yet'}
            </h2>
            <p className={styles.emptyStateMessage}>
              {searchQuery || selectedInterests.length > 0 || selectedProfessions.length > 0
                ? 'Try adjusting your search criteria or filters'
                : activeTab === 'requests'
                  ? 'When you receive connection requests, they will appear here'
                  : activeTab === 'suggestions'
                    ? 'Check back later for new connection suggestions'
                    : 'Start building your network by connecting with other users'}
            </p>
            {(searchQuery || selectedInterests.length > 0 || selectedProfessions.length > 0) && (
              <button
                className={styles.resetButton}
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
            {activeTab === 'all' && getConnectionCount() === 0 && (
              <button
                className={styles.findPeopleButton}
                onClick={() => setActiveTab('suggestions')}
              >
                Find People to Connect With
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Network;