// app/types/groupBooking.ts - GROUP BOOKING TYPE DEFINITIONS

export interface GroupParticipant {
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      profession?: string;
      location?: string;
    };
    status: 'invited' | 'accepted' | 'declined' | 'pending';
    invitedAt: string;
    respondedAt?: string;
    invitedBy?: {
      id: string;
      name: string;
    };
  }

export interface GroupSettings {
    allowParticipantInvites: boolean;
    requireApproval: boolean;
    sendReminders: boolean;
  }

export interface GroupBooking {
    id: string;
    // Basic booking fields
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
    numberOfPeople: number;
    specialRequests?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';

    // Group-specific fields
    isGroupBooking: true;
    groupName: string;
    groupDescription?: string;
    organizer: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    participants: GroupParticipant[];
    maxParticipants: number;
    minParticipants: number;
    inviteCode: string;
    isPublic: boolean;
    tags: string[];
    groupSettings: GroupSettings;

    // Computed properties (virtuals)
    acceptedParticipants?: GroupParticipant[];
    pendingParticipants?: GroupParticipant[];
    currentParticipantCount: number;
    hasMinimumParticipants: boolean;
    canAcceptMoreParticipants: boolean;

    // Additional metadata
    userRole?: 'organizer' | 'participant';
    participantStatus?: 'organizer' | 'invited' | 'accepted' | 'declined' | 'pending' | 'none';

    // Timestamps
    createdAt: string;
    updatedAt: string;
  }

export interface GroupInvite {
    id: string;
    booking: string | GroupBooking;
    inviter: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    invitee: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    inviteeEmail: string;
    status: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';
    inviteMethod: 'email' | 'in-app' | 'link';
    personalMessage?: string;
    expiresAt: string;
    respondedAt?: string;
    viewedAt?: string;
    remindersSent: number;
    lastReminderSent?: string;

    // Computed properties
    isExpired?: boolean;
    canRespond?: boolean;
    daysUntilExpiration?: number;

    createdAt: string;
    updatedAt: string;
  }

export interface GroupBookingRequest {
    workspaceId: string;
    workspaceName: string;
    workspaceAddress: string;
    workspaceType?: string;
    workspacePhoto?: string;
    date: string;
    startTime: string;
    endTime: string;
    roomType: string;
    groupName: string;
    groupDescription?: string;
    maxParticipants?: number;
    minParticipants?: number;
    isPublic?: boolean;
    tags?: string[];
    specialRequests?: string;
    groupSettings?: Partial<GroupSettings>;
  }

export interface GroupInvitationRequest {
    email?: string;
    userId?: string;
    personalMessage?: string;
  }

export interface GroupInvitationResponse {
    response: 'accepted' | 'declined';
    message?: string;
  }

export interface GroupBookingStats {
    groupName: string;
    totalCapacity: number;
    currentParticipants: number;
    availableSpots: number;
    hasMinimumParticipants: boolean;
    participantBreakdown: {
      accepted?: number;
      pending?: number;
      invited?: number;
      declined?: number;
    };
    inviteStats: {
      pending: number;
      accepted: number;
      declined: number;
      expired: number;
      cancelled: number;
      total: number;
    };
    inviteCode: string;
    isPublic: boolean;
  }

export interface GroupParticipantsResponse {
    organizer: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    participants: GroupParticipant[];
    totalCount: number;
    acceptedCount: number;
    pendingCount: number;
    capacity: {
      current: number;
      maximum: number;
      minimum: number;
      available: number;
    };
  }

export interface CreateGroupBookingResponse {
    booking: GroupBooking;
    message: string;
  }

export interface SendInvitationsResponse {
    message: string;
    successCount: number;
    failureCount: number;
    results: Array<{
      email: string;
      userId?: string;
      success: boolean;
      error?: string;
      inviteId?: string;
    }>;
  }

export interface JoinGroupResponse {
    success: boolean;
    status: 'accepted' | 'pending';
    booking: GroupBooking;
    requiresApproval: boolean;
    message: string;
  }

