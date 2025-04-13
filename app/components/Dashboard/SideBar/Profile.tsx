// app/components/profile/Profile.tsx
import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../AuthContext';
import styles from './sidebarstyles/profile.module.css';
import { useNavigate } from '@tanstack/react-router';

// Icons
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

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

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: user?.name || 'User Name',
    email: user?.email || 'user@example.com',
    location: 'San Francisco, CA',
    bio: 'Remote worker passionate about finding productive spaces to work from anywhere.',
    profession: 'UX Designer',
    timezone: 'PST (UTC-8)',
    interests: ['Design', 'Coffee', 'Productivity', 'Remote Work'],
    privateProfile: false
  });

  // Mock data for friends/network
  const [connections, setConnections] = useState([
    {
      id: '1',
      name: 'Alex Johnson',
      profession: 'Software Engineer',
      mutualConnections: 3,
      imageUrl: '/api/placeholder/50/50',
      status: 'connected'
    },
    {
      id: '2',
      name: 'Sara Williams',
      profession: 'Content Writer',
      mutualConnections: 5,
      imageUrl: '/api/placeholder/50/50',
      status: 'connected'
    },
    {
      id: '3',
      name: 'Taylor Chen',
      profession: 'Marketing Specialist',
      mutualConnections: 2,
      imageUrl: '/api/placeholder/50/50',
      status: 'pending'
    }
  ]);

  // Mock data for study sessions
  const [studySessions, setStudySessions] = useState([
    {
      id: '1',
      title: 'UX Research Collaboration',
      date: 'Monday, April 15, 2025',
      time: '2:00 PM - 4:00 PM',
      location: 'Central Library Workspace',
      participants: ['Alex Johnson', 'Sara Williams'],
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Portfolio Review Session',
      date: 'Wednesday, April 17, 2025',
      time: '10:00 AM - 12:00 PM',
      location: 'Downtown Café',
      participants: ['Taylor Chen'],
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Design Systems Workshop',
      date: 'Monday, April 8, 2025',
      time: '1:00 PM - 3:00 PM',
      location: 'Innovation Hub Coworking',
      participants: ['Alex Johnson', 'Jamie Smith'],
      status: 'past'
    }
  ]);

  // Mock data for favorite workspaces
  const [favoriteWorkspaces, setFavoriteWorkspaces] = useState([
    {
      id: '1',
      name: 'Central Library Workspace',
      rating: 4.8,
      visitCount: 12,
      imageUrl: '/api/placeholder/80/80'
    },
    {
      id: '2',
      name: 'Innovation Hub Coworking',
      rating: 4.9,
      visitCount: 8,
      imageUrl: '/api/placeholder/80/80'
    },
    {
      id: '3',
      name: 'Downtown Café',
      rating: 4.7,
      visitCount: 5,
      imageUrl: '/api/placeholder/80/80'
    }
  ]);

  // Toggle editing state
  const toggleEditing = () => {
    if (isEditing) {
      // Here you would normally save the data to your backend
      console.log('Saving profile data:', userProfile);
    }
    setIsEditing(!isEditing);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserProfile({
      ...userProfile,
      [name]: value
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUserProfile({
      ...userProfile,
      [name]: checked
    });
  };

  const getUserInitials = () => {
    if (!userProfile.name) return 'U';
    
    const nameParts = userProfile.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  // Handle connection requests
  const handleConnectionAction = (id: string, action: 'accept' | 'reject' | 'remove') => {
    if (action === 'accept') {
      setConnections(connections.map(conn => 
        conn.id === id ? { ...conn, status: 'connected' } : conn
      ));
    } else if (action === 'reject' || action === 'remove') {
      setConnections(connections.filter(conn => conn.id !== id));
    }
  };

  // Render user information
  const renderUserInfo = () => (
    <div className={styles.profileSection}>
      {isEditing ? (
        <form className={styles.editForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={userProfile.name} 
              onChange={handleInputChange} 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={userProfile.email} 
              onChange={handleInputChange} 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="profession">Profession</label>
            <input 
              type="text" 
              id="profession" 
              name="profession" 
              value={userProfile.profession} 
              onChange={handleInputChange} 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="location">Location</label>
            <input 
              type="text" 
              id="location" 
              name="location" 
              value={userProfile.location} 
              onChange={handleInputChange} 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="timezone">Timezone</label>
            <input 
              type="text" 
              id="timezone" 
              name="timezone" 
              value={userProfile.timezone} 
              onChange={handleInputChange} 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="bio">Bio</label>
            <textarea 
              id="bio" 
              name="bio" 
              value={userProfile.bio} 
              onChange={handleInputChange} 
              rows={4}
            />
          </div>
          <div className={styles.formGroup}>
            <div className={styles.checkboxContainer}>
              <input 
                type="checkbox" 
                id="privateProfile" 
                name="privateProfile" 
                checked={userProfile.privateProfile} 
                onChange={handleCheckboxChange} 
              />
              <label htmlFor="privateProfile">Make my profile private</label>
            </div>
          </div>
        </form>
      ) : (
        <div className={styles.userInfoContainer}>
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>
              <UserIcon />
              <span>Full Name</span>
            </div>
            <div className={styles.infoValue}>{userProfile.name}</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>Email</span>
            </div>
            <div className={styles.infoValue}>{userProfile.email}</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <span>Profession</span>
            </div>
            <div className={styles.infoValue}>{userProfile.profession}</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>
              <LocationIcon />
              <span>Location</span>
            </div>
            <div className={styles.infoValue}>{userProfile.location}</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>
              <ClockIcon />
              <span>Timezone</span>
            </div>
            <div className={styles.infoValue}>{userProfile.timezone}</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Bio</span>
            </div>
            <div className={styles.infoValue}>{userProfile.bio}</div>
          </div>
          <div className={styles.interestsContainer}>
            <h4>Interests</h4>
            <div className={styles.interestsList}>
              {userProfile.interests.map((interest, index) => (
                <span key={index} className={styles.interestTag}>{interest}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render network
  const renderNetwork = () => (
    <div className={styles.profileSection}>
      <div className={styles.connectionStats}>
        <div className={styles.connectionStat}>
          <h4>2</h4>
          <p>Connected</p>
        </div>
        <div className={styles.connectionStat}>
          <h4>1</h4>
          <p>Pending</p>
        </div>
        <div className={styles.connectionStat}>
          <h4>5</h4>
          <p>Study Sessions</p>
        </div>
      </div>
      
      <div className={styles.networkSearch}>
        <input type="text" placeholder="Search connections..." />
        <button className={styles.primaryButton}>Find Connections</button>
      </div>
      
      <div className={styles.connectionSectionHeader}>
        <h3>Your Connections</h3>
      </div>
      
      <div className={styles.connectionsList}>
        {connections.map(connection => (
          <div key={connection.id} className={styles.connectionCard}>
            <div className={styles.connectionAvatar}>
              <img src={connection.imageUrl} alt={connection.name} />
            </div>
            <div className={styles.connectionInfo}>
              <h4>{connection.name}</h4>
              <p>{connection.profession}</p>
              <p className={styles.mutualConnections}>{connection.mutualConnections} mutual connections</p>
            </div>
            <div className={styles.connectionActions}>
              {connection.status === 'connected' ? (
                <>
                  <button className={styles.actionButton}>
                    <MessageIcon />
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.removeButton}`}
                    onClick={() => handleConnectionAction(connection.id, 'remove')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className={`${styles.actionButton} ${styles.acceptButton}`}
                    onClick={() => handleConnectionAction(connection.id, 'accept')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.rejectButton}`}
                    onClick={() => handleConnectionAction(connection.id, 'reject')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.suggestionsSection}>
        <div className={styles.connectionSectionHeader}>
          <h3>Suggested Connections</h3>
        </div>
        <div className={styles.suggestionsList}>
          <div className={styles.connectionCard}>
            <div className={styles.connectionAvatar}>
              <img src="/api/placeholder/50/50" alt="Jamie Smith" />
            </div>
            <div className={styles.connectionInfo}>
              <h4>Jamie Smith</h4>
              <p>Web Developer</p>
              <p className={styles.mutualConnections}>4 mutual connections</p>
            </div>
            <div className={styles.connectionActions}>
              <button className={`${styles.connectionButton} ${styles.primaryButton}`}>
                Connect
              </button>
            </div>
          </div>
          <div className={styles.connectionCard}>
            <div className={styles.connectionAvatar}>
              <img src="/api/placeholder/50/50" alt="Morgan Davis" />
            </div>
            <div className={styles.connectionInfo}>
              <h4>Morgan Davis</h4>
              <p>Product Manager</p>
              <p className={styles.mutualConnections}>2 mutual connections</p>
            </div>
            <div className={styles.connectionActions}>
              <button className={`${styles.connectionButton} ${styles.primaryButton}`}>
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render study sessions
  const renderSessions = () => (
    <div className={styles.profileSection}>
      <div className={styles.sessionsTabs}>
        <button 
          className={`${styles.sessionsTab} ${activeTab === 'upcoming-sessions' ? styles.activeSessionsTab : ''}`}
          onClick={() => setActiveTab('upcoming-sessions')}
        >
          Upcoming Sessions
        </button>
        <button 
          className={`${styles.sessionsTab} ${activeTab === 'past-sessions' ? styles.activeSessionsTab : ''}`}
          onClick={() => setActiveTab('past-sessions')}
        >
          Past Sessions
        </button>
      </div>
      
      <div className={styles.sessionsList}>
        {studySessions
          .filter(session => 
            (activeTab === 'upcoming-sessions' && session.status === 'upcoming') || 
            (activeTab === 'past-sessions' && session.status === 'past')
          )
          .map(session => (
            <div key={session.id} className={styles.sessionCard}>
              <div className={styles.sessionHeader}>
                <h3 className={styles.sessionTitle}>{session.title}</h3>
                {session.status === 'upcoming' && (
                  <span className={styles.sessionStatus}>Upcoming</span>
                )}
              </div>
              <div className={styles.sessionDetails}>
                <div className={styles.sessionDetail}>
                  <CalendarIcon />
                  <span>{session.date}</span>
                </div>
                <div className={styles.sessionDetail}>
                  <ClockIcon />
                  <span>{session.time}</span>
                </div>
                <div className={styles.sessionDetail}>
                  <LocationIcon />
                  <span>{session.location}</span>
                </div>
              </div>
              <div className={styles.sessionParticipants}>
                <h4>Participants</h4>
                <div className={styles.participantsList}>
                  {session.participants.map((participant, index) => (
                    <div key={index} className={styles.participant}>{participant}</div>
                  ))}
                </div>
              </div>
              <div className={styles.sessionActions}>
                {session.status === 'upcoming' ? (
                  <>
                    <button className={`${styles.actionButton} ${styles.primaryButton}`}>Modify</button>
                    <button className={`${styles.actionButton} ${styles.secondaryButton}`}>Cancel</button>
                  </>
                ) : (
                  <button className={`${styles.actionButton} ${styles.primaryButton}`}>View Details</button>
                )}
              </div>
            </div>
          ))}
      </div>
      
      {/* Create New Session Button */}
      <div className={styles.newSessionButtonContainer}>
        <button className={`${styles.newSessionButton} ${styles.primaryButton}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create New Study Session
        </button>
      </div>
    </div>
  );

  // Render workspaces
  const renderWorkspaces = () => (
    <div className={styles.profileSection}>
      <div className={styles.workspaceStats}>
        <div className={styles.workspaceStat}>
          <h4>3</h4>
          <p>Favorite Spaces</p>
        </div>
        <div className={styles.workspaceStat}>
          <h4>25</h4>
          <p>Total Visits</p>
        </div>
        <div className={styles.workspaceStat}>
          <h4>6</h4>
          <p>Reviews Given</p>
        </div>
      </div>
      
      <div className={styles.workspaceHeader}>
        <h3>Favorite Workspaces</h3>
        <Link to="/workspaces" className={styles.viewAllLink}>View All Workspaces</Link>
      </div>
      
      <div className={styles.favoriteWorkspacesList}>
        {favoriteWorkspaces.map(workspace => (
          <div key={workspace.id} className={styles.favoriteWorkspaceCard}>
            <div className={styles.workspaceImageContainer}>
              <img 
                src={workspace.imageUrl} 
                alt={workspace.name} 
                className={styles.workspaceImage} 
              />
            </div>
            <div className={styles.workspaceInfo}>
              <h4 className={styles.workspaceName}>{workspace.name}</h4>
              <div className={styles.workspaceStats}>
                <div className={styles.workspaceRating}>
                  <StarIcon />
                  <span>{workspace.rating}</span>
                </div>
                <div className={styles.workspaceVisits}>
                  <span>{workspace.visitCount} visits</span>
                </div>
              </div>
            </div>
            <Link to={`/workspaces/${workspace.id}`} className={styles.viewWorkspaceButton}>
              View
            </Link>
          </div>
        ))}
      </div>
      
      <div className={styles.workspaceHeader}>
        <h3>Recent Reviews</h3>
      </div>
      
      <div className={styles.reviewsList}>
        <div className={styles.reviewCard}>
          <div className={styles.reviewHeader}>
            <h4>Central Library Workspace</h4>
            <div className={styles.reviewRating}>
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
            </div>
          </div>
          <p className={styles.reviewDate}>April 5, 2025</p>
          <p className={styles.reviewContent}>
            Excellent spot for focused work. The quiet atmosphere and fast Wi-Fi made it perfect for my deadline. Staff was also very helpful.
          </p>
        </div>
        
        <div className={styles.reviewCard}>
          <div className={styles.reviewHeader}>
            <h4>Downtown Café</h4>
            <div className={styles.reviewRating}>
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          </div>
          <p className={styles.reviewDate}>March 28, 2025</p>
          <p className={styles.reviewContent}>
            Great coffee and atmosphere. Gets a bit noisy during lunch hours, but otherwise a solid choice for remote work.
          </p>
        </div>
      </div>
    </div>
  );

  // Determine which content to render based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'network':
        return renderNetwork();
      case 'sessions':
        return renderSessions();
      case 'workspaces':
        return renderWorkspaces();
      case 'upcoming-sessions':
        return renderSessions();
      case 'past-sessions':
        return renderSessions();
      default:
        return renderUserInfo();
    }
  };
  
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileHeaderContent}>
          <div className={styles.profileBanner}>
            {/* Profile banner background */}
            <div className={styles.editBannerButton}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>
          </div>
          
          <div className={styles.profileMainInfo}>
            <div className={styles.profileAvatarContainer}>
              <div className={styles.profileAvatar}>
                {getUserInitials()}
              </div>
              <div className={styles.editAvatarButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
            </div>
            
            <div className={styles.profileInfo}>
              <h1 className={styles.profileName}>{userProfile.name}</h1>
              <p className={styles.profileTitle}>{userProfile.profession}</p>
              <div className={styles.profileLocation}>
                <LocationIcon />
                <span>{userProfile.location}</span>
              </div>
            </div>
            
            <button 
              className={`${styles.editProfileButton} ${isEditing ? styles.saveButton : ''}`}
              onClick={toggleEditing}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
              {!isEditing && <EditIcon />}
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.profileBody}>
        <div className={styles.profileSidebar}>
          <div className={styles.profileNavigation}>
            <button
              className={`${styles.navButton} ${activeTab === 'info' ? styles.activeNavButton : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <UserIcon />
              <span>Personal Info</span>
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'network' ? styles.activeNavButton : ''}`}
              onClick={() => setActiveTab('network')}
            >
              <NetworkIcon />
              <span>Network</span>
            </button>
            <button
              className={`${styles.navButton} ${
                activeTab === 'sessions' || 
                activeTab === 'upcoming-sessions' || 
                activeTab === 'past-sessions' ? 
                styles.activeNavButton : ''
              }`}
              onClick={() => setActiveTab('sessions')}
            >
              <CalendarIcon />
              <span>Study Sessions</span>
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'workspaces' ? styles.activeNavButton : ''}`}
              onClick={() => setActiveTab('workspaces')}
            >
              <BookmarkIcon />
              <span>Workspaces</span>
            </button>
          </div>
          
          <div className={styles.profileStats}>
            <h3>Profile Stats</h3>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Profile Views</span>
              <span className={styles.statValue}>124</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Network</span>
              <span className={styles.statValue}>3</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Study Sessions</span>
              <span className={styles.statValue}>5</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Workspaces Visited</span>
              <span className={styles.statValue}>8</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Reviews</span>
              <span className={styles.statValue}>6</span>
            </div>
          </div>
        </div>
        
        <div className={styles.profileContent}>
          <div className={styles.profileContentHeader}>
            <h2 className={styles.contentTitle}>
              {activeTab === 'info' && 'Personal Information'}
              {activeTab === 'network' && 'My Network'}
              {activeTab === 'sessions' || activeTab === 'upcoming-sessions' || activeTab === 'past-sessions' ? 'Study Sessions' : ''}
              {activeTab === 'workspaces' && 'My Workspaces'}
            </h2>
          </div>
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
export default Profile;