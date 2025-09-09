// Firestore data model types based on the use case

export interface User {
  phone: string;
  displayName: string;
  username: string;
  photoURL?: string;
  about?: string;
  createdAt: string;
  updatedAt: string;
  presence: {
    online: boolean;
    lastSeen: string;
  };
  devices: Array<{
    id: string;
    agent: string;
    createdAt: string;
  }>;
  pushTokens: Array<{
    token: string;
    platform: 'web' | 'ios' | 'android';
    createdAt: string;
  }>;
  privacy: {
    readReceipts: boolean;
    lastSeenVisible: 'everyone' | 'contacts' | 'nobody';
    allowCalls: boolean;
  };
  safety: {
    blockedUserIds: string[];
    reportsCount: number;
  };
  softDeleted: boolean;
}

export interface Username {
  userId: string;
}

export interface Conversation {
  members: string[];
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    id: string;
    from: string;
    type: MessageType;
    preview: string;
    createdAt: string;
  };
  lastMessageAt?: string;
  unreadCount: Record<string, number>;
  settings: {
    mutedBy: string[];
    archivedBy: string[];
  };
}

export type MessageType = 'text' | 'image' | 'audio' | 'voice' | 'document' | 'sticker' | 'system';

export interface Message {
  from: string;
  to?: string;
  type: MessageType;
  text?: string;
  media?: {
    url: string;
    type: string;
    size: number;
    duration?: number;
    thumb?: string;
    width?: number;
    height?: number;
  };
  status: MessageStatus;
  reactions?: Record<string, string>;
  replyTo?: string;
  createdAt: string;
  editedAt?: string;
  deletedFor: string[];
}

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read';

export interface Call {
  callerId: string;
  calleeId: string;
  conversationId: string;
  status: CallStatus;
  media: 'audio' | 'video';
  startedAt?: string;
  endedAt?: string;
  duration?: number;
  reason?: string;
  quality?: {
    rtt: number;
    jitter: number;
  };
}

export type CallStatus = 'ringing' | 'accepted' | 'rejected' | 'ended' | 'missed';

export interface Report {
  reportedUserId: string;
  reporterUserId: string;
  conversationId?: string;
  messageId?: string;
  reason: string;
  evidenceUrls: string[];
  createdAt: string;
  state: 'open' | 'in_review' | 'closed';
}

// Socket.IO event types
export interface SocketEvents {
  // Chat namespace
  join: { userId: string };
  'message:send': {
    conversationId: string;
    tempId: string;
    type: MessageType;
    text?: string;
    mediaRef?: string;
    replyTo?: string;
  };
  'message:delivered': {
    conversationId: string;
    messageIds: string[];
  };
  'message:read': {
    conversationId: string;
    messageIds: string[];
  };
  'typing:start': { conversationId: string };
  'typing:stop': { conversationId: string };

  // Server to client
  'message:new': {
    conversationId: string;
    message: Message & { id: string };
  };
  'message:update': {
    conversationId: string;
    messageId: string;
    patch: Partial<Message>;
  };
  'presence:update': {
    userId: string;
    online: boolean;
    lastSeen: string;
  };
  'typing:update': {
    conversationId: string;
    userId: string;
    isTyping: boolean;
  };

  // Calls namespace
  'call:init': {
    calleeId: string;
    media: 'audio' | 'video';
    conversationId: string;
  };
  'call:accept': { callId: string };
  'call:reject': { callId: string; reason?: string };
  'call:end': { callId: string; reason?: string };
  'webrtc:offer': { callId: string; sdp: string };
  'webrtc:answer': { callId: string; sdp: string };
  'webrtc:ice-candidate': { callId: string; candidate: RTCIceCandidate };

  // Server to client
  'call:ringing': {
    callId: string;
    fromUser: Pick<User, 'displayName' | 'photoURL'>;
    media: 'audio' | 'video';
  };
  'call:status': {
    callId: string;
    status: CallStatus;
    startedAt?: string;
    endedAt?: string;
    duration?: number;
  };
}

// UI state types
export interface UIState {
  currentUserId?: string;
  selectedConversationId?: string;
  theme: 'light' | 'dark';
  language: string;
  sidebarCollapsed: boolean;
  activeCall?: {
    callId: string;
    type: 'incoming' | 'outgoing' | 'active';
    contact: Pick<User, 'displayName' | 'photoURL'>;
    media: 'audio' | 'video';
  };
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Auth types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Onboarding types
export interface OnboardingState {
  step: 'phone' | 'otp' | 'profile' | 'complete';
  phone?: string;
  otpSent?: boolean;
  otpResendCount: number;
  otpResendAvailableAt?: number;
}