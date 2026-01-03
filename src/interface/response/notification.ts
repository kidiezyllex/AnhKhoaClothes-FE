export interface INotification {
  id: string;
  type: 'EMAIL' | 'SYSTEM';
  title: string;
  content: string;
  recipients: {
    id: string;
    fullName?: string;
    email?: string;
  }[];
  relatedTo: 'VOUCHER' | 'ORDER' | 'PROMOTION' | 'SYSTEM';
  relatedId: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

export interface INotificationResponse {
  success: boolean;
  message: string;
  data: INotification;
}

export interface INotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: INotification[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface IActionResponse {
  success: boolean;
  message: string;
  data?: any;
} 