// app/components/settings/Settings.tsx
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import styles from './sidebarstyles/settings.module.css';

// Icons
const SecurityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const PaymentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const PrivacyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const PreferencesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const AccountIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const DangerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const ThemeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('account');
  const [settings, setSettings] = useState({
    // Account settings
    email: user?.email || 'user@example.com',
    name: user?.name || 'User Name',
    
    // Security settings
    twoFactorEnabled: false,
    loginNotifications: true,
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    bookingReminders: true,
    marketingEmails: false,
    
    // Privacy settings
    profileVisibility: 'public',
    showLocation: true,
    shareActivity: true,
    allowDataCollection: true,
    
    // Preference settings
    language: 'English',
    timeFormat: '12h',
    distanceUnit: 'miles',
    theme: 'light',
    
    // Payment settings
    defaultPaymentMethod: 'Visa ending in 4242',
    savePaymentInfo: true,
    
    // Danger Zone
    twoFactorRequired: false,
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings({
      ...settings,
      [name]: checked
    });
  };

  // Handle radio button changes
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };

  // Save settings
  const saveSettings = () => {
    console.log('Settings saved:', settings);
    // Here you would typically send the settings to your backend
    alert('Settings have been saved successfully!');
  };

  // Render account settings
  const renderAccountSettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>Account Settings</h3>
      <p className={styles.sectionDescription}>
        Manage your account details and personal information.
      </p>
      
      <div className={styles.formGroup}>
        <label htmlFor="name">Full Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={settings.name} 
          onChange={handleInputChange} 
          className={styles.textInput}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="email">Email Address</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={settings.email} 
          onChange={handleInputChange} 
          className={styles.textInput}
        />
        <p className={styles.inputNote}>This email will be used for account-related notifications</p>
      </div>
      
      <div className={styles.formActions}>
        <button className={styles.primaryButton} onClick={saveSettings}>
          Save Changes
        </button>
      </div>
    </div>
  );

  // Render security settings
  const renderSecuritySettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>Security Settings</h3>
      <p className={styles.sectionDescription}>
        Manage your account security and authentication options.
      </p>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Password</h4>
        <div className={styles.passwordSection}>
          <div className={styles.passwordInfo}>
            <p>Last changed: 45 days ago</p>
          </div>
          <button className={styles.secondaryButton}>
            Change Password
          </button>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Two-Factor Authentication</h4>
        <div className={styles.toggleOption}>
          <div className={styles.toggleInfo}>
            <p className={styles.toggleTitle}>Enable Two-Factor Authentication</p>
            <p className={styles.toggleDescription}>Add an extra layer of security to your account</p>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              name="twoFactorEnabled" 
              checked={settings.twoFactorEnabled} 
              onChange={handleCheckboxChange}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Login Notifications</h4>
        <div className={styles.toggleOption}>
          <div className={styles.toggleInfo}>
            <p className={styles.toggleTitle}>Email me when someone logs in from a new device</p>
            <p className={styles.toggleDescription}>Receive an email alert when your account is accessed from an unfamiliar device</p>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              name="loginNotifications" 
              checked={settings.loginNotifications} 
              onChange={handleCheckboxChange}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Active Sessions</h4>
        <div className={styles.sessionsList}>
          <div className={styles.sessionItem}>
            <div className={styles.sessionInfo}>
              <p className={styles.deviceName}>Current Device - Chrome on macOS</p>
              <p className={styles.sessionDetails}>San Francisco, CA • Active now</p>
            </div>
            <span className={styles.activeBadge}>Current</span>
          </div>
          
          <div className={styles.sessionItem}>
            <div className={styles.sessionInfo}>
              <p className={styles.deviceName}>iPhone 14 - Safari</p>
              <p className={styles.sessionDetails}>San Francisco, CA • Last active: Yesterday</p>
            </div>
            <button className={styles.textButton}>Logout</button>
          </div>
        </div>
        
        <button className={styles.dangerButton}>
          Logout from all other devices
        </button>
      </div>
      
      <div className={styles.formActions}>
        <button className={styles.primaryButton} onClick={saveSettings}>
          Save Changes
        </button>
      </div>
    </div>
  );

  // Render notification settings
  const renderNotificationSettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>Notification Settings</h3>
      <p className={styles.sectionDescription}>
        Manage how and when you receive notifications from NomadDesk.
      </p>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Email Notifications</h4>
        <div className={styles.toggleOption}>
          <div className={styles.toggleInfo}>
            <p className={styles.toggleTitle}>Email Notifications</p>
            <p className={styles.toggleDescription}>Receive important notifications via email</p>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              name="emailNotifications" 
              checked={settings.emailNotifications} 
              onChange={handleCheckboxChange}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Push Notifications</h4>
        <div className={styles.toggleOption}>
          <div className={styles.toggleInfo}>
            <p className={styles.toggleTitle}>Push Notifications</p>
            <p className={styles.toggleDescription}>Receive real-time alerts on your device</p>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              name="pushNotifications" 
              checked={settings.pushNotifications} 
              onChange={handleCheckboxChange}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Notification Types</h4>
        <div className={styles.checkboxGroup}>
          <div className={styles.checkboxOption}>
            <input 
              type="checkbox" 
              id="bookingReminders" 
              name="bookingReminders" 
              checked={settings.bookingReminders} 
              onChange={handleCheckboxChange}
            />
            <label htmlFor="bookingReminders">
              <span className={styles.optionTitle}>Booking Reminders</span>
              <span className={styles.optionDescription}>Get reminders about upcoming workspace bookings</span>
            </label>
          </div>
          
          <div className={styles.checkboxOption}>
            <input 
              type="checkbox" 
              id="marketingEmails" 
              name="marketingEmails" 
              checked={settings.marketingEmails} 
              onChange={handleCheckboxChange}
            />
            <label htmlFor="marketingEmails">
              <span className={styles.optionTitle}>Marketing Emails</span>
              <span className={styles.optionDescription}>Receive updates about new features, promotions, and events</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className={styles.formActions}>
        <button className={styles.primaryButton} onClick={saveSettings}>
          Save Changes
        </button>
      </div>
    </div>
  );

  // Render privacy settings
  const renderPrivacySettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>Privacy Settings</h3>
      <p className={styles.sectionDescription}>
        Control who can see your profile and activity.
      </p>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Profile Visibility</h4>
        <div className={styles.radioGroup}>
          <div className={styles.radioOption}>
            <input 
              type="radio" 
              id="profilePublic" 
              name="profileVisibility" 
              value="public" 
              checked={settings.profileVisibility === 'public'} 
              onChange={handleRadioChange}
            />
            <label htmlFor="profilePublic">
              <span className={styles.optionTitle}>Public</span>
              <span className={styles.optionDescription}>Anyone on NomadDesk can see your profile and activity</span>
            </label>
          </div>
          
          <div className={styles.radioOption}>
            <input 
              type="radio" 
              id="profilePrivate" 
              name="profileVisibility" 
              value="private" 
              checked={settings.profileVisibility === 'private'} 
              onChange={handleRadioChange}
            />
            <label htmlFor="profilePrivate">
              <span className={styles.optionTitle}>Private</span>
              <span className={styles.optionDescription}>Only your connections can see your profile and activity</span>
            </label>
          </div>
          
          <div className={styles.radioOption}>
            <input 
              type="radio" 
              id="profileHidden" 
              name="profileVisibility" 
              value="hidden" 
              checked={settings.profileVisibility === 'hidden'} 
              onChange={handleRadioChange}
            />
            <label htmlFor="profileHidden">
              <span className={styles.optionTitle}>Hidden</span>
              <span className={styles.optionDescription}>Your profile is not discoverable by other users</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Location Sharing</h4>
        <div className={styles.toggleOption}>
          <div className={styles.toggleInfo}>
            <p className={styles.toggleTitle}>Show my current location</p>
            <p className={styles.toggleDescription}>Allow other users to see your approximate location</p>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              name="showLocation" 
              checked={settings.showLocation} 
              onChange={handleCheckboxChange}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Activity Sharing</h4>
        <div className={styles.toggleOption}>
          <div className={styles.toggleInfo}>
            <p className={styles.toggleTitle}>Share my workspace activity</p>
            <p className={styles.toggleDescription}>Let others see which workspaces you've visited</p>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              name="shareActivity" 
              checked={settings.shareActivity} 
              onChange={handleCheckboxChange}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Data Collection</h4>
        <div className={styles.toggleOption}>
          <div className={styles.toggleInfo}>
            <p className={styles.toggleTitle}>Allow usage data collection</p>
            <p className={styles.toggleDescription}>Help us improve by allowing anonymous usage data collection</p>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              name="allowDataCollection" 
              checked={settings.allowDataCollection} 
              onChange={handleCheckboxChange}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
      
      <div className={styles.formActions}>
        <button className={styles.primaryButton} onClick={saveSettings}>
          Save Changes
        </button>
      </div>
    </div>
  );

  // Render preference settings
  const renderPreferenceSettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>Preferences</h3>
      <p className={styles.sectionDescription}>
        Customize your NomadDesk experience.
      </p>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Language</h4>
        <div className={styles.formGroup}>
          <label htmlFor="language">Display Language</label>
          <select 
            id="language" 
            name="language" 
            value={settings.language} 
            onChange={handleInputChange}
            className={styles.selectInput}
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
            <option value="Japanese">Japanese</option>
          </select>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Display Settings</h4>
        <div className={styles.formGroup}>
          <label htmlFor="timeFormat">Time Format</label>
          <select 
            id="timeFormat" 
            name="timeFormat" 
            value={settings.timeFormat} 
            onChange={handleInputChange}
            className={styles.selectInput}
          >
            <option value="12h">12-hour (1:30 PM)</option>
            <option value="24h">24-hour (13:30)</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="distanceUnit">Distance Unit</label>
          <select 
            id="distanceUnit" 
            name="distanceUnit" 
            value={settings.distanceUnit} 
            onChange={handleInputChange}
            className={styles.selectInput}
          >
            <option value="miles">Miles</option>
            <option value="kilometers">Kilometers</option>
          </select>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Theme</h4>
        <div className={styles.themeSelector}>
          <div className={`${styles.themeOption} ${settings.theme === 'light' ? styles.selectedTheme : ''}`}>
            <input 
              type="radio" 
              id="lightTheme" 
              name="theme" 
              value="light" 
              checked={settings.theme === 'light'} 
              onChange={handleRadioChange}
            />
            <label htmlFor="lightTheme">
              <div className={styles.themePreview} style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}>
                <div className={styles.themePreviewHeader} style={{ backgroundColor: '#4A6FDC', height: '20px' }}></div>
                <div className={styles.themePreviewContent}>
                  <div className={styles.themePreviewBlock} style={{ backgroundColor: '#E5E7EB', width: '50%', height: '8px', marginBottom: '6px' }}></div>
                  <div className={styles.themePreviewBlock} style={{ backgroundColor: '#E5E7EB', width: '80%', height: '8px' }}></div>
                </div>
              </div>
              <span>Light</span>
            </label>
          </div>
          
          <div className={`${styles.themeOption} ${settings.theme === 'dark' ? styles.selectedTheme : ''}`}>
            <input 
              type="radio" 
              id="darkTheme" 
              name="theme" 
              value="dark" 
              checked={settings.theme === 'dark'} 
              onChange={handleRadioChange}
            />
            <label htmlFor="darkTheme">
              <div className={styles.themePreview} style={{ backgroundColor: '#2A3347', border: '1px solid #2A3347' }}>
                <div className={styles.themePreviewHeader} style={{ backgroundColor: '#4A6FDC', height: '20px' }}></div>
                <div className={styles.themePreviewContent}>
                  <div className={styles.themePreviewBlock} style={{ backgroundColor: '#4B5563', width: '50%', height: '8px', marginBottom: '6px' }}></div>
                  <div className={styles.themePreviewBlock} style={{ backgroundColor: '#4B5563', width: '80%', height: '8px' }}></div>
                </div>
              </div>
              <span>Dark</span>
            </label>
          </div>
          
          <div className={`${styles.themeOption} ${settings.theme === 'system' ? styles.selectedTheme : ''}`}>
            <input 
              type="radio" 
              id="systemTheme" 
              name="theme" 
              value="system" 
              checked={settings.theme === 'system'} 
              onChange={handleRadioChange}
            />
            <label htmlFor="systemTheme">
              <div className={styles.themePreview} style={{ background: 'linear-gradient(to right, #fff 50%, #2A3347 50%)', border: '1px solid #e5e7eb' }}>
                <div className={styles.themePreviewHeader} style={{ backgroundColor: '#4A6FDC', height: '20px' }}></div>
                <div className={styles.themePreviewContent} style={{ display: 'flex' }}>
                  <div style={{ width: '50%', padding: '0 4px' }}>
                    <div className={styles.themePreviewBlock} style={{ backgroundColor: '#E5E7EB', width: '80%', height: '8px', marginBottom: '6px' }}></div>
                    <div className={styles.themePreviewBlock} style={{ backgroundColor: '#E5E7EB', width: '60%', height: '8px' }}></div>
                  </div>
                  <div style={{ width: '50%', padding: '0 4px' }}>
                    <div className={styles.themePreviewBlock} style={{ backgroundColor: '#4B5563', width: '80%', height: '8px', marginBottom: '6px' }}></div>
                    <div className={styles.themePreviewBlock} style={{ backgroundColor: '#4B5563', width: '60%', height: '8px' }}></div>
                  </div>
                </div>
              </div>
              <span>System</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className={styles.formActions}>
        <button className={styles.primaryButton} onClick={saveSettings}>
          Save Changes
        </button>
      </div>
    </div>
  );

  // Render payment settings
  const renderPaymentSettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>Payment Methods</h3>
      <p className={styles.sectionDescription}>
        Manage your payment methods and billing preferences.
      </p>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Payment Methods</h4>
        <div className={styles.paymentMethodsList}>
          <div className={styles.paymentMethod}>
            <div className={styles.paymentMethodInfo}>
              <div className={styles.paymentMethodIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </div>
              <div className={styles.paymentMethodDetails}>
                <p className={styles.paymentMethodName}>Visa ending in 4242</p>
                <p className={styles.paymentMethodExpiry}>Expires 12/2025</p>
              </div>
            </div>
            <div className={styles.paymentMethodActions}>
              <span className={styles.defaultBadge}>Default</span>
              <button className={styles.textButton}>Remove</button>
            </div>
          </div>
          
          <div className={styles.paymentMethod}>
            <div className={styles.paymentMethodInfo}>
              <div className={styles.paymentMethodIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </div>
              <div className={styles.paymentMethodDetails}>
                <p className={styles.paymentMethodName}>Mastercard ending in 8888</p>
                <p className={styles.paymentMethodExpiry}>Expires 04/2026</p>
              </div>
            </div>
            <div className={styles.paymentMethodActions}>
              <button className={styles.textButton}>Set as default</button>
              <button className={styles.textButton}>Remove</button>
            </div>
          </div>
        </div>
        
        <button className={styles.secondaryButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Payment Method
        </button>
      </div>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Billing Preferences</h4>
        <div className={styles.formGroup}>
          <div className={styles.checkboxOption}>
            <input 
              type="checkbox" 
              id="savePaymentInfo" 
              name="savePaymentInfo" 
              checked={settings.savePaymentInfo} 
              onChange={handleCheckboxChange}
            />
            <label htmlFor="savePaymentInfo">
              <span className={styles.optionTitle}>Save payment information</span>
              <span className={styles.optionDescription}>Securely store your payment information for faster checkout</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className={styles.formSection}>
        <h4 className={styles.subsectionTitle}>Billing History</h4>
        <div className={styles.billingHistory}>
          <div className={styles.billingHistoryHeader}>
            <span>Date</span>
            <span>Description</span>
            <span>Amount</span>
            <span>Receipt</span>
          </div>
          
          <div className={styles.billingHistoryItem}>
            <span>Apr 1, 2025</span>
            <span>Premium Subscription - Monthly</span>
            <span>$14.99</span>
            <button className={styles.textButton}>Download</button>
          </div>
          
          <div className={styles.billingHistoryItem}>
            <span>Mar 1, 2025</span>
            <span>Premium Subscription - Monthly</span>
            <span>$14.99</span>
            <button className={styles.textButton}>Download</button>
          </div>
          
          <div className={styles.billingHistoryItem}>
            <span>Feb 1, 2025</span>
            <span>Premium Subscription - Monthly</span>
            <span>$14.99</span>
            <button className={styles.textButton}>Download</button>
          </div>
        </div>
      </div>
      
      <div className={styles.formActions}>
        <button className={styles.primaryButton} onClick={saveSettings}>
          Save Changes
        </button>
      </div>
    </div>
  );

  // Render danger zone settings
  const renderDangerZone = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>Danger Zone</h3>
      <p className={styles.sectionDescription}>
        Actions that can't be undone or require additional confirmation.
      </p>
      
      <div className={styles.dangerZoneSection}>
        <div className={styles.dangerZoneItem}>
          <div className={styles.dangerZoneInfo}>
            <h4>Require Two-Factor Authentication</h4>
            <p>Require two-factor authentication for all logins to this account</p>
          </div>
          <div className={styles.dangerZoneAction}>
            <label className={styles.toggleSwitch}>
              <input 
                type="checkbox" 
                name="twoFactorRequired" 
                checked={settings.twoFactorRequired} 
                onChange={handleCheckboxChange}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
        
        <div className={styles.dangerZoneItem}>
          <div className={styles.dangerZoneInfo}>
            <h4>Export Your Data</h4>
            <p>Download all your personal data and activity from NomadDesk</p>
          </div>
          <div className={styles.dangerZoneAction}>
            <button className={styles.secondaryButton}>
              Export Data
            </button>
          </div>
        </div>
        
        <div className={styles.dangerZoneItem}>
          <div className={styles.dangerZoneInfo}>
            <h4>Delete Your Account</h4>
            <p>Permanently delete your account and all associated data</p>
          </div>
          <div className={styles.dangerZoneAction}>
            <button className={styles.dangerButton}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render help & support
  const renderHelp = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>Help & Support</h3>
      <p className={styles.sectionDescription}>
        Get help with your account or contact our support team.
      </p>
      
      <div className={styles.supportOptions}>
        <div className={styles.supportCard}>
          <div className={styles.supportCardIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <h4>Help Center</h4>
          <p>Find answers to frequently asked questions and step-by-step guides.</p>
          <button className={styles.secondaryButton}>
            Visit Help Center
          </button>
        </div>
        
        <div className={styles.supportCard}>
          <div className={styles.supportCardIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </div>
          <h4>Contact Support</h4>
          <p>Get in touch with our support team for personalized assistance.</p>
          <button className={styles.secondaryButton}>
            Contact Support
          </button>
        </div>
        
        <div className={styles.supportCard}>
          <div className={styles.supportCardIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </div>
          <h4>Community</h4>
          <p>Join the NomadDesk community to connect with other users and share experiences.</p>
          <button className={styles.secondaryButton}>
            Join Community
          </button>
        </div>
      </div>
      
      <div className={styles.appInfo}>
        <h4>About NomadDesk</h4>
        <div className={styles.appInfoItem}>
          <span>Version</span>
          <span>2.1.4</span>
        </div>
        <div className={styles.appInfoItem}>
          <span>Terms of Service</span>
          <a href="#" className={styles.linkText}>View</a>
        </div>
        <div className={styles.appInfoItem}>
          <span>Privacy Policy</span>
          <a href="#" className={styles.linkText}>View</a>
        </div>
        <div className={styles.appInfoItem}>
          <span>Open Source Licenses</span>
          <a href="#" className={styles.linkText}>View</a>
        </div>
      </div>
    </div>
  );

  // Determine which content to render based on active section
  const renderContent = () => {
    switch(activeSection) {
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'preferences':
        return renderPreferenceSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'danger':
        return renderDangerZone();
      case 'help':
        return renderHelp();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <h1 className={styles.settingsTitle}>Settings</h1>
        <p className={styles.settingsDescription}>
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className={styles.settingsBody}>
        <div className={styles.settingsSidebar}>
          <div className={styles.sidebarNav}>
            <button
              className={`${styles.navButton} ${activeSection === 'account' ? styles.activeNavButton : ''}`}
              onClick={() => setActiveSection('account')}
            >
              <AccountIcon />
              <span>Account</span>
            </button>
            <button
              className={`${styles.navButton} ${activeSection === 'security' ? styles.activeNavButton : ''}`}
              onClick={() => setActiveSection('security')}
            >
              <SecurityIcon />
              <span>Security</span>
            </button>
            <button
              className={`${styles.navButton} ${activeSection === 'notifications' ? styles.activeNavButton : ''}`}
              onClick={() => setActiveSection('notifications')}
            >
              <NotificationIcon />
              <span>Notifications</span>
            </button>
            <button
              className={`${styles.navButton} ${activeSection === 'privacy' ? styles.activeNavButton : ''}`}
              onClick={() => setActiveSection('privacy')}
            >
              <PrivacyIcon />
              <span>Privacy</span>
            </button>
            <button
              className={`${styles.navButton} ${activeSection === 'preferences' ? styles.activeNavButton : ''}`}
              onClick={() => setActiveSection('preferences')}
            >
              <PreferencesIcon />
              <span>Preferences</span>
            </button>
            <button
              className={`${styles.navButton} ${activeSection === 'payment' ? styles.activeNavButton : ''}`}
              onClick={() => setActiveSection('payment')}
            >
              <PaymentIcon />
              <span>Payment Methods</span>
            </button>
            <button
              className={`${styles.navButton} ${activeSection === 'danger' ? styles.activeNavButton : ''}`}
              onClick={() => setActiveSection('danger')}
            >
              <DangerIcon />
              <span>Danger Zone</span>
            </button>
            <button
              className={`${styles.navButton} ${activeSection === 'help' ? styles.activeNavButton : ''}`}
              onClick={() => setActiveSection('help')}
            >
              <HelpIcon />
              <span>Help & Support</span>
            </button>
          </div>
        </div>
        
        <div className={styles.settingsContent}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;