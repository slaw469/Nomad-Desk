// app/services/networkService.ts

// Base API URL from environment or fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Network interfaces
export interface Connection {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    profession?: string;
    location?: string;
  };
  status: 'pending' | 'connected' | 'rejected';
  initiator: boolean; // true if current user sent the request
  createdAt: string;
  updatedAt: string;
  mutualConnections?: number;
  lastActive?: string;
}

export interface ConnectionRequest {
  id: string;
  sender: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    profession?: string;
    location?: string;
  };
  recipient: {
    id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  mutualConnections?: number;
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

// Network Service methods
export const networkService = {
  // Get all connections
  getConnections: async (): Promise<Connection[]> => {
    return fetchApi<Connection[]>('/network/connections');
  },
  
  // Get connection requests (received)
  getConnectionRequests: async (): Promise<ConnectionRequest[]> => {
    return fetchApi<ConnectionRequest[]>('/network/requests');
  },
  
  // Get sent connection requests
  getSentRequests: async (): Promise<ConnectionRequest[]> => {
    return fetchApi<ConnectionRequest[]>('/network/requests/sent');
  },
  
  // Send a connection request
  sendConnectionRequest: async (userId: string): Promise<ConnectionRequest> => {
    return fetchApi<ConnectionRequest>('/network/request', 'POST', { userId });
  },
  
  // Accept a connection request
  acceptRequest: async (requestId: string): Promise<Connection> => {
    return fetchApi<Connection>(`/network/request/${requestId}/accept`, 'PUT');
  },
  
  // Reject a connection request
  rejectRequest: async (requestId: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/network/request/${requestId}/reject`, 'PUT');
  },
  
  // Remove a connection
  removeConnection: async (connectionId: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/network/connection/${connectionId}`, 'DELETE');
  },
  
  // Get connection statistics
  getConnectionStats: async (): Promise<{ 
    totalConnections: number;
    pendingRequests: number;
    mutualConnections: Record<string, number>;
  }> => {
    return fetchApi<{ 
      totalConnections: number;
      pendingRequests: number;
      mutualConnections: Record<string, number>;
    }>('/network/stats');
  },
  
  // Get suggested connections based on interests, etc.
  getSuggestedConnections: async (): Promise<Connection[]> => {
    return fetchApi<Connection[]>('/network/suggested');
  },
  
  // Get mutual connections with a specific user
  getMutualConnections: async (userId: string): Promise<Connection[]> => {
    return fetchApi<Connection[]>(`/network/mutual/${userId}`);
  },
  
  // Search connections by name, skills, etc.
  searchConnections: async (query: string): Promise<Connection[]> => {
    return fetchApi<Connection[]>(`/network/search?q=${encodeURIComponent(query)}`);
  }
};

export default networkService;