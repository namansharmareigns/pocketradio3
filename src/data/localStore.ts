// User profiles for the two fixed users
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  password: string; // In a real app, never store passwords in plain text
}

// Connection between users
export interface Connection {
  id: string;
  user_id: string;
  connected_user_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

// Notification between users
export interface Notification {
  id: string;
  sender_id: string;
  recipient_id: string;
  type: "emergency" | "fun" | "reminder";
  message: string;
  audio_url: string | null;
  read: boolean;
  created_at: string;
}

// Chat message between users
export interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  audio_url: string | null;
  type: "emergency" | "fun" | "reminder";
  created_at: string;
}

// Our two fixed users
export const users: UserProfile[] = [
  {
    id: "user1",
    username: "asmita",
    email: "asmita@gmail.com",
    password: "password123"
  },
  {
    id: "user2",
    username: "naman",
    email: "naman@gmail.com",
    password: "password123"
  }
];

// Local storage keys
const CONNECTIONS_KEY = 'sound_sync_connections';
const NOTIFICATIONS_KEY = 'sound_sync_notifications';
const CHAT_MESSAGES_KEY = 'sound_sync_chat_messages';

// Helper to save connections to localStorage
export const saveConnections = (connections: Connection[]): void => {
  localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
};

// Helper to load connections from localStorage
export const loadConnections = (): Connection[] => {
  const stored = localStorage.getItem(CONNECTIONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper to save notifications to localStorage
export const saveNotifications = (notifications: Notification[]): void => {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};

// Helper to load notifications from localStorage
export const loadNotifications = (): Notification[] => {
  const stored = localStorage.getItem(NOTIFICATIONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper to save chat messages to localStorage
export const saveChatMessages = (messages: ChatMessage[]): void => {
  localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
};

// Helper to load chat messages from localStorage
export const loadChatMessages = (): ChatMessage[] => {
  const stored = localStorage.getItem(CHAT_MESSAGES_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Initial connections (load from localStorage if available)
export const connections: Connection[] = loadConnections();

// Initial notifications (load from localStorage if available)
export const notifications: Notification[] = loadNotifications();

// Initial chat messages (load from localStorage if available)
export const chatMessages: ChatMessage[] = loadChatMessages();

// Helper to generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Helper to get current timestamp
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Helper to find user by email and password
export const findUserByCredentials = (email: string, password: string): UserProfile | null => {
  return users.find(user => user.email === email && user.password === password) || null;
};

// Helper to find user by ID
export const findUserById = (id: string): UserProfile | null => {
  return users.find(user => user.id === id) || null;
};

// Helper to get accepted connections for a user
export const getAcceptedConnectionsForUser = (userId: string): Connection[] => {
  const allConnections = loadConnections();
  return allConnections.filter(connection => 
    (connection.user_id === userId || connection.connected_user_id === userId) && 
    connection.status === "accepted"
  );
};

// Helper to get chat history between two users
export const getChatHistoryBetweenUsers = (userId1: string, userId2: string): ChatMessage[] => {
  const allMessages = loadChatMessages();
  return allMessages.filter(message => 
    (message.sender_id === userId1 && message.recipient_id === userId2) || 
    (message.sender_id === userId2 && message.recipient_id === userId1)
  ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
};

// Helper to add a new chat message
export const addChatMessage = (message: ChatMessage): void => {
  const messages = loadChatMessages();
  messages.push(message);
  saveChatMessages(messages);
};

// Session management for cross-device usage
interface Session {
  userId: string;
  token: string;
  expiresAt: number;
}

const SESSION_KEY = 'sound_sync_session';

// Create a new session for a user
export const createSession = (userId: string): string => {
  const token = generateId() + generateId(); // Longer token for better security
  const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
  
  const session: Session = {
    userId,
    token,
    expiresAt
  };
  
  // Store in localStorage
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  
  return token;
};

// Validate the current session
export const validateSession = (): string | null => {
  const sessionData = localStorage.getItem(SESSION_KEY);
  
  if (!sessionData) return null;
  
  try {
    const session: Session = JSON.parse(sessionData);
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    
    return session.userId;
  } catch (error) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

// Clear the current session
export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

// Check for new notifications (polling)
export const checkForNewNotifications = (userId: string): Notification[] => {
  const allNotifications = loadNotifications();
  return allNotifications.filter(notification => 
    notification.recipient_id === userId && !notification.read
  );
};
