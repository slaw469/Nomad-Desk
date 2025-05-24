// app/services/bookingService.ts

// Base API URL from environment or fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5003/api';

// Updated booking interfaces to match backend model
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
  // Virtual fields from backend
  durationMinutes?: number;
  formattedDate?: string;
  formattedTimeRange?: string;
  isActive?: boolean;
  isUpcoming?: boolean;
  isPast?: boolean;
}

export interface BookingRequest {
    workspaceId: string;
    workspaceName: string; // NEW: Required workspace name
    workspaceAddress: string; // NEW: Required workspace address
    workspaceType?: string; // NEW: Optional workspace type
    workspacePhoto?: string; // NEW: Optional workspace photo URL
    date: string;
    startTime: string;
    endTime: string;
    roomType: string;
    numberOfPeople: number;
    specialRequests?: string;
  }

export interface BookingStats {
  upcoming: number;
  past: number;
  total: number;
  cancelled: number;
}

export interface AvailabilityResponse {
  available: boolean;
  availableSlots?: Array<{
    startTime: string;
    endTime: string;
  }>;
}

// Study session interfaces (keeping your existing ones)
export interface StudySession {
  id: string;
  title: string;
  description?: string;
  host: {
    id: string;
    name: string;
    avatar?: string;
  };
  workspace: {
    id: string;
    name: string;
    address: string;
    photo?: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    status: 'accepted' | 'pending' | 'declined';
  }[];
  maxParticipants: number;
  topics?: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface StudySessionRequest {
  title: string;
  description?: string;
  workspaceId: string;
  date: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  topics?: string[];
  invitedParticipants?: string[];
}

// Generic fetch function for API calls
const fetchApi = async <T>(
  endpoint: string, 
  method: string = 'GET', 
  data?: any
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

// Booking Service methods
export const bookingService = {
  // Get all bookings
  getAllBookings: async (): Promise<Booking[]> => {
    return fetchApi<Booking[]>('/bookings');
  },
  
  // Get upcoming bookings
  getUpcomingBookings: async (): Promise<Booking[]> => {
    return fetchApi<Booking[]>('/bookings/upcoming');
  },
  
  // Get past bookings
  getPastBookings: async (): Promise<Booking[]> => {
    return fetchApi<Booking[]>('/bookings/past');
  },
  
  // Get booking by ID
  getBookingById: async (bookingId: string): Promise<Booking> => {
    return fetchApi<Booking>(`/bookings/${bookingId}`);
  },
  
  // Create a new booking
  createBooking: async (bookingData: BookingRequest): Promise<Booking> => {
    return fetchApi<Booking>('/bookings', 'POST', bookingData);
  },
  
  // Update booking
  updateBooking: async (bookingId: string, bookingData: Partial<BookingRequest>): Promise<Booking> => {
    return fetchApi<Booking>(`/bookings/${bookingId}`, 'PUT', bookingData);
  },
  
  // Cancel booking
  cancelBooking: async (bookingId: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/bookings/${bookingId}/cancel`, 'PUT');
  },
  
  // Delete booking
  deleteBooking: async (bookingId: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/bookings/${bookingId}`, 'DELETE');
  },
  
  // Check workspace availability
  checkAvailability: async (
    workspaceId: string, 
    date: string, 
    startTime: string, 
    endTime: string
  ): Promise<AvailabilityResponse> => {
    const params = new URLSearchParams({
      workspaceId,
      date,
      startTime,
      endTime
    });
    return fetchApi<AvailabilityResponse>(`/bookings/availability?${params}`);
  },

  // Get booking statistics
  getBookingStats: async (): Promise<BookingStats> => {
    return fetchApi<BookingStats>('/bookings/stats');
  },

  // Helper function to format date for API
  formatDateForApi: (date: Date): string => {
    return date.toISOString().split('T')[0];
  },

  // Helper function to format time for API
  formatTimeForApi: (date: Date): string => {
    return date.toTimeString().split(' ')[0].substring(0, 5);
  },

  // Helper function to parse API date
  parseApiDate: (dateString: string): Date => {
    return new Date(dateString);
  },

  // Helper function to check if booking can be cancelled
  canCancelBooking: (booking: Booking): boolean => {
    const now = new Date();
    const bookingDate = new Date(booking.date);
    return bookingDate >= now && booking.status !== 'cancelled' && booking.status !== 'completed';
  },

  // Helper function to check if booking can be modified
  canModifyBooking: (booking: Booking): boolean => {
    const now = new Date();
    const bookingDate = new Date(booking.date);
    return bookingDate >= now && booking.status !== 'cancelled' && booking.status !== 'completed';
  }
};

// Study Session Service methods (keeping existing implementation but making them no-ops for now)
export const studySessionService = {
  // Get all study sessions
  getAllStudySessions: async (): Promise<StudySession[]> => {
    // TODO: Implement when backend supports study sessions
    console.warn('Study sessions not yet implemented in backend');
    return [];
  },
  
  // Get hosted study sessions
  getHostedStudySessions: async (): Promise<StudySession[]> => {
    console.warn('Study sessions not yet implemented in backend');
    return [];
  },
  
  // Get upcoming study sessions
  getUpcomingStudySessions: async (): Promise<StudySession[]> => {
    console.warn('Study sessions not yet implemented in backend');
    return [];
  },
  
  // Get past study sessions
  getPastStudySessions: async (): Promise<StudySession[]> => {
    console.warn('Study sessions not yet implemented in backend');
    return [];
  },
  
  // Get study session by ID
  getStudySessionById: async (sessionId: string): Promise<StudySession> => {
    console.warn('Study sessions not yet implemented in backend');
    throw new Error('Study sessions not yet implemented');
  },
  
  // Create a new study session
  createStudySession: async (sessionData: StudySessionRequest): Promise<StudySession> => {
    console.warn('Study sessions not yet implemented in backend');
    throw new Error('Study sessions not yet implemented');
  },
  
  // Update study session
  updateStudySession: async (sessionId: string, sessionData: Partial<StudySessionRequest>): Promise<StudySession> => {
    console.warn('Study sessions not yet implemented in backend');
    throw new Error('Study sessions not yet implemented');
  },
  
  // Cancel study session
  cancelStudySession: async (sessionId: string): Promise<{ message: string }> => {
    console.warn('Study sessions not yet implemented in backend');
    throw new Error('Study sessions not yet implemented');
  },
  
  // Join a study session
  joinStudySession: async (sessionId: string): Promise<{ message: string }> => {
    console.warn('Study sessions not yet implemented in backend');
    throw new Error('Study sessions not yet implemented');
  },
  
  // Leave a study session
  leaveStudySession: async (sessionId: string): Promise<{ message: string }> => {
    console.warn('Study sessions not yet implemented in backend');
    throw new Error('Study sessions not yet implemented');
  },
  
  // Invite people to a study session
  inviteToStudySession: async (sessionId: string, userIds: string[]): Promise<{ message: string }> => {
    console.warn('Study sessions not yet implemented in backend');
    throw new Error('Study sessions not yet implemented');
  },
  
  // Respond to study session invitation
  respondToInvitation: async (
    sessionId: string, 
    response: 'accept' | 'decline'
  ): Promise<{ message: string }> => {
    console.warn('Study sessions not yet implemented in backend');
    throw new Error('Study sessions not yet implemented');
  },
  
  // Get public study sessions nearby
  getNearbyStudySessions: async (
    latitude: number, 
    longitude: number, 
    radiusInKm: number = 5
  ): Promise<StudySession[]> => {
    console.warn('Study sessions not yet implemented in backend');
    return [];
  },
  
  // Search study sessions by topic, title, etc.
  searchStudySessions: async (query: string): Promise<StudySession[]> => {
    console.warn('Study sessions not yet implemented in backend');
    return [];
  }
};

export default { bookingService, studySessionService };