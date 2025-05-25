// app/components/Dashboard/SideBar/Settings.tsx - REVOLUTIONARY 2025 EDITION
import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from "../../../contexts/AuthContext";
import styles from './sidebarstyles/settings.module.css';

// Modern Icon Components with glassmorphism support
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AccountIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SecurityIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22S8 18 8 12V5L12 3L16 5V12C16 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NotificationIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21A1.999 1.999 0 0 1 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PrivacyIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PreferencesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M19.4 15A1.65 1.65 0 0 0 21 13.09A1.65 1.65 0 0 0 19.4 9M2.6 15A1.65 1.65 0 0 1 1 13.09A1.65 1.65 0 0 1 2.6 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DataIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M9.09 9A3 3 0 0 1 12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="17" r="1" fill="currentColor"/>
  </svg>
);

const DangerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.54 21H20.46A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 9V13M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Types for our settings
interface UserSettings {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profession?: string;
  location?: string;
  timezone?: string;
  bio?: string;
  interests?: string[];
  skills?: string[];
  preferences: {
    privateProfile: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    studyPreferences: {
      preferredEnvironments: string[];
      noiseLevel: string;
      preferredTimes: string[];
      groupSize: string;
    };
    language?: string;
    theme?: string;
    timeFormat?: string;
    distanceUnit?: string;
  };
  notificationStats: {
    total: number;
    unread: number;
    byType: Record<string, number>;
  };
}

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [activeSection, setActiveSection] = useState('account');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load settings data
  useEffect(() => {
    fetchSettings();
    fetchSessions();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // Use the existing profile endpoint for now until settings routes are added
      const response = await fetch('http://localhost:5003/api/profile', {
        headers: {
          'x-auth-token': localStorage.getItem('token') || ''
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch settings');
      
      const profileData = await response.json();
      
      // Transform profile data to match our settings interface
      const settingsData: UserSettings = {
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        avatar: profileData.avatar,
        profession: profileData.profession || '',
        location: profileData.location || '',
        timezone: profileData.timezone || 'UTC',
        bio: profileData.bio || '',
        interests: profileData.interests || [],
        skills: [], // Add if available in profile
        preferences: {
          privateProfile: false,
          emailNotifications: true,
          pushNotifications: true,
          studyPreferences: {
            preferredEnvironments: ['library', 'cafe'],
            noiseLevel: 'quiet',
            preferredTimes: ['morning', 'afternoon'],
            groupSize: 'small'
          }
        },
        notificationStats: {
          total: 0,
          unread: 0,
          byType: {}
        }
      };

      // Try to get notification stats
      try {
        const notifResponse = await fetch('http://localhost:5003/api/notifications/stats', {
          headers: {
            'x-auth-token': localStorage.getItem('token') || ''
          }
        });
        
        if (notifResponse.ok) {
          const notifStats = await notifResponse.json();
          settingsData.notificationStats = notifStats;
        }
      } catch (notifErr) {
        console.log('Could not fetch notification stats:', notifErr);
      }
      
      setSettings(settingsData);
    } catch (err) {
      console.error('Settings fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      // Mock sessions data for now since the backend route doesn't exist yet
      const mockSessions: ActiveSession[] = [
        {
          id: 'current',
          device: 'Current Device - Chrome on macOS',
          location: 'San Francisco, CA',
          lastActive: 'Active now',
          isCurrent: true
        },
        {
          id: 'mobile',
          device: 'iPhone - Safari',
          location: 'San Francisco, CA',
          lastActive: 'Yesterday',
          isCurrent: false
        }
      ];
      
      setSessions(mockSessions);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  // Generic save function with loading state
  const saveSettings = async (endpoint: string, data: any, successMsg: string) => {
    try {
      setSaving(true);
      setError(null);
      
      // Use existing profile endpoint for account updates
      let url = '';
      let method = 'PUT';
      
      if (endpoint === 'account') {
        url = 'http://localhost:5003/api/profile';
      } else {
        // For other endpoints, we'll implement them later
        setSuccessMessage('Settings saved locally (backend integration pending)');
        setTimeout(() => setSuccessMessage(null), 3000);
        return;
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save settings');
      }

      const result = await response.json();
      setSuccessMessage(successMsg);
      
      // Refresh settings
      await fetchSettings();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Account settings save
  const saveAccountSettings = async () => {
    if (!settings) return;
    
    await saveSettings('account', {
      name: settings.name,
      email: settings.email,
      profession: settings.profession,
      location: settings.location,
      timezone: settings.timezone,
      bio: settings.bio,
      interests: settings.interests,
      skills: settings.skills
    }, 'Account settings saved successfully!');
  };

  // Password change
  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // For now, show success message (implement backend later)
    setSuccessMessage('Password change functionality will be available soon!');
    setTimeout(() => setSuccessMessage(null), 3000);

    // Clear password fields
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // Preferences save
  const savePreferences = async () => {
    if (!settings) return;
    
    await saveSettings('preferences', settings.preferences, 'Preferences saved successfully!');
  };

  // Export data
  const exportData = async () => {
    try {
      setSaving(true);
      
      // Create export data from current settings
      const exportData = {
        profile: settings,
        exportedAt: new Date().toISOString(),
        note: 'This is a sample export. Full data export will include bookings, favorites, and notifications when backend is integrated.'
      };
      
      // Download the data
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nomaddesk-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccessMessage('Data exported successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
    } finally {
      setSaving(false);
    }
  };

  // Navigation sections
  const navigationSections = [
    { id: 'account', label: 'Account', icon: AccountIcon },
    { id: 'security', label: 'Security', icon: SecurityIcon },
    { id: 'notifications', label: 'Notifications', icon: NotificationIcon },
    { id: 'privacy', label: 'Privacy', icon: PrivacyIcon },
    { id: 'preferences', label: 'Preferences', icon: PreferencesIcon },
    { id: 'data', label: 'Data & Export', icon: DataIcon },
    { id: 'help', label: 'Help & Support', icon: HelpIcon },
    { id: 'danger', label: 'Danger Zone', icon: DangerIcon }
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your settings...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className={styles.errorContainer}>
        <h2>Failed to load settings</h2>
        <p>{error}</p>
        <button onClick={fetchSettings} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.settingsContainer}>
      {/* Header with Back Button */}
      <div className={styles.settingsHeader}>
        <button 
          onClick={() => navigate({ to: '/dashboard' })}
          className={styles.backButton}
        >
          <BackIcon />
          <span>Back to Dashboard</span>
        </button>
        
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <PreferencesIcon />
          </div>
          <div className={styles.headerText}>
            <h1>Settings</h1>
            <p>Manage your account, preferences, and workspace experience</p>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className={styles.statusMessage + ' ' + styles.errorMessage}>
            <DangerIcon />
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
        
        {successMessage && (
          <div className={styles.statusMessage + ' ' + styles.successMessage}>
            <PrivacyIcon />
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)}>×</button>
          </div>
        )}
      </div>

      <div className={styles.settingsBody}>
        {/* Sidebar Navigation */}
        <nav className={styles.settingsSidebar}>
          <div className={styles.sidebarNav}>
            {navigationSections.map(section => (
              <button
                key={section.id}
                className={`${styles.navButton} ${activeSection === section.id ? styles.activeNavButton : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon />
                <span>{section.label}</span>
                {section.id === 'notifications' && settings.notificationStats.unread > 0 && (
                  <div className={styles.notificationBadge}>
                    {settings.notificationStats.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content Area */}
        <main className={styles.settingsContent}>
          {activeSection === 'account' && (
            <div className={styles.settingsSection}>
              <div className={styles.sectionHeader}>
                <h2>Account Settings</h2>
                <p>Manage your personal information and profile details</p>
              </div>

              <div className={styles.formGrid}>
                {/* Basic Information */}
                <div className={styles.formCard}>
                  <h3>Basic Information</h3>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      value={settings.name}
                      onChange={(e) => setSettings({...settings, name: e.target.value})}
                      className={styles.modernInput}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={settings.email}
                      onChange={(e) => setSettings({...settings, email: e.target.value})}
                      className={styles.modernInput}
                      placeholder="Enter your email"
                    />
                    <p className={styles.inputHint}>
                      This email will be used for account notifications and login
                    </p>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="profession">Profession</label>
                    <input
                      type="text"
                      id="profession"
                      value={settings.profession || ''}
                      onChange={(e) => setSettings({...settings, profession: e.target.value})}
                      className={styles.modernInput}
                      placeholder="e.g., Software Developer, Student, Designer"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      value={settings.location || ''}
                      onChange={(e) => setSettings({...settings, location: e.target.value})}
                      className={styles.modernInput}
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                </div>

                {/* Profile Details */}
                <div className={styles.formCard}>
                  <h3>Profile Details</h3>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      value={settings.bio || ''}
                      onChange={(e) => setSettings({...settings, bio: e.target.value})}
                      className={styles.modernTextarea}
                      placeholder="Tell others about yourself and your work/study interests..."
                      rows={4}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="interests">Interests (comma-separated)</label>
                    <input
                      type="text"
                      id="interests"
                      value={settings.interests?.join(', ') || ''}
                      onChange={(e) => setSettings({
                        ...settings, 
                        interests: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      })}
                      className={styles.modernInput}
                      placeholder="e.g., Programming, Design, Photography, Reading"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="timezone">Timezone</label>
                    <select
                      id="timezone"
                      value={settings.timezone || 'UTC'}
                      onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                      className={styles.modernSelect}
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  onClick={saveAccountSettings}
                  disabled={saving}
                  className={styles.primaryButton}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className={styles.settingsSection}>
              <div className={styles.sectionHeader}>
                <h2>Security & Privacy</h2>
                <p>Manage your account security, password, and active sessions</p>
              </div>

              <div className={styles.formGrid}>
                {/* Password Management */}
                <div className={styles.formCard}>
                  <h3>Password Management</h3>
                  
                  {user?.googleId ? (
                    <div className={styles.infoCard}>
                      <p>You're signed in with Google. Password changes are managed through your Google account.</p>
                    </div>
                  ) : (
                    <>
                      <div className={styles.formGroup}>
                        <label htmlFor="currentPassword">Current Password</label>
                        <input
                          type="password"
                          id="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({
                            ...passwordData, 
                            currentPassword: e.target.value
                          })}
                          className={styles.modernInput}
                          placeholder="Enter current password"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="newPassword">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({
                            ...passwordData, 
                            newPassword: e.target.value
                          })}
                          className={styles.modernInput}
                          placeholder="Enter new password (min 6 characters)"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({
                            ...passwordData, 
                            confirmPassword: e.target.value
                          })}
                          className={styles.modernInput}
                          placeholder="Confirm new password"
                        />
                      </div>

                      <button 
                        onClick={changePassword}
                        disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                        className={styles.secondaryButton}
                      >
                        {saving ? 'Changing...' : 'Change Password'}
                      </button>
                    </>
                  )}
                </div>

                {/* Active Sessions */}
                <div className={styles.formCard}>
                  <h3>Active Sessions</h3>
                  
                  <div className={styles.sessionsList}>
                    {sessions.map(session => (
                      <div key={session.id} className={styles.sessionItem}>
                        <div className={styles.sessionInfo}>
                          <div className={styles.sessionDevice}>{session.device}</div>
                          <div className={styles.sessionMeta}>
                            {session.location} • {session.lastActive}
                          </div>
                        </div>
                        <div className={styles.sessionActions}>
                          {session.isCurrent ? (
                            <span className={styles.currentBadge}>Current</span>
                          ) : (
                            <button className={styles.dangerButton}>End Session</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className={styles.settingsSection}>
              <div className={styles.sectionHeader}>
                <h2>Notification Preferences</h2>
                <p>Control how and when you receive notifications from Nomad Desk</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formCard}>
                  <h3>General Notifications</h3>
                  
                  <div className={styles.toggleGroup}>
                    <div className={styles.toggleItem}>
                      <div className={styles.toggleInfo}>
                        <strong>Email Notifications</strong>
                        <p>Receive important updates via email</p>
                      </div>
                      <label className={styles.toggleSwitch}>
                        <input
                          type="checkbox"
                          checked={settings.preferences.emailNotifications}
                          onChange={(e) => setSettings({
                            ...settings,
                            preferences: {
                              ...settings.preferences,
                              emailNotifications: e.target.checked
                            }
                          })}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>

                    <div className={styles.toggleItem}>
                      <div className={styles.toggleInfo}>
                        <strong>Push Notifications</strong>
                        <p>Get real-time alerts on your device</p>
                      </div>
                      <label className={styles.toggleSwitch}>
                        <input
                          type="checkbox"
                          checked={settings.preferences.pushNotifications}
                          onChange={(e) => setSettings({
                            ...settings,
                            preferences: {
                              ...settings.preferences,
                              pushNotifications: e.target.checked
                            }
                          })}
                        />
                        <span className={styles.slider}></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className={styles.formCard}>
                  <h3>Notification Statistics</h3>
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>{settings.notificationStats.total}</div>
                      <div className={styles.statLabel}>Total Notifications</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>{settings.notificationStats.unread}</div>
                      <div className={styles.statLabel}>Unread</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  onClick={savePreferences}
                  disabled={saving}
                  className={styles.primaryButton}
                >
                  {saving ? 'Saving...' : 'Save Notification Settings'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className={styles.settingsSection}>
              <div className={styles.sectionHeader}>
                <h2>Privacy Settings</h2>
                <p>Control your privacy and data sharing preferences</p>
              </div>

              <div className={styles.formCard}>
                <h3>Profile Visibility</h3>
                
                <div className={styles.toggleItem}>
                  <div className={styles.toggleInfo}>
                    <strong>Private Profile</strong>
                    <p>Make your profile visible only to your connections</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={settings.preferences.privateProfile}
                      onChange={(e) => setSettings({
                        ...settings,
                        preferences: {
                          ...settings.preferences,
                          privateProfile: e.target.checked
                        }
                      })}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  onClick={savePreferences}
                  disabled={saving}
                  className={styles.primaryButton}
                >
                  {saving ? 'Saving...' : 'Save Privacy Settings'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div className={styles.settingsSection}>
              <div className={styles.sectionHeader}>
                <h2>Study Preferences</h2>
                <p>Customize your workspace discovery and study session preferences</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formCard}>
                  <h3>Workspace Preferences</h3>
                  
                  <div className={styles.formGroup}>
                    <label>Preferred Environments</label>
                    <div className={styles.checkboxGrid}>
                      {['library', 'cafe', 'coworking', 'outdoors'].map(env => (
                        <label key={env} className={styles.checkboxItem}>
                          <input
                            type="checkbox"
                            checked={settings.preferences.studyPreferences.preferredEnvironments.includes(env)}
                            onChange={(e) => {
                              const envs = settings.preferences.studyPreferences.preferredEnvironments;
                              const newEnvs = e.target.checked
                                ? [...envs, env]
                                : envs.filter(e => e !== env);
                              
                              setSettings({
                                ...settings,
                                preferences: {
                                  ...settings.preferences,
                                  studyPreferences: {
                                    ...settings.preferences.studyPreferences,
                                    preferredEnvironments: newEnvs
                                  }
                                }
                              });
                            }}
                          />
                          <span>{env.charAt(0).toUpperCase() + env.slice(1)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="noiseLevel">Preferred Noise Level</label>
                    <select
                      id="noiseLevel"
                      value={settings.preferences.studyPreferences.noiseLevel}
                      onChange={(e) => setSettings({
                        ...settings,
                        preferences: {
                          ...settings.preferences,
                          studyPreferences: {
                            ...settings.preferences.studyPreferences,
                            noiseLevel: e.target.value
                          }
                        }
                      })}
                      className={styles.modernSelect}
                    >
                      <option value="silent">Silent</option>
                      <option value="quiet">Quiet</option>
                      <option value="moderate">Moderate</option>
                      <option value="lively">Lively</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="groupSize">Preferred Group Size</label>
                    <select
                      id="groupSize"
                      value={settings.preferences.studyPreferences.groupSize}
                      onChange={(e) => setSettings({
                        ...settings,
                        preferences: {
                          ...settings.preferences,
                          studyPreferences: {
                            ...settings.preferences.studyPreferences,
                            groupSize: e.target.value
                          }
                        }
                      })}
                      className={styles.modernSelect}
                    >
                      <option value="solo">Solo</option>
                      <option value="small">Small (2-4 people)</option>
                      <option value="medium">Medium (5-8 people)</option>
                      <option value="large">Large (9+ people)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formCard}>
                  <h3>Time Preferences</h3>
                  
                  <div className={styles.formGroup}>
                    <label>Preferred Study Times</label>
                    <div className={styles.checkboxGrid}>
                      {['morning', 'afternoon', 'evening', 'night'].map(time => (
                        <label key={time} className={styles.checkboxItem}>
                          <input
                            type="checkbox"
                            checked={settings.preferences.studyPreferences.preferredTimes.includes(time)}
                            onChange={(e) => {
                              const times = settings.preferences.studyPreferences.preferredTimes;
                              const newTimes = e.target.checked
                                ? [...times, time]
                                : times.filter(t => t !== time);
                              
                              setSettings({
                                ...settings,
                                preferences: {
                                  ...settings.preferences,
                                  studyPreferences: {
                                    ...settings.preferences.studyPreferences,
                                    preferredTimes: newTimes
                                  }
                                }
                              });
                            }}
                          />
                          <span>{time.charAt(0).toUpperCase() + time.slice(1)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  onClick={savePreferences}
                  disabled={saving}
                  className={styles.primaryButton}
                >
                  {saving ? 'Saving...' : 'Save Study Preferences'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'data' && (
            <div className={styles.settingsSection}>
              <div className={styles.sectionHeader}>
                <h2>Data Management</h2>
                <p>Export your data or manage your account information</p>
              </div>

              <div className={styles.formCard}>
                <h3>Export Your Data</h3>
                <p>Download a copy of all your data including profile, bookings, favorites, and notifications.</p>
                
                <button 
                  onClick={exportData}
                  disabled={saving}
                  className={styles.secondaryButton}
                >
                  {saving ? 'Preparing Export...' : 'Export All Data'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'help' && (
            <div className={styles.settingsSection}>
              <div className={styles.sectionHeader}>
                <h2>Help & Support</h2>
                <p>Get help with your account or contact our support team</p>
              </div>

              <div className={styles.supportGrid}>
                <div className={styles.supportCard}>
                  <HelpIcon />
                  <h3>Help Center</h3>
                  <p>Find answers to frequently asked questions and guides for using Nomad Desk.</p>
                  <button className={styles.secondaryButton}>Visit Help Center</button>
                </div>

                <div className={styles.supportCard}>
                  <NotificationIcon />
                  <h3>Contact Support</h3>
                  <p>Get personalized help from our support team for any issues or questions.</p>
                  <button className={styles.secondaryButton}>Contact Support</button>
                </div>

                <div className={styles.supportCard}>
                  <PrivacyIcon />
                  <h3>Community</h3>
                  <p>Join the Nomad Desk community to connect with other remote workers and students.</p>
                  <button className={styles.secondaryButton}>Join Community</button>
                </div>
              </div>

              <div className={styles.appInfo}>
                <h3>About Nomad Desk</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span>Version</span>
                    <span>2.1.0</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Last Updated</span>
                    <span>January 2025</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'danger' && (
            <div className={styles.settingsSection}>
              <div className={styles.sectionHeader}>
                <h2>Danger Zone</h2>
                <p>Actions that can't be undone. Please proceed with caution.</p>
              </div>

              <div className={styles.dangerZone}>
                <div className={styles.dangerCard}>
                  <div className={styles.dangerInfo}>
                    <h3>Export Data Before Deletion</h3>
                    <p>Download all your data before deleting your account. This action cannot be undone.</p>
                  </div>
                  <button 
                    onClick={exportData}
                    className={styles.secondaryButton}
                  >
                    Export My Data
                  </button>
                </div>

                <div className={styles.dangerCard}>
                  <div className={styles.dangerInfo}>
                    <h3>Delete Account</h3>
                    <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
                  </div>
                  <button className={styles.dangerButton}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;