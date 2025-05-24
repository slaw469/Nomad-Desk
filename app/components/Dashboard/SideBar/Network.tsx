// app/components/Dashboard/SideBar/Network.tsx - FIXED API URL
import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from "../../../contexts/AuthContext";
import BackButton from '../../Common/BackButton';
import styles from './sidebarstyles/network.module.css';

// Icons (keeping your existing icons)
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

// Type for active tab
type ActiveTab = 'all' | 'requests' | 'suggestions' | 'discover';

const Network: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [allUsers, setAllUsers] = useState<Connection[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter options
  const allInterests = ['Design', 'Development', 'Marketing', 'Business', 'Education', 'Remote Work', 'Productivity', 'Writing', 'Entrepreneurship'];
  const allProfessions = ['UX Designer', 'Software Engineer', 'Product Manager', 'Marketing Specialist', 'Content Writer', 'Data Scientist', 'Educator', 'Entrepreneur'];

  // FIXED: Updated API_BASE to match your backend
  const API_BASE = 'http://localhost:5003/api';

  // Load real connection data from APIs
  useEffect(() => {
    const fetchNetworkData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No auth token found');
          setLoading(false);
          return;
        }

        console.log('🔍 Fetching network data from:', API_BASE);

        // Get user's connections
        const connectionsResponse = await fetch(`${API_BASE}/network/connections`, {
          headers: {
            'x-auth-token': token
          }
        });

        if (connectionsResponse.ok) {
          const connectionsData = await connectionsResponse.json();
          console.log('✅ Connections data:', connectionsData);
          
          const formattedConnections = connectionsData.map((conn: any) => ({
            id: conn.id,
            name: conn.user.name,
            profession: conn.user.profession || 'Not specified',
            location: conn.user.location || 'Location not provided',
            imageUrl: conn.user.avatar || '/api/placeholder/80/80',
            mutualConnections: conn.mutualConnections || 0,
            status: 'connected' as const,
            lastActive: conn.updatedAt,
            interests: conn.user.interests || []
          }));
          setConnections(formattedConnections);
        } else {
          console.error('❌ Failed to fetch connections:', connectionsResponse.status, connectionsResponse.statusText);
        }

        // Get pending requests
        const requestsResponse = await fetch(`${API_BASE}/network/requests`, {
          headers: {
            'x-auth-token': token
          }
        });

        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json();
          console.log('✅ Requests data:', requestsData);
          
          const pendingConnections = requestsData.map((req: any) => ({
            id: req.id,
            name: req.sender.name,
            profession: req.sender.profession || 'Not specified',
            location: req.sender.location || 'Location not provided',
            imageUrl: req.sender.avatar || '/api/placeholder/80/80',
            mutualConnections: req.mutualConnections || 0,
            status: 'pending' as const,
            lastActive: req.createdAt,
            interests: req.sender.interests || []
          }));
          
          setConnections(prev => [...prev, ...pendingConnections]);
        } else {
          console.error('❌ Failed to fetch requests:', requestsResponse.status, requestsResponse.statusText);
        }

        // Get suggested connections
        const suggestionsResponse = await fetch(`${API_BASE}/network/suggested`, {
          headers: {
            'x-auth-token': token
          }
        });

        if (suggestionsResponse.ok) {
          const suggestionsData = await suggestionsResponse.json();
          console.log('✅ Suggestions data:', suggestionsData);
          
          const suggestionConnections = suggestionsData.map((sugg: any) => ({
            id: sugg.id,
            name: sugg.user.name,
            profession: sugg.user.profession || 'Not specified',
            location: sugg.user.location || 'Location not provided',
            imageUrl: sugg.user.avatar || '/api/placeholder/80/80',
            mutualConnections: sugg.mutualConnections || 0,
            status: 'suggestion' as const,
            interests: sugg.user.interests || []
          }));
          
          setConnections(prev => [...prev, ...suggestionConnections]);
        } else {
          console.error('❌ Failed to fetch suggestions:', suggestionsResponse.status, suggestionsResponse.statusText);
        }

      } catch (error) {
        console.error('Error fetching network data:', error);
        // Fallback to mock data if API fails
        setConnections([
          {
            id: '1',
            name: 'Backend Server Not Running',
            profession: 'Check Backend Status',
            location: `Expected: ${API_BASE}`,
            imageUrl: '/api/placeholder/80/80',
            mutualConnections: 0,
            status: 'connected',
            interests: ['Backend', 'API', 'Server']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkData();
  }, []);

  // Fetch users for discovery (search all users)
  const searchAllUsers = async (query: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE}/profile/search?q=${encodeURIComponent(query)}&limit=20`, {
        headers: {
          'x-auth-token': token
        }
      });

      if (response.ok) {
        const userData = await response.json();
        const discoveredUsers = userData.map((user: any) => ({
          id: user._id,
          name: user.name,
          profession: user.profession || 'Not specified',
          location: user.location || 'Location not provided', 
          imageUrl: user.avatar || '/api/placeholder/80/80',
          mutualConnections: 0,
          status: 'suggestion' as const,
          interests: user.interests || []
        }));

        setAllUsers(discoveredUsers);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Update search effect to trigger API calls
  useEffect(() => {
    if (activeTab === 'discover' && searchQuery.length > 2) {
      const timeoutId = setTimeout(() => {
        searchAllUsers(searchQuery);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, activeTab]);

  // Filter connections based on active tab, search query, and filters
  const getFilteredConnections = (): Connection[] => {
    let dataToFilter = connections;

    // For discover tab, use all users
    if (activeTab === 'discover') {
      dataToFilter = allUsers.filter((user: Connection) => 
        !connections.some((conn: Connection) => conn.id === user.id) && user.status === 'suggestion'
      );
    }

    return dataToFilter.filter((connection: Connection) => {
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
          !connection.interests?.some((interest: string) => selectedInterests.includes(interest))) {
        return false;
      }

      // Filter by selected professions
      if (selectedProfessions.length > 0 && 
          !selectedProfessions.includes(connection.profession)) {
        return false;
      }

      return true;
    });
  };

  // Accept a connection request
  const acceptRequest = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/network/request/${id}/accept`, {
        method: 'PUT',
        headers: {
          'x-auth-token': token || ''
        }
      });

      if (response.ok) {
        setConnections(connections.map((connection: Connection) => 
          connection.id === id ? { ...connection, status: 'connected' } : connection
        ));
      } else {
        alert('Failed to accept connection request');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Error accepting connection request');
    }
  };

  // Reject a connection request
  const rejectRequest = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/network/request/${id}/reject`, {
        method: 'PUT',
        headers: {
          'x-auth-token': token || ''
        }
      });

      if (response.ok) {
        setConnections(connections.filter((connection: Connection) => connection.id !== id));
      } else {
        alert('Failed to reject connection request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error rejecting connection request');
    }
  };

  // Remove a connection
  const removeConnection = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/network/connection/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token || ''
        }
      });

      if (response.ok) {
        setConnections(connections.filter((connection: Connection) => connection.id !== id));
      } else {
        alert('Failed to remove connection');
      }
    } catch (error) {
      console.error('Error removing connection:', error);
      alert('Error removing connection');
    }
  };

  // Send a connection request
  const sendRequest = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/network/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({ userId: id })
      });

      if (response.ok) {
        const connection = [...connections, ...allUsers].find((c: Connection) => c.id === id);
        if (connection) {
          alert(`Connection request sent to ${connection.name}`);
          // Remove from current view
          setConnections(connections.filter((connection: Connection) => connection.id !== id));
          setAllUsers(allUsers.filter((user: Connection) => user.id !== id));
        }
      } else {
        const errorData = await response.json();
        alert(`Failed to send connection request: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Error sending connection request');
    }
  };

  // Toggle interest filter
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i: string) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // Toggle profession filter
  const toggleProfession = (profession: string) => {
    if (selectedProfessions.includes(profession)) {
      setSelectedProfessions(selectedProfessions.filter((p: string) => p !== profession));
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
  const getConnectionCount = (status?: 'connected' | 'pending' | 'suggestion' | 'discover'): number => {
    if (status === 'discover') {
      return allUsers.filter((user: Connection) => 
        !connections.some((conn: Connection) => conn.id === user.id) && user.status === 'suggestion'
      ).length;
    }
    if (!status) {
      return connections.filter((c: Connection) => c.status !== 'suggestion').length;
    }
    return connections.filter((c: Connection) => c.status === status).length;
  };

  const filteredConnections = getFilteredConnections();

  return (
    <div className={styles.networkContainer}>
      {/* Add Back Button */}
      <BackButton fallbackPath="/dashboard">Back to Dashboard</BackButton>
      
      <div className={styles.networkHeader}>
        <div className={styles.headerTop}>
          <h1 className={styles.networkTitle}>My Network</h1>
          <div className={styles.headerActions}>
            <div className={styles.searchContainer}>
              <SearchIcon />
              <input
                type="text"
                placeholder={activeTab === 'discover' ? 'Search for new people...' : 'Search connections...'}
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
                {allInterests.map((interest: string) => (
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
                {allProfessions.map((profession: string) => (
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
          <button
            className={`${styles.tabButton} ${activeTab === 'discover' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('discover')}
          >
            🔍 Discover People
            <span className={styles.tabCount}>{getConnectionCount('discover')}</span>
          </button>
        </div>
      </div>

      <div className={styles.networkContent}>
        {loading ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <UserIcon />
            </div>
            <h2 className={styles.emptyStateTitle}>Loading network data...</h2>
            <p className={styles.emptyStateMessage}>Please wait while we fetch your connections.</p>
          </div>
        ) : filteredConnections.length > 0 ? (
          <div className={styles.connectionsList}>
            {filteredConnections.map((connection: Connection) => (
              <div key={connection.id} className={styles.connectionCard}>
                <div className={styles.connectionAvatar}>
                  <img src={connection.imageUrl} alt={connection.name} />
                </div>
                <div className={styles.connectionInfo}>
                  <h3 className={styles.connectionName}>{connection.name}</h3>
                  <p className={styles.connectionProfession}>{connection.profession}</p>
                  <p className={styles.connectionLocation}>{connection.location}</p>
                  
                  {connection.interests && connection.interests.length > 0 && (
                    <div className={styles.connectionInterests}>
                      {connection.interests.map((interest: string, index: number) => (
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
                ? 'No users match your filters'
                : activeTab === 'requests'
                  ? 'No pending connection requests'
                  : activeTab === 'suggestions'
                    ? 'No connection suggestions right now'
                    : activeTab === 'discover'
                      ? 'No new people to discover right now'
                      : 'No connections yet'}
            </h2>
            <p className={styles.emptyStateMessage}>
              {searchQuery || selectedInterests.length > 0 || selectedProfessions.length > 0
                ? 'Try adjusting your search criteria or filters'
                : activeTab === 'requests'
                  ? 'When you receive connection requests, they will appear here'
                  : activeTab === 'suggestions'
                    ? 'Check back later for new connection suggestions'
                    : activeTab === 'discover'
                      ? 'Try searching with different keywords or check back later'
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
            {activeTab === 'all' && getConnectionCount('connected') === 0 && (
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