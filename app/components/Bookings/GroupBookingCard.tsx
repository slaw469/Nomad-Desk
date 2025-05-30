// app/components/Bookings/GroupBookingCard.tsx - GROUP BOOKING CARD COMPONENT

import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { GroupBookingCardProps } from '../../types/groupBooking';
import { groupBookingService } from '../../services/bookingService';
import styles from './GroupBookingCard.module.css';

const GroupBookingCard: React.FC<GroupBookingCardProps> = ({
  booking,
  onJoin,
  onLeave,
  onCancel,
  onViewDetails,
  showActions = true,
  compact = false
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock current user ID - in real app this would come from auth context
  const currentUserId = 'current-user-id'; // This should be from useAuth() hook

  // Determine user's role and permissions
  const userRole = groupBookingService.isUserOrganizer(booking, currentUserId) 
    ? 'organizer' 
    : groupBookingService.isUserParticipant(booking, currentUserId)
    ? 'participant'
    : 'none';

  const canJoin = userRole === 'none' && groupBookingService.canAcceptMoreParticipants(booking);
  const canLeave = groupBookingService.canUserLeave(booking, currentUserId);
  const canManage = groupBookingService.canUserManage(booking, currentUserId);

  // Format date and time
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatTimeRange = (): string => {
    return `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`;
  };

  // Handle join action
  const handleJoin = async () => {
    if (!onJoin) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await onJoin(booking.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join group');
    } finally {
      setLoading(false);
    }
  };

  // Handle leave action
  const handleLeave = async () => {
    if (!onLeave) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await onLeave(booking.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave group');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel action
  const handleCancel = async () => {
    if (!onCancel) return;
    
    const reason = window.prompt('Please provide a reason for cancellation (optional):');
    if (reason === null) return; // User cancelled the prompt
    
    setLoading(true);
    setError(null);
    
    try {
      await onCancel(booking.id, reason);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel group');
    } finally {
      setLoading(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  // Get participant avatars to display
  const getDisplayParticipants = () => {
    const acceptedParticipants = booking.participants?.filter(p => p.status === 'accepted') || [];
    return acceptedParticipants.slice(0, 3); // Show max 3 avatars
  };

  return (
    <div className={`${styles.groupBookingCard} ${compact ? styles.compact : ''}`}>
      {error && (
        <div className={styles.errorBanner}>
          {error}
          <button onClick={() => setError(null)} className={styles.errorClose}>×</button>
        </div>
      )}

      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <h3 className={styles.groupName}>{booking.groupName}</h3>
          <div className={styles.statusBadge}>
            <span className={`${styles.badge} ${styles[getStatusColor(booking.status)]}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            {userRole !== 'none' && (
              <span className={`${styles.roleBadge} ${styles[userRole]}`}>
                {userRole === 'organizer' ? '👑 Organizer' : '👤 Member'}
              </span>
            )}
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.participantCount}>
            <span className={styles.countText}>
              {booking.currentParticipantCount}/{booking.maxParticipants}
            </span>
            <span className={styles.countLabel}>participants</span>
          </div>
        </div>
      </div>

      <div className={styles.cardBody}>
        {booking.groupDescription && !compact && (
          <p className={styles.description}>{booking.groupDescription}</p>
        )}

        <div className={styles.bookingDetails}>
          <div className={styles.detailItem}>
            <span className={styles.detailIcon}>📍</span>
            <div className={styles.detailContent}>
              <span className={styles.detailLabel}>Location</span>
              <span className={styles.detailValue}>{booking.workspace.name}</span>
              {!compact && (
                <span className={styles.detailSecondary}>{booking.workspace.address}</span>
              )}
            </div>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailIcon}>📅</span>
            <div className={styles.detailContent}>
              <span className={styles.detailLabel}>Date & Time</span>
              <span className={styles.detailValue}>{formatDate(booking.date)}</span>
              <span className={styles.detailSecondary}>{formatTimeRange()}</span>
            </div>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailIcon}>🏠</span>
            <div className={styles.detailContent}>
              <span className={styles.detailLabel}>Room</span>
              <span className={styles.detailValue}>{booking.roomType}</span>
            </div>
          </div>
        </div>

        {booking.tags && booking.tags.length > 0 && (
          <div className={styles.tags}>
            {booking.tags.slice(0, compact ? 2 : 4).map(tag => (
              <span key={tag} className={styles.tag}>#{tag}</span>
            ))}
            {booking.tags.length > (compact ? 2 : 4) && (
              <span className={styles.tagMore}>+{booking.tags.length - (compact ? 2 : 4)}</span>
            )}
          </div>
        )}

        {!compact && (
          <div className={styles.participants}>
            <div className={styles.participantAvatars}>
              <div className={styles.organizerAvatar} title={`Organizer: ${booking.organizer.name}`}>
                {booking.organizer.avatar ? (
                  <img src={booking.organizer.avatar} alt={booking.organizer.name} />
                ) : (
                  <span>{booking.organizer.name.charAt(0)}</span>
                )}
                <span className={styles.crownIcon}>👑</span>
              </div>
              
              {getDisplayParticipants().map((participant) => (
                <div 
                  key={participant.user.id} 
                  className={styles.participantAvatar}
                  title={participant.user.name}
                >
                  {participant.user.avatar ? (
                    <img src={participant.user.avatar} alt={participant.user.name} />
                  ) : (
                    <span>{participant.user.name.charAt(0)}</span>
                  )}
                </div>
              ))}
              
              {booking.currentParticipantCount > 4 && (
                <div className={styles.moreParticipants}>
                  +{booking.currentParticipantCount - 4}
                </div>
              )}
            </div>
            
            <div className={styles.participantInfo}>
              <span className={styles.organizerName}>
                Organized by {booking.organizer.name}
              </span>
              {booking.hasMinimumParticipants ? (
                <span className={styles.statusGood}>✅ Ready to meet</span>
              ) : (
                <span className={styles.statusNeed}>
                  Needs {booking.minParticipants - booking.currentParticipantCount} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {showActions && (
        <div className={styles.cardActions}>
          <div className={styles.actionLeft}>
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(booking.id)}
                className={`${styles.actionButton} ${styles.viewButton}`}
                disabled={loading}
              >
                View Details
              </button>
            )}
            
            <Link
              to="/workspaces/map/$placeId" 
              params={{ placeId: booking.workspace.id }}
              className={`${styles.actionButton} ${styles.linkButton}`}
            >
              View Workspace
            </Link>
          </div>

          <div className={styles.actionRight}>
            {canJoin && (
              <button
                onClick={handleJoin}
                className={`${styles.actionButton} ${styles.joinButton}`}
                disabled={loading}
              >
                {loading ? 'Joining...' : 'Join Group'}
              </button>
            )}

            {canLeave && (
              <button
                onClick={handleLeave}
                className={`${styles.actionButton} ${styles.leaveButton}`}
                disabled={loading}
              >
                {loading ? 'Leaving...' : 'Leave Group'}
              </button>
            )}

            {canManage && (
              <>
                <Link
                  to="/group-bookings/$groupId/manage" 
                  params={{ groupId: booking.id }}
                  className={`${styles.actionButton} ${styles.manageButton}`}
                >
                  Manage
                </Link>
                
                <button
                  onClick={handleCancel}
                  className={`${styles.actionButton} ${styles.cancelButton}`}
                  disabled={loading}
                >
                  {loading ? 'Cancelling...' : 'Cancel'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {booking.inviteCode && (userRole === 'organizer' || userRole === 'participant') && (
        <div className={styles.inviteCode}>
          <span className={styles.inviteLabel}>Invite Code:</span>
          <code className={styles.inviteCodeValue}>{booking.inviteCode}</code>
          <button
            onClick={() => navigator.clipboard.writeText(booking.inviteCode)}
            className={styles.copyButton}
            title="Copy invite code"
          >
            📋
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupBookingCard;