export type NotificationType = 
    | 'NEW_PROPOSAL'
    | 'PROPOSAL_ACCEPTED'
    | 'MESSAGE'
    | 'SYSTEM';

export interface INotification {
    recipientId: string;
    senderId?: string;
    type: NotificationType;
    content: string;
    metadata?: Record<string, any>;
    read: boolean;
    createdAt: Date;
}