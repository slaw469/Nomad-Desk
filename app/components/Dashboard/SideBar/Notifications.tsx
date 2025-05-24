// app/components/Dashboard/SideBar/Notifications.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from "../../../contexts/AuthContext";
import styles from './SideBarStyles/notifications.module.css';
import notificationService, { NotificationItem, NotificationFilters } from '../../../services/notificationService';
import Loading from '../../Common/Loading';

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

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"></path>
    <path d="M12 19l-7-7 7-7"></path>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Filter states
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');
  
  // Stats
  const [notificationStats, setNotificationStats] = useState({
    total: 0,
    unread: 0,
    byType: {} as Record<string, number>
  });
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 20;
  
  // Action tracking
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [markingAsRead, setMarkingAsRead] = useState(false);
  
  // WebSocket connection
  const wsConnectionRef = useRef<(() => void) | null>(null);
  
  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchQuery);
      setPage(1); // Reset pagination on search
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch notifications
  const fetchNotifications = useCallback(async (append = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      
      const filters: NotificationFilters = {
        status: activeFilter,
        type: activeCategory === 'all' ? undefined : activeCategory,
        search: searchDebounce || undefined,
        limit: ITEMS_PER_PAGE,
        offset: append ? (page - 1) * ITEMS_PER_PAGE : 0
      };
      
      const [notificationsData, statsData] = await Promise.all([
        notificationService.getNotifications(filters),
        notificationService.getNotificationStats()
      ]);
      
      if (append) {
        setNotifications(prev => [...prev, ...notificationsData]);
      } else {
        setNotifications(notificationsData);
      }
      
      setNotificationStats(statsData);
      setHasMore(notificationsData.length === ITEMS_PER_PAGE);
      
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [activeFilter, activeCategory, searchDebounce, page]);

  // Initial load and filter changes
  useEffect(() => {
    setPage(1);
    fetchNotifications();
  }, [activeFilter, activeCategory, searchDebounce]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchNotifications(true);
    }
  }, [page]);

  // Set up WebSocket connection
  useEffect(() => {
    // Subscribe to real-time notifications
    wsConnectionRef.current = notificationService.subscribeToRealTimeNotifications((notification) => {
      setNotifications(prev => [notification, ...prev]);
      setNotificationStats(prev => ({
        ...prev,
        total: prev.total + 1,
        unread: !notification.isRead ? prev.unread + 1 : prev.unread,
        byType: {
          ...prev.byType,
          [notification.type]: (prev.byType[notification.type] || 0) + 1
        }
      }));
      
      // Show browser notification if enabled
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico'
        });
      }
    });
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    return () => {
      if (wsConnectionRef.current) {
        wsConnectionRef.current();
      }
    };
  }, []);

  // Clear messages after timeout
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

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setNotificationStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1)
      }));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (notificationStats.unread === 0) return;
    
    try {
      setMarkingAsRead(true);
      const result = await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setNotificationStats(prev => ({ ...prev, unread: 0 }));
      setSuccessMessage(`${result.updated} notifications marked as read`);
    } catch (err) {
      console.error('Error marking all as read:', err);
      setError('Failed to mark notifications as read');
    } finally {
      setMarkingAsRead(false);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      setDeletingIds(prev => new Set(prev).add(notificationId));
      await notificationService.deleteNotification(notificationId);
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setNotificationStats(prev => {
        const notification = notifications.find(n => n.id === notificationId);
        return {
          total: Math.max(0, prev.total - 1),
          unread: notification && !notification.isRead ? Math.max(0, prev.unread - 1) : prev.unread,
          byType: {
            ...prev.byType,
            [notification?.type || '']: Math.max(0, (prev.byType[notification?.type || ''] || 1) - 1)
          }
        };
      });
      
      setSuccessMessage('Notification deleted');
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  // Refresh notifications
  const refreshNotifications = () => {
    setRefreshing(true);
    setPage(1);
    fetchNotifications();
  };

  // Load more
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Get notification icon
  const getNotificationIcon = (type: string) => {
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

  // Get notification color
  const getNotificationColor = (type: string) => {
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

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Handle notification click
  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    if (notification.actionLink) {
      navigate({ to: notification.actionLink as any });
    }
  };

  // Get filtered notifications (client-side filtering for already loaded items)
  const filteredNotifications = notifications;

  return (
    <div className={styles.notificationsContainer}>
      {/* Header with back button */}
      <div className={styles.notificationsHeader}>
        <div className={styles.headerTop}>
          <button
            className={styles.backButton}
            onClick={() => navigate({ to: '/dashboard' })}
          >
            <BackIcon />
            <span>Back to Dashboard</span>
          </button>
          
          <button
            className={styles.refreshButton}
            onClick={refreshNotifications}
            disabled={refreshing}
            title="Refresh notifications"
          >
            <RefreshIcon />
          </button>
        </div>
        
        <div className={styles.headerContent}>
          <h1 className={styles.notificationsTitle}>Notifications</h1>
          <div className={styles.notificationsActions}>
            <button
              className={styles.markAllReadButton}
              onClick={markAllAsRead}
              disabled={notificationStats.unread === 0 || markingAsRead}
            >
              {markingAsRead ? 'Marking...' : 'Mark all as read'}
            </button>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery ? (
                <button
                  className={styles.clearSearchButton}
                  onClick={() => setSearchQuery('')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ) : (
                <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </div>
          </div>
        </div>
        
        {/* Success/Error Messages */}
        {successMessage && (
          <div className={styles.successMessage}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{successMessage}</span>
          </div>
        )}
        
        {error && (
          <div className={styles.errorMessage}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <div className={styles.filterTabs}>
          <div className={styles.statusTabs}>
            <button
              className={`${styles.filterTab} ${activeFilter === 'all' ? styles.activeTab : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All
              <span className={styles.tabCount}>{notificationStats.total}</span>
            </button>
            <button
              className={`${styles.filterTab} ${activeFilter === 'unread' ? styles.activeTab : ''}`}
              onClick={() => setActiveFilter('unread')}
            >
              Unread
              <span className={styles.tabCount}>{notificationStats.unread}</span>
            </button>
          </div>
          
          <div className={styles.categoryTabs}>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'all' ? styles.activeTab : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Types
              <span className={styles.tabCount}>{notificationStats.total}</span>
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'message' ? styles.activeTab : ''} ${styles.messageTab}`}
              onClick={() => setActiveCategory('message')}
            >
              Messages
              <span className={styles.tabCount}>{notificationStats.byType.message || 0}</span>
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'booking' ? styles.activeTab : ''} ${styles.bookingTab}`}
              onClick={() => setActiveCategory('booking')}
            >
              Bookings
              <span className={styles.tabCount}>{notificationStats.byType.booking || 0}</span>
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'session' ? styles.activeTab : ''} ${styles.sessionTab}`}
              onClick={() => setActiveCategory('session')}
            >
              Sessions
              <span className={styles.tabCount}>{notificationStats.byType.session || 0}</span>
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'connection' ? styles.activeTab : ''} ${styles.connectionTab}`}
              onClick={() => setActiveCategory('connection')}
            >
              Connections
              <span className={styles.tabCount}>{notificationStats.byType.connection || 0}</span>
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'review' ? styles.activeTab : ''} ${styles.reviewTab}`}
              onClick={() => setActiveCategory('review')}
            >
              Reviews
              <span className={styles.tabCount}>{notificationStats.byType.review || 0}</span>
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'system' ? styles.activeTab : ''} ${styles.systemTab}`}
              onClick={() => setActiveCategory('system')}
            >
              System
              <span className={styles.tabCount}>{notificationStats.byType.system || 0}</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.notificationsBody}>
        {loading && !refreshing ? (
          <div className={styles.loadingState}>
            <Loading message="Loading notifications..." />
          </div>
        ) : filteredNotifications.length > 0 ? (
          <>
            <div className={styles.notificationsList}>
              {filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`${styles.notificationItem} ${!notification.isRead ? styles.unreadNotification : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`${styles.notificationIconContainer} ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationHeader}>
                      <h3 className={styles.notificationTitle}>{notification.title}</h3>
                      <div className={styles.notificationTime}>
                        <ClockIcon />
                        <span>{formatRelativeTime(notification.createdAt)}</span>
                      </div>
                    </div>
                    
                    {notification.sender && (
                      <div className={styles.senderInfo}>
                        {notification.sender.avatar ? (
                          <img 
                            src={notification.sender.avatar} 
                            alt={notification.sender.name} 
                            className={styles.senderAvatar}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className={styles.senderAvatarPlaceholder}>
                            {notification.sender.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className={styles.senderName}>{notification.sender.name}</span>
                      </div>
                    )}
                    
                    <p className={styles.notificationMessage}>{notification.message}</p>
                    
                    {/* Additional metadata based on notification type */}
                    {notification.relatedBooking && (
                      <div className={styles.relatedInfo}>
                        <CalendarIcon />
                        <span>{notification.relatedBooking.workspaceName} - {notification.relatedBooking.date} at {notification.relatedBooking.time}</span>
                      </div>
                    )}
                    
                    {notification.relatedSession && (
                      <div className={styles.relatedInfo}>
                        <CalendarIcon />
                        <span>{notification.relatedSession.title} - {notification.relatedSession.date} at {notification.relatedSession.time}</span>
                      </div>
                    )}
                    
                    <div className={styles.notificationActions}>
                      {notification.actionLink && notification.actionText && (
                        <Link 
                          to={notification.actionLink as any} 
                          className={styles.actionButton}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {notification.actionText}
                        </Link>
                      )}
                      <button 
                        className={styles.deleteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        disabled={deletingIds.has(notification.id)}
                      >
                        {deletingIds.has(notification.id) ? (
                          <Loading message="" />
                        ) : (
                          <>
                            <TrashIcon />
                            <span>Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {!notification.isRead && <div className={styles.unreadIndicator}></div>}
                </div>
              ))}
            </div>
            
            {/* Load More */}
            {hasMore && (
              <div className={styles.loadMoreContainer}>
                <button 
                  className={styles.loadMoreButton}
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <Loading message="Loading more..." />
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <BellIcon />
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
            {(searchQuery || activeFilter !== 'all' || activeCategory !== 'all') && (
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