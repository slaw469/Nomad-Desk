// app/services/bookingService.ts

// Base API URL from environment or fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Booking interfaces
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
  date: string;
  startTime: string;
  endTime: string;
  roomType: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  numberOfPeople: number;
  specialRequests?: string;
  totalPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingRequest {
  workspaceId: string;
  date: string;
  startTime: string;
  endTime: string;
  roomType: string;
  numberOfPeople: number;
  specialRequests?: string;
}

// Study session interfaces
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
  invitedParticipants?: string[]; // array of user IDs
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
  
  // Check workspace availability
  checkAvailability: async (
    workspaceId: string, 
    date: string, 
    startTime: string, 
    endTime: string
  ): Promise<{
    available: boolean;
    availableSlots?: { startTime: string; endTime: string }[];
  }> => {
    return fetchApi<{
      available: boolean;
      availableSlots?: { startTime: string; endTime: string }[];
    }>(`/bookings/availability?workspaceId=${workspaceId}&date=${date}&startTime=${startTime}&endTime=${endTime}`);
  }
};

// Study Session Service methods
export const studySessionService = {
  // Get all study sessions
  getAllStudySessions: async (): Promise<StudySession[]> => {
    return fetchApi<StudySession[]>('/study-sessions');
  },
  
  // Get hosted study sessions
  getHostedStudySessions: async (): Promise<StudySession[]> => {
    return fetchApi<StudySession[]>('/study-sessions/hosted');
  },
  
  // Get upcoming study sessions
  getUpcomingStudySessions: async (): Promise<StudySession[]> => {
    return fetchApi<StudySession[]>('/study-sessions/upcoming');
  },
  
  // Get past study sessions
  getPastStudySessions: async (): Promise<StudySession[]> => {
    return fetchApi<StudySession[]>('/study-sessions/past');
  },
  
  // Get study session by ID
  getStudySessionById: async (sessionId: string): Promise<StudySession> => {
    return fetchApi<StudySession>(`/study-sessions/${sessionId}`);
  },
  
  // Create a new study session
  createStudySession: async (sessionData: StudySessionRequest): Promise<StudySession> => {
    return fetchApi<StudySession>('/study-sessions', 'POST', sessionData);
  },
  
  // Update study session
  updateStudySession: async (sessionId: string, sessionData: Partial<StudySessionRequest>): Promise<StudySession> => {
    return fetchApi<StudySession>(`/study-sessions/${sessionId}`, 'PUT', sessionData);
  },
  
  // Cancel study session
  cancelStudySession: async (sessionId: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/study-sessions/${sessionId}/cancel`, 'PUT');
  },
  
  // Join a study session
  joinStudySession: async (sessionId: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/study-sessions/${sessionId}/join`, 'PUT');
  },
  
  // Leave a study session
  leaveStudySession: async (sessionId: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/study-sessions/${sessionId}/leave`, 'PUT');
  },
  
  // Invite people to a study session
  inviteToStudySession: async (sessionId: string, userIds: string[]): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/study-sessions/${sessionId}/invite`, 'POST', { userIds });
  },
  
  // Respond to study session invitation
  respondToInvitation: async (
    sessionId: string, 
    response: 'accept' | 'decline'
  ): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/study-sessions/${sessionId}/respond`, 'PUT', { response });
  },
  
  // Get public study sessions nearby
  getNearbyStudySessions: async (
    latitude: number, 
    longitude: number, 
    radiusInKm: number = 5
  ): Promise<StudySession[]> => {
    return fetchApi<StudySession[]>(
      `/study-sessions/nearby?lat=${latitude}&lng=${longitude}&radius=${radiusInKm}`
    );
  },
  
  // Search study sessions by topic, title, etc.
  searchStudySessions: async (query: string): Promise<StudySession[]> => {
    return fetchApi<StudySession[]>(`/study-sessions/search?q=${encodeURIComponent(query)}`);
  }
};

export default { bookingService, studySessionService };