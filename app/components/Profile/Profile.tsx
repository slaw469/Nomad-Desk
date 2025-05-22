// app/components/Profile/Profile.tsx
import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from "../../contexts/AuthContext";
import styles from './styles/profile.module.css';
import { profileService, UserProfile, Education } from '../../services/profileService';
import { networkService } from '../../services/networkService';
import { studySessionService, StudySession } from '../../services/bookingService';
import Loading from '../Common/Loading';

// Import icons
import {
  UserIcon,
  NetworkIcon,
  CalendarIcon,
  LocationIcon,
  ClockIcon,
  StarIcon,
  BookmarkIcon,
  EditIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  TagIcon,
  LinkIcon,
  CameraIcon,
  CheckIcon,
  XIcon,
  PlusIcon,
  GlobeIcon,
  SettingsIcon,
  MessageIcon
} from './ProfileIcons';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('info');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formProfile, setFormProfile] = useState<Partial<UserProfile>>({});
  const [connections, setConnections] = useState<any[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [networkStats, setNetworkStats] = useState<{
    totalConnections: number;
    pendingRequests: number;
  }>({ totalConnections: 0, pendingRequests: 0 });
  
  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // For now, create a mock profile based on the authenticated user
        // Replace this with actual API calls when backend is ready
        const mockProfile: UserProfile = {
          id: user?.id || '1',
          name: user?.name || 'Your Name',
          email: user?.email || 'your.email@example.com',
          avatar: user?.avatar,
          bio: 'Remote worker passionate about finding productive spaces to work from anywhere.',
          profession: 'UX Designer',
          location: 'San Francisco, CA',
          timezone: 'PST (UTC-8)',
          interests: ['Design', 'Coffee', 'Productivity', 'Remote Work'],
          education: [
            {
              institution: 'University of California',
              degree: 'Bachelor of Science',
              field: 'Computer Science',
              startYear: 2018,
              endYear: 2022,
              current: false
            }
          ],
          socialLinks: {
            linkedin: '',
            twitter: '',
            github: '',
            website: ''
          },
          preferences: {
            privateProfile: false,
            emailNotifications: true,
            pushNotifications: true
          }
        };
        
        setProfile(mockProfile);
        setFormProfile(mockProfile);
        
        // Mock network stats
        setNetworkStats({
          totalConnections: 3,
          pendingRequests: 1
        });
        
        // Mock connections
        setConnections([
          {
            id: '1',
            user: {
              id: '1',
              name: 'Alex Johnson',
              profession: 'Software Engineer',
              avatar: null
            },
            mutualConnections: 3,
            lastActive: '2 days ago'
          },
          {
            id: '2',
            user: {
              id: '2',
              name: 'Sara Williams',
              profession: 'Content Writer',
              avatar: null
            },
            mutualConnections: 5,
            lastActive: '5 hours ago'
          }
        ]);
        
        // Mock study sessions
        setStudySessions([
          {
            id: '1',
            title: 'UX Research Collaboration',
            description: 'Collaborative session for UX research',
            host: {
              id: user?.id || '1',
              name: user?.name || 'You',
              avatar: user?.avatar
            },
            workspace: {
              id: '1',
              name: 'Central Library Workspace',
              address: '123 Main St, San Francisco, CA',
              photo: ''
            },
            date: '2025-04-15',
            startTime: '14:00',
            endTime: '16:00',
            participants: [
              {
                id: '1',
                name: 'Alex Johnson',
                avatar: '',
                status: 'accepted'
              },
              {
                id: '2',
                name: 'Sara Williams',
                avatar: '', 
                status: 'pending'
              }
            ],
            maxParticipants: 6,
            topics: ['UX Research', 'Design Thinking'],
            status: 'upcoming',
            createdAt: '2025-01-20T10:00:00Z',
            updatedAt: '2025-01-20T10:00:00Z'
          }
        ]);
        
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user]);

  // Toggle editing state
  const toggleEditing = async () => {
    if (isEditing) {
      // Save profile changes
      try {
        setLoading(true);
        // For now, just update local state
        // Replace with actual API call: const updatedProfile = await profileService.updateProfile(formProfile);
        setProfile(prev => ({ ...prev, ...formProfile } as UserProfile));
        setIsEditing(false);
      } catch (err) {
        console.error('Error updating profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    } else {
      // Enter editing mode
      setIsEditing(true);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormProfile({
      ...formProfile,
      [name]: value
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const preferenceName = name.split('.')[1];
      setFormProfile({
        ...formProfile,
        preferences: {
          privateProfile: false,
          emailNotifications: true,
          pushNotifications: true,
          ...formProfile.preferences,
          [preferenceName]: checked
        }
      });
    } else {
      setFormProfile({
        ...formProfile,
        [name]: checked
      });
    }
  };

  // Handle interests changes
  const handleInterestChange = (interest: string) => {
    const currentInterests = formProfile.interests || [];
    
    if (currentInterests.includes(interest)) {
      // Remove interest
      setFormProfile({
        ...formProfile,
        interests: currentInterests.filter(i => i !== interest)
      });
    } else {
      // Add interest
      setFormProfile({
        ...formProfile,
        interests: [...currentInterests, interest]
      });
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!profile?.name) return user?.name?.charAt(0) || 'U';
    
    const nameParts = profile.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  // Handle education add/edit
  const addEducation = () => {
    const currentEducation = formProfile.education || [];
    const newEducation: Education = {
      institution: '',
      degree: '',
      field: '',
      startYear: new Date().getFullYear(),
      current: true
    };
    
    setFormProfile({
      ...formProfile,
      education: [...currentEducation, newEducation]
    });
  };

  const removeEducation = (index: number) => {
    const currentEducation = formProfile.education || [];
    setFormProfile({
      ...formProfile,
      education: currentEducation.filter((_, i) => i !== index)
    });
  };

  const updateEducation = (index: number, field: string, value: string | number | boolean) => {
    const currentEducation = formProfile.education || [];
    const updatedEducation = [...currentEducation];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    
    setFormProfile({
      ...formProfile,
      education: updatedEducation
    });
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    try {
      setLoading(true);
      // For now, create a URL for preview
      // Replace with actual upload: const result = await profileService.uploadAvatar(file);
      const avatarUrl = URL.createObjectURL(file);
      
      setProfile(prev => prev ? { ...prev, avatar: avatarUrl } : null);
      setFormProfile(prev => ({ ...prev, avatar: avatarUrl }));
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  // Format date for study sessions display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && !profile) {
    return <Loading message="Loading profile data..." />;
  }

  // Render user information form
  const renderUserInfoForm = () => (
    <form className={styles.editForm}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Full Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={formProfile.name || ''} 
          onChange={handleInputChange} 
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={formProfile.email || ''} 
          onChange={handleInputChange} 
          disabled
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="profession">Profession</label>
        <input 
          type="text" 
          id="profession" 
          name="profession" 
          value={formProfile.profession || ''} 
          onChange={handleInputChange} 
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="location">Location</label>
        <input 
          type="text" 
          id="location" 
          name="location" 
          value={formProfile.location || ''} 
          onChange={handleInputChange} 
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="timezone">Timezone</label>
        <input 
          type="text" 
          id="timezone" 
          name="timezone" 
          value={formProfile.timezone || ''} 
          onChange={handleInputChange} 
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="bio">Bio</label>
        <textarea 
          id="bio" 
          name="bio" 
          value={formProfile.bio || ''} 
          onChange={handleInputChange} 
          rows={4}
        />
      </div>
      
      <div className={styles.formSection}>
        <h4>Education</h4>
        {(formProfile.education || []).map((edu, idx) => (
          <div key={idx} className={styles.educationEntry}>
            <div className={styles.educationHeader}>
              <h5>Education #{idx + 1}</h5>
              <button 
                type="button" 
                className={styles.removeButton}
                onClick={() => removeEducation(idx)}
              >
                <XIcon />
              </button>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor={`edu-institution-${idx}`}>Institution</label>
              <input 
                type="text" 
                id={`edu-institution-${idx}`}
                value={edu.institution} 
                onChange={(e) => updateEducation(idx, 'institution', e.target.value)} 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor={`edu-degree-${idx}`}>Degree</label>
              <input 
                type="text" 
                id={`edu-degree-${idx}`}
                value={edu.degree} 
                onChange={(e) => updateEducation(idx, 'degree', e.target.value)} 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor={`edu-field-${idx}`}>Field of Study</label>
              <input 
                type="text" 
                id={`edu-field-${idx}`}
                value={edu.field} 
                onChange={(e) => updateEducation(idx, 'field', e.target.value)} 
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor={`edu-start-${idx}`}>Start Year</label>
                <input 
                  type="number" 
                  id={`edu-start-${idx}`}
                  value={edu.startYear} 
                  onChange={(e) => updateEducation(idx, 'startYear', parseInt(e.target.value))} 
                />
              </div>
              
              {!edu.current && (
                <div className={styles.formGroup}>
                  <label htmlFor={`edu-end-${idx}`}>End Year</label>
                  <input 
                    type="number" 
                    id={`edu-end-${idx}`}
                    value={edu.endYear || ''} 
                    onChange={(e) => updateEducation(idx, 'endYear', parseInt(e.target.value))} 
                  />
                </div>
              )}
            </div>
            
            <div className={styles.checkboxContainer}>
              <input 
                type="checkbox" 
                id={`edu-current-${idx}`}
                checked={edu.current} 
                onChange={(e) => updateEducation(idx, 'current', e.target.checked)} 
              />
              <label htmlFor={`edu-current-${idx}`}>Current</label>
            </div>
          </div>
        ))}
        
        <button 
          type="button" 
          className={styles.addButton}
          onClick={addEducation}
        >
          <PlusIcon /> Add Education
        </button>
      </div>
      
      <div className={styles.formSection}>
        <h4>Interests</h4>
        <div className={styles.interestsSelection}>
          {['Design', 'Development', 'Marketing', 'Business', 'Education', 
            'Remote Work', 'Productivity', 'Writing', 'Entrepreneurship',
            'Science', 'Technology', 'Math', 'Literature', 'Art',
            'Music', 'Languages'].map((interest) => (
            <div key={interest} className={styles.interestOption}>
              <input 
                type="checkbox" 
                id={`interest-${interest}`}
                checked={(formProfile.interests || []).includes(interest)} 
                onChange={() => handleInterestChange(interest)} 
              />
              <label htmlFor={`interest-${interest}`}>{interest}</label>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h4>Social Links</h4>
        <div className={styles.formGroup}>
          <label htmlFor="linkedin">LinkedIn</label>
          <input 
            type="url" 
            id="linkedin" 
            name="socialLinks.linkedin" 
            value={formProfile.socialLinks?.linkedin || ''} 
            onChange={(e) => setFormProfile({
              ...formProfile,
              socialLinks: {
                ...formProfile.socialLinks,
                linkedin: e.target.value
              }
            })} 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="twitter">Twitter</label>
          <input 
            type="url" 
            id="twitter" 
            name="socialLinks.twitter" 
            value={formProfile.socialLinks?.twitter || ''} 
            onChange={(e) => setFormProfile({
              ...formProfile,
              socialLinks: {
                ...formProfile.socialLinks,
                twitter: e.target.value
              }
            })} 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="github">GitHub</label>
          <input 
            type="url" 
            id="github" 
            name="socialLinks.github" 
            value={formProfile.socialLinks?.github || ''} 
            onChange={(e) => setFormProfile({
              ...formProfile,
              socialLinks: {
                ...formProfile.socialLinks,
                github: e.target.value
              }
            })} 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="website">Personal Website</label>
          <input 
            type="url" 
            id="website" 
            name="socialLinks.website" 
            value={formProfile.socialLinks?.website || ''} 
            onChange={(e) => setFormProfile({
              ...formProfile,
              socialLinks: {
                ...formProfile.socialLinks,
                website: e.target.value
              }
            })} 
          />
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h4>Privacy Settings</h4>
        <div className={styles.checkboxContainer}>
          <input 
            type="checkbox" 
            id="privateProfile" 
            name="preferences.privateProfile" 
            checked={formProfile.preferences?.privateProfile || false} 
            onChange={handleCheckboxChange} 
          />
          <label htmlFor="privateProfile">Make my profile private</label>
        </div>
        
        <div className={styles.checkboxContainer}>
          <input 
            type="checkbox" 
            id="emailNotifications" 
            name="preferences.emailNotifications" 
            checked={formProfile.preferences?.emailNotifications || false} 
            onChange={handleCheckboxChange} 
          />
          <label htmlFor="emailNotifications">Receive email notifications</label>
        </div>
        
        <div className={styles.checkboxContainer}>
          <input 
            type="checkbox" 
            id="pushNotifications" 
            name="preferences.pushNotifications" 
            checked={formProfile.preferences?.pushNotifications || false} 
            onChange={handleCheckboxChange} 
          />
          <label htmlFor="pushNotifications">Receive push notifications</label>
        </div>
      </div>
    </form>
  );

  // Render user information in view mode
  const renderUserInfo = () => (
    <div className={styles.userInfoContainer}>
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>
          <UserIcon />
          <span>Full Name</span>
        </div>
        <div className={styles.infoValue}>{profile?.name || 'Not provided'}</div>
      </div>
      
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span>Email</span>
        </div>
        <div className={styles.infoValue}>{profile?.email || 'Not provided'}</div>
      </div>
      
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>
          <BriefcaseIcon />
          <span>Profession</span>
        </div>
        <div className={styles.infoValue}>{profile?.profession || 'Not provided'}</div>
      </div>
      
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>
          <LocationIcon />
          <span>Location</span>
        </div>
        <div className={styles.infoValue}>{profile?.location || 'Not provided'}</div>
      </div>
      
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>
          <ClockIcon />
          <span>Timezone</span>
        </div>
        <div className={styles.infoValue}>{profile?.timezone || 'Not provided'}</div>
      </div>
      
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Bio</span>
        </div>
        <div className={styles.infoValue}>{profile?.bio || 'Not provided'}</div>
      </div>
      
      {profile?.education && profile.education.length > 0 && (
        <div className={styles.educationSection}>
          <h4 className={styles.sectionTitle}>Education</h4>
          <div className={styles.educationList}>
            {profile.education.map((edu, index) => (
              <div key={index} className={styles.educationItem}>
                <div className={styles.educationIcon}>
                  <GraduationCapIcon />
                </div>
                <div className={styles.educationDetails}>
                  <h5>{edu.degree} in {edu.field}</h5>
                  <p>{edu.institution}</p>
                  <p>{edu.startYear} - {edu.current ? 'Present' : edu.endYear}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {profile?.interests && profile.interests.length > 0 && (
        <div className={styles.interestsContainer}>
          <h4>Interests</h4>
          <div className={styles.interestsList}>
            {profile.interests.map((interest, index) => (
              <span key={index} className={styles.interestTag}>{interest}</span>
            ))}
          </div>
        </div>
      )}
      
      {profile?.socialLinks && (
        <div className={styles.socialLinksSection}>
          <h4 className={styles.sectionTitle}>Connect Online</h4>
          <div className={styles.socialLinksList}>
            {profile.socialLinks.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span>LinkedIn</span>
              </a>
            )}
            
            {profile.socialLinks.twitter && (
              <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
                <span>Twitter</span>
              </a>
            )}
            
            {profile.socialLinks.github && (
              <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <span>GitHub</span>
              </a>
            )}
            
            {profile.socialLinks.website && (
              <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <GlobeIcon />
                <span>Website</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Render network section
  const renderNetwork = () => (
    <div className={styles.profileSection}>
      <div className={styles.connectionStats}>
        <div className={styles.connectionStat}>
          <h4>{networkStats.totalConnections}</h4>
          <p>Connected</p>
        </div>
        <div className={styles.connectionStat}>
          <h4>{networkStats.pendingRequests}</h4>
          <p>Pending</p>
        </div>
        <div className={styles.connectionStat}>
          <h4>{studySessions.length}</h4>
          <p>Study Sessions</p>
        </div>
      </div>
      
      <div className={styles.networkSearch}>
        <input type="text" placeholder="Search connections..." />
        <Link to="/network" className={styles.primaryButton}>View Network</Link>
      </div>
      
      <div className={styles.connectionSectionHeader}>
        <h3>Your Connections</h3>
        <Link to="/network" className={styles.viewAllLink}>View All</Link>
      </div>
      
      <div className={styles.connectionsList}>
        {connections.length > 0 ? (
          connections.slice(0, 3).map((connection) => (
            <div key={connection.id} className={styles.connectionCard}>
              <div className={styles.connectionAvatar}>
                {connection.user.avatar ? (
                  <img src={connection.user.avatar} alt={connection.user.name} />
                ) : (
                  <div className={styles.defaultAvatar}>
                    {connection.user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className={styles.connectionInfo}>
                <h4>{connection.user.name}</h4>
                <p>{connection.user.profession || 'No profession listed'}</p>
                <p className={styles.mutualConnections}>
                  <span className={styles.mutualCount}>{connection.mutualConnections || 0}</span> mutual connections
                </p>
                {connection.lastActive && (
                  <p className={styles.lastActive}>Last active: {connection.lastActive}</p>
                )}
              </div>
              <div className={styles.connectionActions}>
                <Link to={`/messages/${connection.user.id}`} className={styles.messageButton}>
                  <MessageIcon />
                  <span>Message</span>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>You don't have any connections yet. Start building your network!</p>
            <Link to="/network" className={styles.primaryButton}>Find People</Link>
          </div>
        )}
      </div>
      
      <div className={styles.suggestionsSection}>
        <div className={styles.connectionSectionHeader}>
          <h3>Suggested Connections</h3>
          <Link to="/network" className={styles.viewAllLink}>View More</Link>
        </div>
        <div className={styles.suggestionsList}>
          <div className={styles.connectionCard}>
            <div className={styles.connectionAvatar}>
              <div className={styles.defaultAvatar}>J</div>
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
              <div className={styles.defaultAvatar}>M</div>
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
        {studySessions.length > 0 ? (
          studySessions
            .filter(session => 
              (activeTab === 'upcoming-sessions' && session.status === 'upcoming') || 
              (activeTab === 'past-sessions' && ['completed', 'cancelled'].includes(session.status))
            )
            .map(session => (
              <div key={session.id} className={styles.sessionCard}>
                <div className={styles.sessionHeader}>
                  <h3 className={styles.sessionTitle}>{session.title}</h3>
                  {session.status === 'upcoming' && (
                    <span className={styles.sessionStatus}>Upcoming</span>
                  )}
                  {session.status === 'completed' && (
                    <span className={`${styles.sessionStatus} ${styles.completedStatus}`}>Completed</span>
                  )}
                  {session.status === 'cancelled' && (
                    <span className={`${styles.sessionStatus} ${styles.cancelledStatus}`}>Cancelled</span>
                  )}
                </div>
                <div className={styles.sessionDetails}>
                  <div className={styles.sessionDetail}>
                    <CalendarIcon />
                    <span>{formatDate(session.date)}</span>
                  </div>
                  <div className={styles.sessionDetail}>
                    <ClockIcon />
                    <span>{session.startTime} - {session.endTime}</span>
                  </div>
                  <div className={styles.sessionDetail}>
                    <LocationIcon />
                    <span>{session.workspace.name}</span>
                  </div>
                </div>
                <div className={styles.sessionParticipants}>
                  <h4>Participants ({session.participants.length}/{session.maxParticipants})</h4>
                  <div className={styles.participantsList}>
                    {session.participants.map((participant, index) => (
                      <div key={index} className={styles.participant}>
                        {participant.name}
                        {participant.status === 'pending' && (
                          <span className={styles.pendingStatus}> (Pending)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.sessionActions}>
                  {session.status === 'upcoming' ? (
                    <>
                      <Link to={`/study-sessions/${session.id}`} className={`${styles.actionButton} ${styles.primaryButton}`}>
                        View Details
                      </Link>
                      {session.host.id === profile?.id && (
                        <button className={`${styles.actionButton} ${styles.secondaryButton}`}>
                          Manage Session
                        </button>
                      )}
                    </>
                  ) : (
                    <Link to={`/study-sessions/${session.id}`} className={`${styles.actionButton} ${styles.primaryButton}`}>
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            ))
        ) : (
          <div className={styles.emptyState}>
            <p>You don't have any study sessions yet.</p>
            <Link to="/study-sessions/create" className={styles.primaryButton}>
              <PlusIcon />
              Create New Study Session
            </Link>
          </div>
        )}
      </div>
      
      <div className={styles.newSessionButtonContainer}>
        <Link to="/study-sessions/create" className={`${styles.newSessionButton} ${styles.primaryButton}`}>
          <PlusIcon />
          Create New Study Session
        </Link>
      </div>
    </div>
  );

  // Determine which content to render based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'network':
        return renderNetwork();
      case 'sessions':
      case 'upcoming-sessions':
      case 'past-sessions':
        return renderSessions();
      default:
        return isEditing ? renderUserInfoForm() : renderUserInfo();
    }
  };
  
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileHeaderContent}>
          <div className={styles.profileBanner}>
            <label htmlFor="banner-upload" className={styles.editBannerButton}>
              <CameraIcon />
              <input 
                type="file" 
                id="banner-upload" 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </label>
          </div>
          
          <div className={styles.profileMainInfo}>
            <div className={styles.profileAvatarContainer}>
              <div className={styles.profileAvatar}>
                {profile?.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    className={styles.avatarImage} 
                  />
                ) : (
                  getUserInitials()
                )}
              </div>
              <label htmlFor="avatar-upload" className={styles.editAvatarButton}>
                <CameraIcon />
                <input 
                  type="file" 
                  id="avatar-upload" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>
            
            <div className={styles.profileInfo}>
              <h1 className={styles.profileName}>{profile?.name || user?.name || 'User Name'}</h1>
              <p className={styles.profileTitle}>{profile?.profession || 'No profession specified'}</p>
              <div className={styles.profileLocation}>
                <LocationIcon />
                <span>{profile?.location || 'No location specified'}</span>
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
            <Link to="/favorites" className={styles.navButton}>
              <BookmarkIcon />
              <span>Favorite Spaces</span>
            </Link>
            <Link to="/settings" className={styles.navButton}>
              <SettingsIcon />
              <span>Settings</span>
            </Link>
          </div>
          
          <div className={styles.profileStats}>
            <h3>Profile Stats</h3>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Profile Views</span>
              <span className={styles.statValue}>124</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Network</span>
              <span className={styles.statValue}>{networkStats.totalConnections}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Study Sessions</span>
              <span className={styles.statValue}>{studySessions.length}</span>
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
              {(activeTab === 'sessions' || activeTab === 'upcoming-sessions' || activeTab === 'past-sessions') && 'Study Sessions'}
            </h2>
            {error && <div className={styles.errorMessage}>{error}</div>}
          </div>
          
          {loading ? <Loading message="Loading..." /> : renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;