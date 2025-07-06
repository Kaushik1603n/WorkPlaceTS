export interface ApiUser {
  _id: string;
  fullName: string;
  role: string;
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
  likes: string[];
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
  likes: string[];
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
  likes: string[];
}

export interface LatestMessagedUser {
  user: ApiUser;
  latestMessage: ApiMessage | null;
  unreadCount: number;
}

export interface GetLatestMessagesResponse {
  latestMessagedUsers: LatestMessagedUser[];
}