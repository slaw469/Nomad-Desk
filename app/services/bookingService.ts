// app/services/bookingService.ts - COMPLETE WITH GROUP BOOKING SUPPORT

import {
  GroupBooking,
  GroupBookingRequest,
  GroupInvitationRequest,
  GroupInvitationResponse,
  GroupBookingStats,
  GroupParticipantsResponse,
  SendInvitationsResponse,
  JoinGroupResponse,
  PublicGroupBooking,
  GroupBookingFilters,
} from '../types/groupBooking';

// Base API URL from environment or fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

// Updated booking interfaces to include group bookings
export interface Booking {
  id: string;
  user: string;
  workspace: {
    id: string;
    name: string;
    address: string;
    photo?: string;
    type: string;
  };
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format (24-hour)
  endTime: string; // HH:MM format (24-hour)
  roomType: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  numberOfPeople: number;
  specialRequests?: string;
  totalPrice?: number;
  paymentStatus?: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod?: 'free' | 'card' | 'cash' | 'points';
  checkInTime?: string;
  checkOutTime?: string;
  rating?: number;
  review?: string;
  cancellationReason?: string;
  cancellationDate?: string;
  createdAt: string;
  updatedAt: string;

  // Group booking fields (optional)
  isGroupBooking?: boolean;
  groupName?: string;
  groupDescription?: string;
  organizer?: string;
  participants?: Array<{
    user: string;
    status: 'invited' | 'accepted' | 'declined' | 'pending';
    invitedAt: string;
    respondedAt?: string;
  }>;
  maxParticipants?: number;
  minParticipants?: number;
  inviteCode?: string;
  isPublic?: boolean;
  tags?: string[];

  // Virtual fields from backend
  durationMinutes?: number;
  formattedDate?: string;
  formattedTimeRange?: string;
  isActive?: boolean;
  isUpcoming?: boolean;
  isPast?: boolean;
  currentParticipantCount?: number;
}

export interface BookingRequest {
  workspaceId: string;
  workspaceName: string;
  workspaceAddress: string;
  workspaceType: string;
  workspacePhoto?: string;
  date: string;
  startTime: string;
  endTime: string;
  roomType: string;
  numberOfPeople: number;
  specialRequests?: string;
  isGroupBooking: boolean;
}

export interface BookingStats {
  upcoming: number;
  past: number;
  total: number;
  cancelled: number;
  groupsOrganized?: number;
  groupsParticipated?: number;
}

export interface AvailabilityResponse {
  available: boolean;
  availableSlots?: Array<{
    startTime: string;
    endTime: string;
  }>;
}

export interface ReviewRequest {
  rating: number;
  review: string;
}

export interface Review {
  id: string;
  bookingId: string;
  workspaceId: string;
  userId: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
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
  } else {
    console.warn('No auth token found in localStorage');
  }

  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  try {
    console.log(`Fetching ${method} ${url}`, { headers, method, body: data });
    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.message || `Error: ${response.status} ${response.statusText}`;
        console.error('API error:', errorMessage);
        throw new Error(errorMessage);
      }

      return responseData as T;
    }
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return {} as T;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};

// =============================================================================
// EXISTING BOOKING SERVICE METHODS (Updated)
// =============================================================================

