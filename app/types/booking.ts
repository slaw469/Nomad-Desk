export interface Booking {
  id: string;
  userId: string;
  workspaceId: string;
  date: string;
  startTime: string;
  endTime: string;
  numberOfPeople: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  workspace: {
    id: string;
    name: string;
    address: string;
    photo?: string;
  };
}

export interface BookingRequest {
  workspaceId: string;
  date: string;
  startTime: string;
  endTime: string;
  numberOfPeople: number;
  specialRequests?: string;
} 