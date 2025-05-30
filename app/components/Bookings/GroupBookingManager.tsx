// app/components/Bookings/GroupBookingManager.tsx - GROUP BOOKING MANAGEMENT COMPONENT

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { groupBookingService } from '../../services/bookingService';
import { 
  GroupBooking, 
  GroupParticipantsResponse, 
  GroupBookingStats,
  GroupInvitationRequest 
} from '../../types/groupBooking';
import Loading from '../Common/Loading';
import BackButton from '../Common/BackButton';
import styles from './GroupBookingManager.module.css';
import Modal from '../Common/Modal';

const GroupBookingManager: React.FC = () => {
  // Fix: Use 'groupId' instead of 'id' to match the router parameter
  const { groupId } = useParams({ strict: false });
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState<GroupBooking | null>(null);
  const [participants, setParticipants] = useState<GroupParticipantsResponse | null>(null);
  const [stats, setStats] = useState<GroupBookingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'participants' | 'invites' | 'settings'>('overview');
  
  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  
  // Mock current user ID - in real app this would come from auth context
  const currentUserId = 'current-user-id';

  useEffect(() => {
    if (groupId) {
      fetchGroupBookingData();
    }
  }, [groupId]);

  const fetchGroupBookingData = async () => {
    if (!groupId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [bookingData, participantsData, statsData] = await Promise.all([
        groupBookingService.getGroupBooking(groupId),
        groupBookingService.getGroupParticipants(groupId),
        groupBookingService.getGroupBookingStats(groupId)
      ]);
      
      setBooking(bookingData);
      setParticipants(participantsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch group booking data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load group booking');
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async () => {
    if (!inviteEmail.trim() || !groupId) return;
    
    setInviteLoading(true);
    
    try {
      const invitations: GroupInvitationRequest[] = [{
        email: inviteEmail.trim(),
        personalMessage: inviteMessage.trim() || undefined
      }];
      
      const result = await groupBookingService.sendGroupInvitations(groupId, invitations);
      
      if (result.successCount > 0) {
        setInviteEmail('');
        setInviteMessage('');
        setShowInviteModal(false);
        await fetchGroupBookingData(); // Refresh data
      }
    } catch (err) {
      console.error('Failed to send invite:', err);
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveParticipant = async (participantId: string) => {
    if (!groupId || !window.confirm('Are you sure you want to remove this participant?')) return;
    
    try {
      await groupBookingService.removeParticipant(groupId, participantId);
      await fetchGroupBookingData(); // Refresh data
    } catch (err) {
      console.error('Failed to remove participant:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove participant');
    }
  };

  const handleCancelBooking = async () => {
    if (!groupId) return;
    
    const reason = window.prompt('Please provide a reason for cancellation:');
    if (!reason) return;
    
    try {
      await groupBookingService.cancelGroupBooking(groupId, reason);
      navigate({ to: '/dashboard' });
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return <Loading message="Loading group booking details..." />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <BackButton />
        <div className={styles.errorMessage}>
          <h2>Error Loading Group Booking</h2>
          <p>{error}</p>
          <button onClick={fetchGroupBookingData} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className={styles.errorContainer}>
        <BackButton />
        <div className={styles.errorMessage}>
          <h2>Group Booking Not Found</h2>
          <p>The group booking you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  const isOrganizer = booking.organizer.id === currentUserId;

  if (!isOrganizer) {
    return (
      <div className={styles.errorContainer}>
        <BackButton />
        <div className={styles.errorMessage}>
          <h2>Access Denied</h2>
          <p>Only the group organizer can manage this booking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.managerContainer}>
      <BackButton />
      
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite People"
      >
        <div className={styles.inviteForm}>
          <div className={styles.formGroup}>
            <label htmlFor="modal-inviteEmail">Email Address</label>
            <input
              type="email"
              id="modal-inviteEmail"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="modal-inviteMessage">Personal Message (Optional)</label>
            <textarea
              id="modal-inviteMessage"
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              placeholder="Add a personal message to your invitation"
              rows={3}
            />
          </div>
          <div className={styles.modalActions}>
            <button
              onClick={() => setShowInviteModal(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                await handleSendInvite();
                setShowInviteModal(false);
              }}
              disabled={inviteLoading || !inviteEmail.trim()}
              className={styles.sendInviteButton}
            >
              {inviteLoading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </div>
      </Modal>

      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{booking.groupName}</h1>
          <div className={styles.subtitle}>
            <span>📍 {booking.workspace.name}</span>
            <span>📅 {formatDate(booking.date)} at {formatTime(booking.startTime)}</span>
          </div>
        </div>
        
        <div className={styles.headerActions}>
          <button
            onClick={() => setShowInviteModal(true)}
            className={`${styles.actionButton} ${styles.inviteButton}`}
          >
            + Invite People
          </button>
          
          <button
            onClick={handleCancelBooking}
            className={`${styles.actionButton} ${styles.cancelButton}`}
          >
            Cancel Booking
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.currentParticipants}</div>
            <div className={styles.statLabel}>Current Participants</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.availableSpots}</div>
            <div className={styles.statLabel}>Available Spots</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.inviteStats.pending}</div>
            <div className={styles.statLabel}>Pending Invites</div>
          </div>
          
          <div className={`${styles.statCard} ${stats.hasMinimumParticipants ? styles.statSuccess : styles.statWarning}`}>
            <div className={styles.statIcon}>
              {stats.hasMinimumParticipants ? '✅' : '⚠️'}
            </div>
            <div className={styles.statLabel}>
              {stats.hasMinimumParticipants ? 'Ready to Meet' : 'Need More People'}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className={styles.tabNavigation}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`${styles.tabButton} ${activeTab === 'overview' ? styles.activeTab : ''}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`${styles.tabButton} ${activeTab === 'participants' ? styles.activeTab : ''}`}
        >
          Participants ({participants?.totalCount || 0})
        </button>
        <button
          onClick={() => setActiveTab('invites')}
          className={`${styles.tabButton} ${activeTab === 'invites' ? styles.activeTab : ''}`}
        >
          Invitations
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`${styles.tabButton} ${activeTab === 'settings' ? styles.activeTab : ''}`}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div className={styles.overviewTab}>
            <div className={styles.bookingDetails}>
              <h3>Booking Details</h3>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Date & Time</span>
                  <span className={styles.detailValue}>
                    {formatDate(booking.date)} from {formatTime(booking.startTime)} to {formatTime(booking.endTime)}
                  </span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Room Type</span>
                  <span className={styles.detailValue}>{booking.roomType}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Capacity</span>
                  <span className={styles.detailValue}>{booking.minParticipants} - {booking.maxParticipants} people</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Status</span>
                  <span className={`${styles.statusBadge} ${styles[booking.status]}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {booking.groupDescription && (
              <div className={styles.descriptionSection}>
                <h3>Description</h3>
                <p>{booking.groupDescription}</p>
              </div>
            )}

            {booking.tags.length > 0 && (
              <div className={styles.tagsSection}>
                <h3>Tags</h3>
                <div className={styles.tagList}>
                  {booking.tags.map(tag => (
                    <span key={tag} className={styles.tag}>#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.inviteCodeSection}>
              <h3>Invite Code</h3>
              <div className={styles.inviteCodeBox}>
                <code className={styles.inviteCode}>{booking.inviteCode}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(booking.inviteCode)}
                  className={styles.copyButton}
                >
                  Copy Code
                </button>
              </div>
              <p className={styles.inviteCodeHelp}>
                Share this code with others so they can join your group directly.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'participants' && participants && (
          <div className={styles.participantsTab}>
            <div className={styles.organizerSection}>
              <h3>Organizer</h3>
              <div className={styles.participantItem}>
                <div className={styles.participantAvatar}>
                  {participants.organizer.avatar ? (
                    <img src={participants.organizer.avatar} alt={participants.organizer.name} />
                  ) : (
                    <span>{participants.organizer.name.charAt(0)}</span>
                  )}
                  <span className={styles.crownIcon}>👑</span>
                </div>
                <div className={styles.participantInfo}>
                  <div className={styles.participantName}>{participants.organizer.name}</div>
                  <div className={styles.participantEmail}>{participants.organizer.email}</div>
                </div>
                <div className={styles.participantStatus}>
                  <span className={styles.organizerBadge}>Organizer</span>
                </div>
              </div>
            </div>

            {participants.participants.length > 0 && (
              <div className={styles.participantsSection}>
                <h3>Participants ({participants.acceptedCount} accepted, {participants.pendingCount} pending)</h3>
                <div className={styles.participantsList}>
                  {participants.participants.map(participant => (
                    <div key={participant.user.id} className={styles.participantItem}>
                      <div className={styles.participantAvatar}>
                        {participant.user.avatar ? (
                          <img src={participant.user.avatar} alt={participant.user.name} />
                        ) : (
                          <span>{participant.user.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className={styles.participantInfo}>
                        <div className={styles.participantName}>{participant.user.name}</div>
                        <div className={styles.participantEmail}>{participant.user.email}</div>
                        <div className={styles.participantDate}>
                          Invited {new Date(participant.invitedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={styles.participantActions}>
                        <button
                          onClick={() => handleRemoveParticipant(participant.user.id)}
                          className={styles.removeButton}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'invites' && (
          <div className={styles.invitesTab}>
            <h3>Send Invitations</h3>
            <div className={styles.inviteForm}>
              <div className={styles.formGroup}>
                <label htmlFor="inviteEmail">Email Address</label>
                <input
                  type="email"
                  id="inviteEmail"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="inviteMessage">Personal Message (Optional)</label>
                <textarea
                  id="inviteMessage"
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Add a personal message to your invitation"
                  rows={3}
                />
              </div>
              <button
                onClick={handleSendInvite}
                disabled={inviteLoading || !inviteEmail.trim()}
                className={styles.sendInviteButton}
              >
                {inviteLoading ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={styles.settingsTab}>
            <h3>Group Settings</h3>
            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <h4>Allow Participant Invites</h4>
                  <p>Let participants invite others to join the group</p>
                </div>
                <div className={styles.settingControl}>
                  <input
                    type="checkbox"
                    checked={booking.groupSettings.allowParticipantInvites}
                    onChange={() => {/* TODO: Implement settings update */}}
                  />
                </div>
              </div>
              
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <h4>Require Approval</h4>
                  <p>Approve new participants before they can join</p>
                </div>
                <div className={styles.settingControl}>
                  <input
                    type="checkbox"
                    checked={booking.groupSettings.requireApproval}
                    onChange={() => {/* TODO: Implement settings update */}}
                  />
                </div>
              </div>
              
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <h4>Send Reminders</h4>
                  <p>Send email reminders before the meeting</p>
                </div>
                <div className={styles.settingControl}>
                  <input
                    type="checkbox"
                    checked={booking.groupSettings.sendReminders}
                    onChange={() => {/* TODO: Implement settings update */}}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupBookingManager;