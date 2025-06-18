export interface Contact {
    _id: string;
    fullName: string;
    role: string;
    email: string;
    id: string;
    avatar: string;
    isOnline: boolean;
}

export interface IMessage {
    id: string;
    text: string;
    senderId: string;
    contactId: string;
    timestamp: string;
    isRead: boolean;
}

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'contact';
    senderId: string;
    contactId: string;
    timestamp: string;
    isRead: boolean;
}
