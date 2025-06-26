// Define the metadata type as an indexable interface
interface IMetadata {
  [key: string]: any;
}

// Define the main Notification document interface
export interface NotificationTypes {
  userId:string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  actionLink?: string;
  content?: string;
  metadata?: IMetadata;
  createdAt: Date;
  updatedAt: Date;
}