export const bookingService = {
  // Get all bookings (includes group bookings)
  getAllBookings: async (): Promise<Booking[]> => fetchApi<Booking[]>('/bookings'),

  // Get upcoming bookings (includes group bookings)
  getUpcomingBookings: async (): Promise<Booking[]> => fetchApi<Booking[]>('/bookings/upcoming'),

  // Get past bookings (includes group bookings)
  getPastBookings: async (): Promise<Booking[]> => fetchApi<Booking[]>('/bookings/past'),

  // Get booking by ID
  getBookingById: async (bookingId: string): Promise<Booking> => fetchApi<Booking>(`/bookings/${bookingId}`),

  // Create a new individual booking
  createBooking: async (bookingData: BookingRequest): Promise<Booking> => fetchApi<Booking>('/bookings', 'POST', bookingData),

  // Update booking
  updateBooking: async (bookingId: string, bookingData: Partial<BookingRequest>): Promise<Booking> => fetchApi<Booking>(`/bookings/${bookingId}`, 'PUT', bookingData),

  // Cancel booking
  cancelBooking: async (bookingId: string): Promise<{ message: string }> => fetchApi<{ message: string }>(`/bookings/${bookingId}/cancel`, 'PUT'),

  // Delete booking
  deleteBooking: async (bookingId: string): Promise<{ message: string }> => fetchApi<{ message: string }>(`/bookings/${bookingId}`, 'DELETE'),

  // Check workspace availability
  checkAvailability: async (
    workspaceId: string,
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<AvailabilityResponse> => {
    const params = new URLSearchParams({
      workspaceId,
      date,
      startTime,
      endTime,
    });
    return fetchApi<AvailabilityResponse>(`/bookings/availability?${params}`);
  },

  // Get booking statistics (updated for group bookings)
  getBookingStats: async (): Promise<BookingStats> => fetchApi<BookingStats>('/bookings/stats'),

  // Helper functions
  formatDateForApi: (date: Date): string => date.toISOString().split('T')[0],

  formatTimeForApi: (date: Date): string => date.toTimeString().split(' ')[0].substring(0, 5),

  parseApiDate: (dateString: string): Date => new Date(dateString),

  canCancelBooking: (booking: Booking): boolean => {
    const now = new Date();
    const bookingDate = new Date(booking.date);
    return bookingDate >= now && booking.status !== 'cancelled' && booking.status !== 'completed';
  },

  canModifyBooking: (booking: Booking): boolean => {
    const now = new Date();
    const bookingDate = new Date(booking.date);
    return bookingDate >= now && booking.status !== 'cancelled' && booking.status !== 'completed';
  },

  // Modify an existing booking
  modifyBooking: async (bookingId: string, updates: Partial<BookingRequest>): Promise<Booking> => {
    try {
      const response = await fetchApi<Booking>(`/bookings/${bookingId}`, 'PUT', updates);

      if (!response) {
        throw new Error('Failed to modify booking. Please try again.');
      }

      return response;
    } catch (error) {
      console.error('Modify booking error:', error);
      throw error;
    }
  },

  // Submit a review for a booking
  submitReview: async (bookingId: string, { rating, review }: { rating: number, review: string }): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/reviews/booking/${bookingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token') || '',
      },
      body: JSON.stringify({ rating, review }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit review');
    }
  },

  // Get reviews for a workspace
  getWorkspaceReviews: async (workspaceId: string): Promise<Review[]> => fetchApi<Review[]>(`/workspaces/${workspaceId}/reviews`),

  // Book again using an existing booking as template
  bookAgain: async (bookingId: string): Promise<Booking> =>
    // Just get the booking details - don't try to create a new booking
    fetchApi<Booking>(`/bookings/${bookingId}`),

};

// =============================================================================
// NEW GROUP BOOKING SERVICE METHODS
// =============================================================================

