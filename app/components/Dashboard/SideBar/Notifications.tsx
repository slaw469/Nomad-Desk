// app/components/notifications/Notifications.tsx
import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from "../../../contexts/AuthContext";
import styles from './sidebarstyles/notifications.module.css';

// Icons
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

const BookingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const ReviewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const SystemIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const ConnectionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

// Define notification types
type NotificationType = 'message' | 'booking' | 'review' | 'system' | 'connection' | 'session';

// Define notification interface
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  date: string;
  isRead: boolean;
  actionLink?: string;
  actionText?: string;
  sender?: {
    name: string;
    avatar: string;
  };
}

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [activeCategory, setActiveCategory] = useState<NotificationType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Load mock notifications data
  useEffect(() => {
    // This would typically be an API call
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'booking',
        title: 'Booking Confirmation',
        message: 'Your booking for Central Library Workspace on April 15, 2025, has been confirmed.',
        time: '9:45 AM',
        date: 'Today',
        isRead: false,
        actionLink: '/workspaces/1',
        actionText: 'View Booking'
      },
      {
        id: '2',
        type: 'message',
        title: 'New Message',
        message: 'Sara Williams sent you a message about your upcoming study session.',
        time: '11:20 AM',
        date: 'Today',
        isRead: false,
        sender: {
          name: 'Sara Williams',
          avatar: '/api/placeholder/40/40'
        },
        actionLink: '/messages/2',
        actionText: 'Reply'
      },
      {
        id: '3',
        type: 'connection',
        title: 'Connection Request',
        message: 'Taylor Chen wants to connect with you.',
        time: '2:30 PM',
        date: 'Yesterday',
        isRead: true,
        sender: {
          name: 'Taylor Chen',
          avatar: '/api/placeholder/40/40'
        },
        actionLink: '/profile/network',
        actionText: 'View Request'
      },
      {
        id: '4',
        type: 'session',
        title: 'Study Session Reminder',
        message: 'Your study session "UX Research Collaboration" is scheduled for tomorrow at 2:00 PM.',
        time: '4:15 PM',
        date: 'Yesterday',
        isRead: true,
        actionLink: '/sessions/1',
        actionText: 'View Details'
      },
      {
        id: '5',
        type: 'review',
        title: 'Review Request',
        message: 'Please leave a review for your recent visit to Downtown Café.',
        time: '10:00 AM',
        date: 'Apr 10, 2025',
        isRead: true,
        actionLink: '/workspaces/3/review',
        actionText: 'Leave Review'
      },
      {
        id: '6',
        type: 'system',
        title: 'Account Security',
        message: 'A new device was used to log in to your account. If this wasn\'t you, please secure your account.',
        time: '8:25 AM',
        date: 'Apr 9, 2025',
        isRead: true,
        actionLink: '/settings/security',
        actionText: 'Review Activity'
      },
      {
        id: '7',
        type: 'booking',
        title: 'Booking Modification',
        message: 'Your booking for Innovation Hub Coworking has been modified as requested.',
        time: '3:40 PM',
        date: 'Apr 8, 2025',
        isRead: true,
        actionLink: '/workspaces/2',
        actionText: 'View Details'
      },
      {
        id: '8',
        type: 'system',
        title: 'New Feature Available',
        message: 'Try our new group booking feature - now you can book workspaces for your entire team!',
        time: '11:15 AM',
        date: 'Apr 7, 2025',
        isRead: true,
        actionLink: '/features/group-booking',
        actionText: 'Learn More'
      },
    ];
    
    setNotifications(mockNotifications);
  }, []);

  // Filter notifications based on active filters and search query
  const filteredNotifications = notifications
    .filter(notification => {
      // Filter by read/unread status
      if (activeFilter === 'unread' && notification.isRead) {
        return false;
      }
      
      // Filter by category
      if (activeCategory !== 'all' && notification.type !== activeCategory) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  // Delete a notification
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return <MessageIcon />;
      case 'booking':
        return <BookingIcon />;
      case 'review':
        return <ReviewIcon />;
      case 'system':
        return <SystemIcon />;
      case 'connection':
        return <ConnectionIcon />;
      case 'session':
        return <CalendarIcon />;
      default:
        return <SystemIcon />;
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'message':
        return styles.messageNotification;
      case 'booking':
        return styles.bookingNotification;
      case 'review':
        return styles.reviewNotification;
      case 'system':
        return styles.systemNotification;
      case 'connection':
        return styles.connectionNotification;
      case 'session':
        return styles.sessionNotification;
      default:
        return '';
    }
  };

  // Get unread count
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  // Get notification counts by type
  const getTypeCount = (type: NotificationType | 'all') => {
    if (type === 'all') {
      return notifications.length;
    }
    return notifications.filter(notification => notification.type === type).length;
  };

  return (
    <div className={styles.notificationsContainer}>
      <div className={styles.notificationsHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.notificationsTitle}>Notifications</h1>
          <div className={styles.notificationsActions}>
            <button
              className={styles.markAllReadButton}
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.searchIcon}
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              {searchQuery && (
                <button
                  className={styles.clearSearchButton}
                  onClick={() => setSearchQuery('')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className={styles.filterTabs}>
          <div className={styles.statusTabs}>
            <button
              className={`${styles.filterTab} ${activeFilter === 'all' ? styles.activeTab : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All
              <span className={styles.tabCount}>{notifications.length}</span>
            </button>
            <button
              className={`${styles.filterTab} ${activeFilter === 'unread' ? styles.activeTab : ''}`}
              onClick={() => setActiveFilter('unread')}
            >
              Unread
              <span className={styles.tabCount}>{unreadCount}</span>
            </button>
          </div>
          
          <div className={styles.categoryTabs}>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'all' ? styles.activeTab : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Types
              <span className={styles.tabCount}>{getTypeCount('all')}</span>
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'message' ? styles.activeTab : ''} ${styles.messageTab}`}
              onClick={() => setActiveCategory('message')}
            >
              Messages
              <span className={styles.tabCount}>{getTypeCount('message')}</span>
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'booking' ? styles.activeTab : ''} ${styles.bookingTab}`}
              onClick={() => setActiveCategory('booking')}
            >
              Bookings
              <span className={styles.tabCount}>{getTypeCount('booking')}</span>
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'session' ? styles.activeTab : ''} ${styles.sessionTab}`}
              onClick={() => setActiveCategory('session')}
            >
              Sessions
              <span className={styles.tabCount}>{getTypeCount('session')}</span>
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'connection' ? styles.activeTab : ''} ${styles.connectionTab}`}
              onClick={() => setActiveCategory('connection')}
            >
              Connections
              <span className={styles.tabCount}>{getTypeCount('connection')}</span>
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'review' ? styles.activeTab : ''} ${styles.reviewTab}`}
              onClick={() => setActiveCategory('review')}
            >
              Reviews
              <span className={styles.tabCount}>{getTypeCount('review')}</span>
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'system' ? styles.activeTab : ''} ${styles.systemTab}`}
              onClick={() => setActiveCategory('system')}
            >
              System
              <span className={styles.tabCount}>{getTypeCount('system')}</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.notificationsBody}>
        {filteredNotifications.length > 0 ? (
          <div className={styles.notificationsList}>
            {filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`${styles.notificationItem} ${!notification.isRead ? styles.unreadNotification : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className={`${styles.notificationIconContainer} ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className={styles.notificationContent}>
                  <div className={styles.notificationHeader}>
                    <h3 className={styles.notificationTitle}>{notification.title}</h3>
                    <div className={styles.notificationTime}>
                      <ClockIcon />
                      <span>{notification.time} • {notification.date}</span>
                    </div>
                  </div>
                  
                  {notification.sender && (
                    <div className={styles.senderInfo}>
                      <img 
                        src={notification.sender.avatar} 
                        alt={notification.sender.name} 
                        className={styles.senderAvatar}
                      />
                      <span className={styles.senderName}>{notification.sender.name}</span>
                    </div>
                  )}
                  
                  <p className={styles.notificationMessage}>{notification.message}</p>
                  
                  <div className={styles.notificationActions}>
                    {notification.actionLink && notification.actionText && (
                      <Link 
                        to={notification.actionLink} 
                        className={styles.actionButton}
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
                      >
                        {notification.actionText}
                      </Link>
                    )}
                    <button 
                      className={styles.deleteButton}
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {!notification.isRead && <div className={styles.unreadIndicator}></div>}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h2 className={styles.emptyStateTitle}>
              {searchQuery 
                ? 'No notifications match your search' 
                : activeFilter === 'unread' 
                  ? 'No unread notifications' 
                  : 'No notifications yet'}
            </h2>
            <p className={styles.emptyStateMessage}>
              {searchQuery 
                ? 'Try using different keywords or filters' 
                : activeFilter === 'unread' 
                  ? 'You\'re all caught up!' 
                  : 'When you receive notifications, they will appear here'}
            </p>
            {searchQuery && (
              <button 
                className={styles.resetButton}
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                  setActiveCategory('all');
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;