// app/services/notificationService.ts

// Base API URL from environment or fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

// Notification interfaces
export interface NotificationItem {
  id: string;
  user: string;
  type: 'message' | 'booking' | 'review' | 'system' | 'connection' | 'session';
  title: string;
  message: string;
  isRead: boolean;
  actionLink?: string;
  actionText?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  relatedBooking?: {
    id: string;
    workspaceName: string;
    date: string;
    time: string;
  };
  relatedConnection?: {
    id: string;
    userName: string;
    action: 'request' | 'accepted' | 'rejected';
  };
  relatedSession?: {
    id: string;
    title: string;
    date: string;
    time: string;
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
}

export interface NotificationFilters {
  status?: 'all' | 'unread';
  type?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

// Generic fetch function for API calls
const fetchApi = async <T>(
  endpoint: string,
  method = 'GET',
  data?: any,
): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    headers['x-auth-token'] = token;
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    console.log(`Fetching ${method} ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Try to parse response as JSON
    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || `Error: ${response.status} ${response.statusText}`;
      console.error('API error:', errorMessage);
      throw new Error(errorMessage);
    }

    return responseData as T;
  } catch (error) {
    if (error instanceof Error) {
      console.error('API fetch error:', error.message);
      throw error;
    }
    console.error('Unexpected API error:', error);
    throw new Error('An unexpected error occurred');
  }
};

// Notification Service methods
export const notificationService = {
  // Get all notifications with optional filters
  getNotifications: async (filters?: NotificationFilters): Promise<NotificationItem[]> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/notifications?${queryString}` : '/notifications';

    return fetchApi<NotificationItem[]>(endpoint);
  },

  // Get notification by ID
  getNotificationById: async (notificationId: string): Promise<NotificationItem> => fetchApi<NotificationItem>(`/notifications/${notificationId}`),

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<NotificationItem> => fetchApi<NotificationItem>(`/notifications/${notificationId}/read`, 'PUT'),

  // Mark multiple notifications as read
  markMultipleAsRead: async (notificationIds: string[]): Promise<{ message: string; updated: number }> => fetchApi<{ message: string; updated: number }>('/notifications/mark-read', 'PUT', { ids: notificationIds }),

  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ message: string; updated: number }> => fetchApi<{ message: string; updated: number }>('/notifications/mark-all-read', 'PUT'),

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<{ message: string }> => fetchApi<{ message: string }>(`/notifications/${notificationId}`, 'DELETE'),

  // Delete multiple notifications
  deleteMultipleNotifications: async (notificationIds: string[]): Promise<{ message: string; deleted: number }> => fetchApi<{ message: string; deleted: number }>('/notifications/delete-multiple', 'DELETE', { ids: notificationIds }),

  // Get notification statistics
  getNotificationStats: async (): Promise<NotificationStats> => fetchApi<NotificationStats>('/notifications/stats'),

  // Get unread count
  getUnreadCount: async (): Promise<{ count: number }> => fetchApi<{ count: number }>('/notifications/unread-count'),

  // Subscribe to push notifications
  subscribeToPushNotifications: async (subscription: PushSubscription): Promise<{ message: string }> => fetchApi<{ message: string }>('/notifications/subscribe', 'POST', subscription),

  // Unsubscribe from push notifications
  unsubscribeFromPushNotifications: async (): Promise<{ message: string }> => fetchApi<{ message: string }>('/notifications/unsubscribe', 'DELETE'),

  // Update notification preferences
  updateNotificationPreferences: async (preferences: {
    email?: boolean;
    push?: boolean;
    types?: string[];
  }): Promise<{ message: string }> => fetchApi<{ message: string }>('/notifications/preferences', 'PUT', preferences),

  // Real-time notification subscription (WebSocket)
  subscribeToRealTimeNotifications: (onNotification: (notification: NotificationItem) => void) => {
    const wsUrl = `${API_BASE_URL.replace(/^http/, 'ws')}/notifications/stream`;
    const token = localStorage.getItem('token');

    const ws = new WebSocket(`${wsUrl}?token=${token}`);

    ws.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        onNotification(notification);
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      // Implement reconnection logic if needed
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  },
};

export default notificationService;