export const groupBookingService = {
  // Create a new group booking
  createGroupBooking: async (bookingData: GroupBookingRequest): Promise<GroupBooking> => fetchApi<GroupBooking>('/bookings/group', 'POST', bookingData),

  // Get group booking details
  getGroupBooking: async (bookingId: string): Promise<GroupBooking> => fetchApi<GroupBooking>(`/bookings/group/${bookingId}`),

  // Update group booking (organizer only)
  updateGroupBooking: async (
    bookingId: string,
    updates: Partial<GroupBookingRequest>,
  ): Promise<{ message: string; booking: GroupBooking; updatedFields: string[] }> => fetchApi(`/bookings/group/${bookingId}`, 'PUT', updates),

  // Cancel group booking (organizer only)
  cancelGroupBooking: async (
    bookingId: string,
    reason?: string,
  ): Promise<{ message: string }> => fetchApi<{ message: string }>(`/bookings/group/${bookingId}`, 'DELETE', { reason }),

  // Send invitations to join group
  sendGroupInvitations: async (
    bookingId: string,
    invitations: GroupInvitationRequest[],
  ): Promise<SendInvitationsResponse> => fetchApi<SendInvitationsResponse>(`/bookings/group/${bookingId}/invite`, 'POST', { invitations }),

  // Respond to group invitation (accept/decline)
  respondToGroupInvitation: async (
    bookingId: string,
    response: GroupInvitationResponse,
  ): Promise<{ message: string; status: string; groupName: string }> => fetchApi(`/bookings/group/${bookingId}/respond`, 'PUT', response),

  // Get group participants
  getGroupParticipants: async (bookingId: string): Promise<GroupParticipantsResponse> => fetchApi<GroupParticipantsResponse>(`/bookings/group/${bookingId}/participants`),

  // Remove participant from group (organizer only)
  removeParticipant: async (
    bookingId: string,
    participantId: string,
  ): Promise<{ message: string }> => fetchApi<{ message: string }>(`/bookings/group/${bookingId}/participants/${participantId}`, 'DELETE'),

  // Join group by invite code
  joinGroupByCode: async (inviteCode: string): Promise<JoinGroupResponse> => fetchApi<JoinGroupResponse>(`/bookings/group/join/${inviteCode}`, 'POST'),

  // Leave group (participant only)
  leaveGroup: async (bookingId: string): Promise<{ message: string }> => fetchApi<{ message: string }>(`/bookings/group/${bookingId}/leave`, 'POST'),

  // Get user's group bookings
  getMyGroupBookings: async (filters?: GroupBookingFilters): Promise<GroupBooking[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    const queryString = params.toString();
    const endpoint = queryString ? `/bookings/my-groups?${queryString}` : '/bookings/my-groups';
    return fetchApi<GroupBooking[]>(endpoint);
  },

  // Get public group bookings
  getPublicGroupBookings: async (filters?: {
    location?: string;
    tags?: string[];
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
  }): Promise<PublicGroupBooking[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    const queryString = params.toString();
    const endpoint = queryString ? `/bookings/public-groups?${queryString}` : '/bookings/public-groups';
    return fetchApi<PublicGroupBooking[]>(endpoint);
  },

  // Get group booking statistics
  getGroupBookingStats: async (bookingId: string): Promise<GroupBookingStats> => fetchApi<GroupBookingStats>(`/bookings/group/${bookingId}/stats`),

  // Search group bookings by invite code
  searchByInviteCode: async (inviteCode: string): Promise<PublicGroupBooking | null> => {
    try {
      return await fetchApi<PublicGroupBooking>(`/bookings/group/search/${inviteCode}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  },

  // Helper functions for group bookings
  isUserOrganizer: (booking: GroupBooking, userId: string): boolean => booking.organizer.id === userId,

  isUserParticipant: (booking: GroupBooking, userId: string): boolean => booking.participants.some((p) => p.user.id === userId),

  getUserParticipantStatus: (booking: GroupBooking, userId: string): string => {
    if (groupBookingService.isUserOrganizer(booking, userId)) {
      return 'organizer';
    }
    const participant = booking.participants.find((p) => p.user.id === userId);
    return participant ? participant.status : 'none';
  },

  canUserInvite: (booking: GroupBooking, userId: string): boolean => groupBookingService.isUserOrganizer(booking, userId)
           || booking.groupSettings.allowParticipantInvites,

  canUserManage: (booking: GroupBooking, userId: string): boolean => groupBookingService.isUserOrganizer(booking, userId),

  canUserLeave: (booking: GroupBooking, userId: string): boolean => groupBookingService.isUserParticipant(booking, userId)
           && !groupBookingService.isUserOrganizer(booking, userId),

  getAvailableSpots: (booking: GroupBooking): number => booking.maxParticipants - booking.currentParticipantCount,

  canAcceptMoreParticipants: (booking: GroupBooking): boolean => booking.currentParticipantCount < booking.maxParticipants,

  hasMinimumParticipants: (booking: GroupBooking): boolean => booking.currentParticipantCount >= booking.minParticipants,
};

// Export both services as default
export default {
  bookingService,
  groupBookingService,
};
