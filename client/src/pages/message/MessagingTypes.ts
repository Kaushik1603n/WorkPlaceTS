
export interface ApiUser {
  _id: string;
  fullName: string;
  role: string;
  // Add other user properties if needed
}
export interface Contact {
  id: string;
  fullName: string;
  role: string;
  isOnline: boolean;
  latestMessage: Message | null;
  unreadCount: number;
}

export interface Message {
  id: string;
  text?: string;
  senderId: string;
  sender: "user" | "contact";
  contactId: string;
  timestamp: string;
  isRead: boolean;
  media?: {
    url: string;
    type: "image" | "pdf";
  };
}

export interface IMessage {
  id: string;
  text: string;
  senderId: string;
  contactId: string;
  timestamp: string;
  isRead: boolean;
  media?: {
    url: string;
    type: "image" | "pdf";
  };
}

// Add these to your MessagingTypes.ts or wherever you define your types

export interface ApiUser {
  _id: string;
  fullName: string;
  role: string;
}

export interface ApiMessage {
  id: string;
  text: string;
  senderId: string;
  contactId: string;
  timestamp: string;
  isRead: boolean;
  media?: {
    url: string;
    type: "image" | "pdf";
  };
}

export interface LatestMessagedUser {
  user: ApiUser;
  latestMessage: ApiMessage | null;
  unreadCount: number;
}

export interface GetLatestMessagesResponse {
  latestMessagedUsers: LatestMessagedUser[];
  // Add other response properties if your API returns more
}