export interface GroupInviteNotification {
    id: string;
    type: 'session';
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
    relatedSession?: {
      id: string;
      title: string;
      date: string;
      time: string;
    };
    metadata?: {
      inviteType: 'group_booking';
      bookingId: string;
      personalMessage?: string;
    };
    createdAt: string;
  }

// Utility types for filtering and sorting
export type GroupBookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'pending';
export type GroupUserRole = 'organizer' | 'participant';
export type ParticipantStatus = 'invited' | 'accepted' | 'declined' | 'pending';
export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';

export interface GroupBookingFilters {
    status?: GroupBookingStatus;
    role?: GroupUserRole;
    dateFrom?: string;
    dateTo?: string;
    tags?: string[];
    location?: string;
  }

export interface PublicGroupBooking {
    id: string;
    groupName: string;
    groupDescription?: string;
    workspace: {
      id: string;
      name: string;
      address: string;
      type: string;
    };
    date: string;
    startTime: string;
    endTime: string;
    tags: string[];
    maxParticipants: number;
    currentParticipantCount: number;
    organizer: {
      id: string;
      name: string;
      avatar?: string;
      profession?: string;
    };
  }

// Form validation types
export interface GroupBookingFormData {
    workspace: {
      id: string;
      name: string;
      address: string;
      type: string;
      photo?: string;
    };
    date: string;
    startTime: string;
    endTime: string;
    roomType: string;
    groupName: string;
    groupDescription: string;
    maxParticipants: number;
    minParticipants: number;
    isPublic: boolean;
    tags: string[];
    specialRequests: string;
    allowParticipantInvites: boolean;
    requireApproval: boolean;
    sendReminders: boolean;
  }

export interface GroupBookingFormErrors {
    workspace?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    roomType?: string;
    groupName?: string;
    groupDescription?: string;
    maxParticipants?: string;
    minParticipants?: string;
    tags?: string;
    general?: string;
  }

// Event types for group booking actions
export type GroupBookingEvent =
    | 'created'
    | 'updated'
    | 'cancelled'
    | 'participant_joined'
    | 'participant_left'
    | 'participant_removed'
    | 'invitation_sent'
    | 'invitation_accepted'
    | 'invitation_declined'
    | 'minimum_reached'
    | 'maximum_reached';

export interface GroupBookingEventData {
    type: GroupBookingEvent;
    bookingId: string;
    userId?: string;
    participantId?: string;
    message?: string;
    timestamp: string;
  }

// Hook return types
export interface UseGroupBookingReturn {
    groupBooking: GroupBooking | null;
    loading: boolean;
    error: string | null;
    participants: GroupParticipantsResponse | null;
    stats: GroupBookingStats | null;
    userRole: 'organizer' | 'participant' | 'none';
    canManage: boolean;
    canInvite: boolean;
    canLeave: boolean;
    refreshBooking: () => Promise<void>;
  }

export interface UseGroupBookingsReturn {
    groupBookings: GroupBooking[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    createGroupBooking: (data: GroupBookingRequest) => Promise<GroupBooking>;
    updateGroupBooking: (id: string, data: Partial<GroupBookingRequest>) => Promise<GroupBooking>;
    cancelGroupBooking: (id: string, reason?: string) => Promise<void>;
  }

// API response types
export interface ApiResponse<T> {
    data?: T;
    message: string;
    success: boolean;
    error?: string;
  }

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }

// Component prop types
export interface GroupBookingCardProps {
    booking: GroupBooking;
    onJoin?: (bookingId: string) => Promise<void>;
    onLeave?: (bookingId: string) => Promise<void>;
    onCancel?: (bookingId: string, reason?: string) => Promise<void>;
    onViewDetails?: (bookingId: string) => void;
    showActions?: boolean;
    compact?: boolean;
  }

export interface GroupInviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    onInvitesSent?: (results: SendInvitationsResponse) => void;
  }

export interface GroupParticipantsModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: GroupBooking;
    onParticipantRemoved?: (participantId: string) => void;
  }

export interface JoinGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    inviteCode?: string;
    bookingId?: string;
    onJoined?: (booking: GroupBooking) => void;
  }
