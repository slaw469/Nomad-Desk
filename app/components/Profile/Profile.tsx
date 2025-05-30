// app/components/Profile/Profile.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles/profile.module.css';
import {
  profileService, UserProfile, Education, StudyPreferences,
} from '../../services/profileService';
import { networkService, Connection, ConnectionRequest } from '../../services/networkService';
import { bookingService, Booking } from '../../services/bookingService';
import Loading from '../Common/Loading';

// Import all icons
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
  CameraIcon,
  CheckIcon,
  XIcon,
  PlusIcon,
  GlobeIcon,
  SettingsIcon,
  MessageIcon,
} from './ProfileIcons';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('info');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Profile data states
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formProfile, setFormProfile] = useState<Partial<UserProfile>>({});

  // Network data states
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [suggestedConnections, setSuggestedConnections] = useState<Connection[]>([]);
  const [networkStats, setNetworkStats] = useState<{
    totalConnections: number;
    pendingRequests: number;
    mutualConnections: Record<string, number>;
  }>({ totalConnections: 0, pendingRequests: 0, mutualConnections: {} });

  // Booking data states
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    upcoming: 0,
    past: 0,
    cancelled: 0,
  });

  // Loading states for individual actions
  const [connectingUsers, setConnectingUsers] = useState<Set<string>>(new Set());
  const [respondingToRequests, setRespondingToRequests] = useState<Set<string>>(new Set());

  // Fetch all profile data
  useEffect(() => {
    fetchAllProfileData();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchAllProfileData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [
        profileData,
        connectionsData,
        requestsData,
        suggestedData,
        networkStatsData,
        upcomingBookingsData,
        pastBookingsData,
        bookingStatsData,
      ] = await Promise.all([
        profileService.getCurrentProfile(),
        networkService.getConnections(),
        networkService.getConnectionRequests(),
        networkService.getSuggestedConnections(),
        networkService.getConnectionStats(),
        bookingService.getUpcomingBookings(),
        bookingService.getPastBookings(),
        bookingService.getBookingStats(),
      ]);

      setProfile(profileData);
      setFormProfile(profileData);
      setConnections(connectionsData);
      setConnectionRequests(requestsData);
      setSuggestedConnections(suggestedData);
      setNetworkStats(networkStatsData);
      setUpcomingBookings(upcomingBookingsData);
      setPastBookings(pastBookingsData);
      setBookingStats(bookingStatsData);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // Handle profile save
  const handleSaveProfile = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updatedProfile = await profileService.updateProfile(formProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setFormProfile(profile || {});
    setIsEditing(false);
    setError(null);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormProfile({
        ...formProfile,
        [parent]: {
          ...((formProfile as any)[parent] || {}),
          [child]: value,
        },
      });
    } else {
      setFormProfile({
        ...formProfile,
        [name]: value,
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (name.startsWith('preferences.')) {
      const preferenceName = name.split('.')[1];
      setFormProfile({
        ...formProfile,
        preferences: {
          ...formProfile.preferences,
          [preferenceName]: checked,
        },
      });
    }
  };

  // Handle interests
  const handleInterestChange = (interest: string) => {
    const currentInterests = formProfile.interests || [];

    if (currentInterests.includes(interest)) {
      setFormProfile({
        ...formProfile,
        interests: currentInterests.filter((i) => i !== interest),
      });
    } else {
      setFormProfile({
        ...formProfile,
        interests: [...currentInterests, interest],
      });
    }
  };

  // Handle skills
  const handleSkillChange = (skill: string) => {
    const currentSkills = formProfile.skills || [];

    if (currentSkills.includes(skill)) {
      setFormProfile({
        ...formProfile,
        skills: currentSkills.filter((s) => s !== skill),
      });
    } else {
      setFormProfile({
        ...formProfile,
        skills: [...currentSkills, skill],
      });
    }
  };

  // Handle education
  const addEducation = () => {
    const currentEducation = formProfile.education || [];
    const newEducation: Education = {
      institution: '',
      degree: '',
      field: '',
      startYear: new Date().getFullYear(),
      current: true,
    };

    setFormProfile({
      ...formProfile,
      education: [...currentEducation, newEducation],
    });
  };

  const removeEducation = (index: number) => {
    const currentEducation = formProfile.education || [];
    setFormProfile({
      ...formProfile,
      education: currentEducation.filter((_, i) => i !== index),
    });
  };

  const updateEducation = (index: number, field: string, value: string | number | boolean) => {
    const currentEducation = formProfile.education || [];
    const updatedEducation = [...currentEducation];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };

    setFormProfile({
      ...formProfile,
      education: updatedEducation,
    });
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploadingAvatar(true);
    setError(null);

    try {
      const result = await profileService.uploadAvatar(file);
      setProfile((prev) => (prev ? { ...prev, avatar: result.avatarUrl } : null));
      setFormProfile((prev) => ({ ...prev, avatar: result.avatarUrl }));
      setSuccessMessage('Avatar updated successfully!');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle study preferences
  const updateStudyPreferences = (field: keyof StudyPreferences, value: any) => {
    setFormProfile({
      ...formProfile,
      preferences: {
        ...formProfile.preferences,
        studyPreferences: {
          preferredEnvironments: [],
          noiseLevel: 'quiet' as const,
          preferredTimes: [],
          groupSize: 'small' as const,
          ...formProfile.preferences?.studyPreferences,
          [field]: value,
        } as StudyPreferences,
      },
    });
  };

  // Network actions
  const handleSendConnectionRequest = async (userId: string) => {
    setConnectingUsers((prev) => new Set(prev).add(userId));

    try {
      await networkService.sendConnectionRequest(userId);
      setSuccessMessage('Connection request sent!');
      // Refresh suggested connections
      const newSuggested = await networkService.getSuggestedConnections();
      setSuggestedConnections(newSuggested);
    } catch (err) {
      setError('Failed to send connection request');
    } finally {
      setConnectingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    setRespondingToRequests((prev) => new Set(prev).add(requestId));

    try {
      await networkService.acceptRequest(requestId);
      setSuccessMessage('Connection request accepted!');
      // Refresh data
      await fetchAllProfileData();
    } catch (err) {
      setError('Failed to accept connection request');
    } finally {
      setRespondingToRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setRespondingToRequests((prev) => new Set(prev).add(requestId));

    try {
      await networkService.rejectRequest(requestId);
      // Refresh data
      const newRequests = connectionRequests.filter((req) => req.id !== requestId);
      setConnectionRequests(newRequests);
    } catch (err) {
      setError('Failed to reject connection request');
    } finally {
      setRespondingToRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  // Get user initials
  const getUserInitials = () => {
    if (!profile?.name) return user?.name?.charAt(0).toUpperCase() || 'U';

    const nameParts = profile.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  // Format date
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Format time
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Render user info form
  const renderUserInfoForm = () => (
    <form className={styles.editForm} onSubmit={(e) => e.preventDefault()}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formProfile.name || ''}
          onChange={handleInputChange}
          placeholder="Enter your full name"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formProfile.email || ''}
          disabled
          className={styles.disabledInput}
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
          placeholder="e.g., Software Engineer, Designer, Student"
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
          placeholder="City, State/Country"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="timezone">Timezone</label>
        <select
          id="timezone"
          name="timezone"
          value={formProfile.timezone || ''}
          onChange={handleInputChange}
        >
          <option value="">Select Timezone</option>
          <option value="PST (UTC-8)">PST (UTC-8)</option>
          <option value="MST (UTC-7)">MST (UTC-7)</option>
          <option value="CST (UTC-6)">CST (UTC-6)</option>
          <option value="EST (UTC-5)">EST (UTC-5)</option>
          <option value="GMT (UTC+0)">GMT (UTC+0)</option>
          <option value="CET (UTC+1)">CET (UTC+1)</option>
          <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
          <option value="JST (UTC+9)">JST (UTC+9)</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          value={formProfile.bio || ''}
          onChange={handleInputChange}
          placeholder="Tell us about yourself..."
          rows={4}
          maxLength={500}
        />
        <span className={styles.charCount}>
          {(formProfile.bio || '').length}
          /500
        </span>
      </div>

      {/* Education Section */}
      <div className={styles.formSection}>
        <h4>Education</h4>
        {(formProfile.education || []).map((edu, idx) => (
          <div key={idx} className={styles.educationEntry}>
            <div className={styles.educationHeader}>
              <h5>
                Education #
                {idx + 1}
              </h5>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeEducation(idx)}
                title="Remove education"
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
                placeholder="University/College name"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor={`edu-degree-${idx}`}>Degree</label>
                <select
                  id={`edu-degree-${idx}`}
                  value={edu.degree}
                  onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                >
                  <option value="">Select Degree</option>
                  <option value="High School">High School</option>
                  <option value="Associate">Associate</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">PhD</option>
                  <option value="Certificate">Certificate</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={`edu-field-${idx}`}>Field of Study</label>
                <input
                  type="text"
                  id={`edu-field-${idx}`}
                  value={edu.field}
                  onChange={(e) => updateEducation(idx, 'field', e.target.value)}
                  placeholder="e.g., Computer Science"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor={`edu-start-${idx}`}>Start Year</label>
                <input
                  type="number"
                  id={`edu-start-${idx}`}
                  value={edu.startYear}
                  onChange={(e) => updateEducation(idx, 'startYear', parseInt(e.target.value))}
                  min="1950"
                  max={new Date().getFullYear()}
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
                    min={edu.startYear}
                    max={new Date().getFullYear() + 10}
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
              <label htmlFor={`edu-current-${idx}`}>Currently studying here</label>
            </div>
          </div>
        ))}

        <button
          type="button"
          className={styles.addButton}
          onClick={addEducation}
        >
          <PlusIcon />
          {' '}
          Add Education
        </button>
      </div>

      {/* Interests Section */}
      <div className={styles.formSection}>
        <h4>Interests</h4>
        <p className={styles.sectionDescription}>Select your interests to connect with like-minded people</p>
        <div className={styles.tagsGrid}>
          {['Design', 'Development', 'Marketing', 'Business', 'Education',
            'Remote Work', 'Productivity', 'Writing', 'Entrepreneurship',
            'Science', 'Technology', 'Math', 'Literature', 'Art',
            'Music', 'Languages', 'Photography', 'Travel', 'Cooking'].map((interest) => (
              <label key={interest} className={styles.tagOption}>
                <input
                  type="checkbox"
                  checked={(formProfile.interests || []).includes(interest)}
                  onChange={() => handleInterestChange(interest)}
                />
                <span>{interest}</span>
              </label>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div className={styles.formSection}>
        <h4>Skills</h4>
        <p className={styles.sectionDescription}>Add your professional skills</p>
        <div className={styles.tagsGrid}>
          {['JavaScript', 'Python', 'React', 'Node.js', 'UI/UX Design',
            'Project Management', 'Data Analysis', 'Marketing', 'Sales',
            'Communication', 'Leadership', 'Problem Solving', 'Teamwork',
            'Time Management', 'Critical Thinking'].map((skill) => (
              <label key={skill} className={styles.tagOption}>
                <input
                  type="checkbox"
                  checked={(formProfile.skills || []).includes(skill)}
                  onChange={() => handleSkillChange(skill)}
                />
                <span>{skill}</span>
              </label>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className={styles.formSection}>
        <h4>Social Links</h4>
        <div className={styles.formGroup}>
          <label htmlFor="linkedin">LinkedIn</label>
          <input
            type="url"
            id="linkedin"
            name="socialLinks.linkedin"
            value={formProfile.socialLinks?.linkedin || ''}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="twitter">Twitter</label>
          <input
            type="url"
            id="twitter"
            name="socialLinks.twitter"
            value={formProfile.socialLinks?.twitter || ''}
            onChange={handleInputChange}
            placeholder="https://twitter.com/yourhandle"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="github">GitHub</label>
          <input
            type="url"
            id="github"
            name="socialLinks.github"
            value={formProfile.socialLinks?.github || ''}
            onChange={handleInputChange}
            placeholder="https://github.com/yourusername"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="website">Personal Website</label>
          <input
            type="url"
            id="website"
            name="socialLinks.website"
            value={formProfile.socialLinks?.website || ''}
            onChange={handleInputChange}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      {/* Study Preferences */}
      <div className={styles.formSection}>
        <h4>Study Preferences</h4>

        <div className={styles.formGroup}>
          <label>Preferred Environments</label>
          <div className={styles.checkboxGroup}>
            {['library', 'cafe', 'coworking', 'home', 'outdoors'].map((env) => (
              <label key={env} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={(formProfile.preferences?.studyPreferences?.preferredEnvironments || []).includes(env)}
                  onChange={(e) => {
                    const current = formProfile.preferences?.studyPreferences?.preferredEnvironments || [];
                    const updated = e.target.checked
                      ? [...current, env]
                      : current.filter((e) => e !== env);
                    updateStudyPreferences('preferredEnvironments', updated);
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
            value={formProfile.preferences?.studyPreferences?.noiseLevel || 'quiet'}
            onChange={(e) => updateStudyPreferences('noiseLevel', e.target.value)}
          >
            <option value="silent">Silent</option>
            <option value="quiet">Quiet</option>
            <option value="moderate">Moderate</option>
            <option value="lively">Lively</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Preferred Times</label>
          <div className={styles.checkboxGroup}>
            {['morning', 'afternoon', 'evening', 'night'].map((time) => (
              <label key={time} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={(formProfile.preferences?.studyPreferences?.preferredTimes || []).includes(time)}
                  onChange={(e) => {
                    const current = formProfile.preferences?.studyPreferences?.preferredTimes || [];
                    const updated = e.target.checked
                      ? [...current, time]
                      : current.filter((t) => t !== time);
                    updateStudyPreferences('preferredTimes', updated);
                  }}
                />
                <span>{time.charAt(0).toUpperCase() + time.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="groupSize">Preferred Group Size</label>
          <select
            id="groupSize"
            value={formProfile.preferences?.studyPreferences?.groupSize || 'small'}
            onChange={(e) => updateStudyPreferences('groupSize', e.target.value)}
          >
            <option value="solo">Solo</option>
            <option value="small">Small (2-4)</option>
            <option value="medium">Medium (5-8)</option>
            <option value="large">Large (9+)</option>
          </select>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className={styles.formSection}>
        <h4>Privacy Settings</h4>
        <div className={styles.privacySettings}>
          <label className={styles.switchLabel}>
            <input
              type="checkbox"
              name="preferences.privateProfile"
              checked={formProfile.preferences?.privateProfile || false}
              onChange={handleCheckboxChange}
            />
            <span className={styles.switch} />
            <span>Make my profile private</span>
          </label>

          <label className={styles.switchLabel}>
            <input
              type="checkbox"
              name="preferences.emailNotifications"
              checked={formProfile.preferences?.emailNotifications || false}
              onChange={handleCheckboxChange}
            />
            <span className={styles.switch} />
            <span>Email notifications</span>
          </label>

          <label className={styles.switchLabel}>
            <input
              type="checkbox"
              name="preferences.pushNotifications"
              checked={formProfile.preferences?.pushNotifications || false}
              onChange={handleCheckboxChange}
            />
            <span className={styles.switch} />
            <span>Push notifications</span>
          </label>
        </div>
      </div>
    </form>
  );

  // Render user info view
  const renderUserInfo = () => (
    <div className={styles.userInfoContainer}>
      <div className={styles.infoSection}>
        <h3 className={styles.infoSectionTitle}>Personal Information</h3>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>
              <UserIcon />
              <span>Full Name</span>
            </div>
            <div className={styles.infoValue}>{profile?.name || 'Not provided'}</div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Email</span>
            </div>
            <div className={styles.infoValue}>{profile?.email || 'Not provided'}</div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>
              <BriefcaseIcon />
              <span>Profession</span>
            </div>
            <div className={styles.infoValue}>{profile?.profession || 'Not provided'}</div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>
              <LocationIcon />
              <span>Location</span>
            </div>
            <div className={styles.infoValue}>{profile?.location || 'Not provided'}</div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>
              <ClockIcon />
              <span>Timezone</span>
            </div>
            <div className={styles.infoValue}>{profile?.timezone || 'Not provided'}</div>
          </div>
        </div>

        <div className={styles.bioSection}>
          <div className={styles.infoLabel}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Bio</span>
          </div>
          <div className={styles.bioText}>{profile?.bio || 'No bio provided'}</div>
        </div>
      </div>

      {profile?.education && profile.education.length > 0 && (
        <div className={styles.infoSection}>
          <h3 className={styles.infoSectionTitle}>Education</h3>
          <div className={styles.educationList}>
            {profile.education.map((edu, index) => (
              <div key={index} className={styles.educationCard}>
                <div className={styles.educationIcon}>
                  <GraduationCapIcon />
                </div>
                <div className={styles.educationContent}>
                  <h4>
                    {edu.degree}
                    {' '}
                    in
                    {' '}
                    {edu.field}
                  </h4>
                  <p className={styles.institution}>{edu.institution}</p>
                  <p className={styles.duration}>
                    {edu.startYear}
                    {' '}
                    -
                    {edu.current ? 'Present' : edu.endYear}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.tagsSection}>
        {profile?.interests && profile.interests.length > 0 && (
          <div className={styles.tagGroup}>
            <h3 className={styles.tagGroupTitle}>
              <TagIcon />
              Interests
            </h3>
            <div className={styles.tagsList}>
              {profile.interests.map((interest, index) => (
                <span key={index} className={styles.tag}>{interest}</span>
              ))}
            </div>
          </div>
        )}

        {profile?.skills && profile.skills.length > 0 && (
          <div className={styles.tagGroup}>
            <h3 className={styles.tagGroupTitle}>
              <StarIcon />
              Skills
            </h3>
            <div className={styles.tagsList}>
              {profile.skills.map((skill, index) => (
                <span key={index} className={`${styles.tag} ${styles.skillTag}`}>{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {profile?.socialLinks && Object.values(profile.socialLinks).some((link) => link) && (
        <div className={styles.infoSection}>
          <h3 className={styles.infoSectionTitle}>Connect Online</h3>
          <div className={styles.socialLinksGrid}>
            {profile.socialLinks.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLinkCard}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span>LinkedIn</span>
              </a>
            )}

            {profile.socialLinks.twitter && (
              <a
                href={profile.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLinkCard}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
                <span>Twitter</span>
              </a>
            )}

            {profile.socialLinks.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLinkCard}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                <span>GitHub</span>
              </a>
            )}

            {profile.socialLinks.website && (
              <a
                href={profile.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLinkCard}
              >
                <GlobeIcon />
                <span>Website</span>
              </a>
            )}
          </div>
        </div>
      )}

      {profile?.preferences?.studyPreferences && (
        <div className={styles.infoSection}>
          <h3 className={styles.infoSectionTitle}>Study Preferences</h3>
          <div className={styles.preferencesGrid}>
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceLabel}>Environments:</span>
              <span className={styles.preferenceValue}>
                {profile.preferences.studyPreferences.preferredEnvironments?.join(', ') || 'Any'}
              </span>
            </div>
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceLabel}>Noise Level:</span>
              <span className={styles.preferenceValue}>
                {profile.preferences.studyPreferences.noiseLevel || 'Quiet'}
              </span>
            </div>
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceLabel}>Preferred Times:</span>
              <span className={styles.preferenceValue}>
                {profile.preferences.studyPreferences.preferredTimes?.join(', ') || 'Flexible'}
              </span>
            </div>
            <div className={styles.preferenceItem}>
              <span className={styles.preferenceLabel}>Group Size:</span>
              <span className={styles.preferenceValue}>
                {profile.preferences.studyPreferences.groupSize || 'Solo'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render network section
  const renderNetwork = () => (
    <div className={styles.networkContainer}>
      <div className={styles.networkStats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <NetworkIcon />
          </div>
          <div className={styles.statContent}>
            <h3>{networkStats.totalConnections}</h3>
            <p>Connections</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>{networkStats.pendingRequests}</h3>
            <p>Pending Requests</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BookmarkIcon />
          </div>
          <div className={styles.statContent}>
            <h3>{upcomingBookings.length}</h3>
            <p>Upcoming Sessions</p>
          </div>
        </div>
      </div>

      {connectionRequests.length > 0 && (
        <div className={styles.networkSection}>
          <div className={styles.sectionHeader}>
            <h3>Connection Requests</h3>
            <span className={styles.badge}>{connectionRequests.length}</span>
          </div>

          <div className={styles.requestsList}>
            {connectionRequests.map((request) => (
              <div key={request.id} className={styles.requestCard}>
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    {request.sender.avatar ? (
                      <img src={request.sender.avatar} alt={request.sender.name} />
                    ) : (
                      <span>{request.sender.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className={styles.userDetails}>
                    <h4>{request.sender.name}</h4>
                    <p>{request.sender.profession || 'No profession listed'}</p>
                    {request.mutualConnections && request.mutualConnections > 0 && (
                      <span className={styles.mutualInfo}>
                        {request.mutualConnections}
                        {' '}
                        mutual connections
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.requestActions}>
                  <button
                    className={`${styles.actionButton} ${styles.acceptButton}`}
                    onClick={() => handleAcceptRequest(request.id)}
                    disabled={respondingToRequests.has(request.id)}
                  >
                    {respondingToRequests.has(request.id) ? (
                      <Loading message="" />
                    ) : (
                      <>
                        <CheckIcon />
                        Accept
                      </>
                    )}
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.rejectButton}`}
                    onClick={() => handleRejectRequest(request.id)}
                    disabled={respondingToRequests.has(request.id)}
                  >
                    {respondingToRequests.has(request.id) ? (
                      <Loading message="" />
                    ) : (
                      <>
                        <XIcon />
                        Decline
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.networkSection}>
        <div className={styles.sectionHeader}>
          <h3>My Connections</h3>
          {connections.length > 0 && (
            <Link to="/network" className={styles.viewAllLink}>View All</Link>
          )}
        </div>

        {connections.length > 0 ? (
          <div className={styles.connectionsGrid}>
            {connections.slice(0, 6).map((connection) => (
              <div key={connection.id} className={styles.connectionCard}>
                <div className={styles.connectionAvatar}>
                  {connection.user.avatar ? (
                    <img src={connection.user.avatar} alt={connection.user.name} />
                  ) : (
                    <span>{connection.user.name.charAt(0)}</span>
                  )}
                </div>
                <h4>{connection.user.name}</h4>
                <p>{connection.user.profession || 'No profession'}</p>
                <Link
                  to="/messages/$userId"
                  params={{ userId: connection.user.id }}
                  className={styles.messageButton}
                >
                  <MessageIcon />
                  Message
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <NetworkIcon size={48} />
            <p>You don't have any connections yet</p>
            <Link to="/network" className={styles.primaryButton}>
              Find People to Connect
            </Link>
          </div>
        )}
      </div>

      {suggestedConnections.length > 0 && (
        <div className={styles.networkSection}>
          <div className={styles.sectionHeader}>
            <h3>Suggested Connections</h3>
            <Link to="/network" className={styles.viewAllLink}>See More</Link>
          </div>

          <div className={styles.suggestionsGrid}>
            {suggestedConnections.slice(0, 3).map((suggestion) => (
              <div key={suggestion.id} className={styles.suggestionCard}>
                <div className={styles.suggestionAvatar}>
                  {suggestion.user.avatar ? (
                    <img src={suggestion.user.avatar} alt={suggestion.user.name} />
                  ) : (
                    <span>{suggestion.user.name.charAt(0)}</span>
                  )}
                </div>
                <h4>{suggestion.user.name}</h4>
                <p>{suggestion.user.profession || 'No profession'}</p>
                {suggestion.mutualConnections && suggestion.mutualConnections > 0 && (
                  <span className={styles.mutualBadge}>
                    {suggestion.mutualConnections}
                    {' '}
                    mutual
                  </span>
                )}
                <button
                  className={styles.connectButton}
                  onClick={() => handleSendConnectionRequest(suggestion.user.id)}
                  disabled={connectingUsers.has(suggestion.user.id)}
                >
                  {connectingUsers.has(suggestion.user.id) ? (
                    <Loading message="" />
                  ) : (
                    <>
                      <PlusIcon />
                      Connect
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Render sessions section
  const renderSessions = () => {
    const currentTab = activeTab === 'past-sessions' ? 'past' : 'upcoming';
    const displayBookings = currentTab === 'past' ? pastBookings : upcomingBookings;

    return (
      <div className={styles.sessionsContainer}>
        <div className={styles.sessionsTabs}>
          <button
            className={`${styles.sessionTab} ${activeTab === 'upcoming-sessions' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('upcoming-sessions')}
          >
            Upcoming (
            {upcomingBookings.length}
            )
          </button>
          <button
            className={`${styles.sessionTab} ${activeTab === 'past-sessions' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('past-sessions')}
          >
            Past (
            {pastBookings.length}
            )
          </button>
        </div>

        {displayBookings.length > 0 ? (
          <div className={styles.bookingsGrid}>
            {displayBookings.map((booking) => (
              <div key={booking.id} className={styles.bookingCard}>
                <div className={styles.bookingImage}>
                  <img
                    src={booking.workspace.photo || 'http://localhost:5003/api/placeholder/300/200'}
                    alt={booking.workspace.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'http://localhost:5003/api/placeholder/300/200';
                    }}
                  />
                  <div className={styles.bookingType}>{booking.workspace.type}</div>
                </div>

                <div className={styles.bookingContent}>
                  <h4>{booking.workspace.name}</h4>
                  <div className={styles.bookingDetails}>
                    <div className={styles.bookingDetail}>
                      <CalendarIcon />
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    <div className={styles.bookingDetail}>
                      <ClockIcon />
                      <span>
                        {formatTime(booking.startTime)}
                        {' '}
                        -
                        {' '}
                        {formatTime(booking.endTime)}
                      </span>
                    </div>
                    <div className={styles.bookingDetail}>
                      <LocationIcon />
                      <span>{booking.workspace.address}</span>
                    </div>
                  </div>

                  <div className={styles.bookingMeta}>
                    <span className={styles.roomType}>{booking.roomType}</span>
                    {booking.numberOfPeople > 1 && (
                      <span className={styles.peopleCount}>
                        {booking.numberOfPeople}
                        {' '}
                        people
                      </span>
                    )}
                  </div>

                  <div className={styles.bookingActions}>
                    {currentTab === 'upcoming' ? (
                      <>
                        <Link
                          to="/workspaces/map/$placeId"
                          params={{ placeId: booking.workspace.id }}
                          className={`${styles.actionButton} ${styles.primaryButton}`}
                        >
                          View Details
                        </Link>
                        <button
                          className={`${styles.actionButton} ${styles.dangerButton}`}
                          onClick={() => bookingService.cancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/workspaces/map/$placeId"
                          params={{ placeId: booking.workspace.id }}
                          className={`${styles.actionButton} ${styles.primaryButton}`}
                        >
                          Book Again
                        </Link>
                        {!booking.review && (
                          <button className={`${styles.actionButton} ${styles.secondaryButton}`}>
                            Leave Review
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <CalendarIcon size={48} />
            <p>
              {currentTab === 'upcoming'
                ? "You don't have any upcoming bookings"
                : "You haven't made any bookings yet"}
            </p>
            <Link to="/search" className={styles.primaryButton}>
              Find Workspaces
            </Link>
          </div>
        )}
      </div>
    );
  };

  // Determine content to render
  const renderContent = () => {
    switch (activeTab) {
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

  if (loading && !profile) {
    return <Loading message="Loading profile..." fullScreen />;
  }

  return (
    <div className={styles.profileContainer}>
      {/* Header with back button */}
      <div className={styles.profileTopBar}>
        <button
          className={styles.backButton}
          onClick={() => navigate({ to: '/dashboard' })}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Dashboard
        </button>

        <div className={styles.profileBreadcrumb}>
          <Link to="/dashboard" className={styles.breadcrumbLink}>Dashboard</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span>My Profile</span>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className={styles.successMessage}>
          <CheckIcon />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          <XIcon />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.profileBanner}>
          <div className={styles.bannerGradient} />
        </div>

        <div className={styles.profileHeaderContent}>
          <div className={styles.profileAvatarSection}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                {uploadingAvatar && (
                  <div className={styles.avatarLoading}>
                    <Loading message="" />
                  </div>
                )}
                {profile?.avatar ? (
                  <img src={profile.avatar} alt={profile.name} />
                ) : (
                  <span>{getUserInitials()}</span>
                )}
              </div>
              <label htmlFor="avatar-upload" className={styles.avatarUploadButton}>
                <CameraIcon />
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </label>
            </div>

            <div className={styles.profileBasicInfo}>
              <h1>{profile?.name || user?.name}</h1>
              <p className={styles.profession}>{profile?.profession || 'Add your profession'}</p>
              <div className={styles.locationBadge}>
                <LocationIcon />
                <span>{profile?.location || 'Add your location'}</span>
              </div>
            </div>
          </div>

          <div className={styles.profileActions}>
            {isEditing ? (
              <>
                <button
                  className={`${styles.actionButton} ${styles.saveButton}`}
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? <Loading message="" /> : <CheckIcon />}
                  Save Changes
                </button>
                <button
                  className={`${styles.actionButton} ${styles.cancelButton}`}
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  <XIcon />
                  Cancel
                </button>
              </>
            ) : (
              <button
                className={`${styles.actionButton} ${styles.editButton}`}
                onClick={() => setIsEditing(true)}
              >
                <EditIcon />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Body */}
      <div className={styles.profileBody}>
        {/* Sidebar */}
        <div className={styles.profileSidebar}>
          <nav className={styles.profileNav}>
            <button
              className={`${styles.navItem} ${activeTab === 'info' ? styles.activeNav : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <UserIcon />
              <span>Personal Info</span>
            </button>

            <button
              className={`${styles.navItem} ${activeTab === 'network' ? styles.activeNav : ''}`}
              onClick={() => setActiveTab('network')}
            >
              <NetworkIcon />
              <span>My Network</span>
              {networkStats.pendingRequests > 0 && (
                <span className={styles.navBadge}>{networkStats.pendingRequests}</span>
              )}
            </button>

            <button
              className={`${styles.navItem} ${
                ['sessions', 'upcoming-sessions', 'past-sessions'].includes(activeTab) ? styles.activeNav : ''
              }`}
              onClick={() => setActiveTab('upcoming-sessions')}
            >
              <CalendarIcon />
              <span>Bookings</span>
            </button>

            <Link to="/favorites" className={styles.navItem}>
              <BookmarkIcon />
              <span>Favorites</span>
            </Link>

            <Link to="/settings" className={styles.navItem}>
              <SettingsIcon />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Profile Completion */}
          <div className={styles.profileCompletion}>
            <h4>Profile Strength</h4>
            <div className={styles.completionBar}>
              <div
                className={styles.completionProgress}
                style={{ width: '75%' }}
              />
            </div>
            <p>Your profile is 75% complete</p>
          </div>

          {/* Quick Stats */}
          <div className={styles.quickStats}>
            <div className={styles.quickStat}>
              <span className={styles.quickStatValue}>{bookingStats.total}</span>
              <span className={styles.quickStatLabel}>Total Bookings</span>
            </div>
            <div className={styles.quickStat}>
              <span className={styles.quickStatValue}>{networkStats.totalConnections}</span>
              <span className={styles.quickStatLabel}>Connections</span>
            </div>
            <div className={styles.quickStat}>
              <span className={styles.quickStatValue}>
                {profile?.interests?.length || 0}
              </span>
              <span className={styles.quickStatLabel}>Interests</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.profileMain}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <Loading message="Loading..." />
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
