export interface INotificationFilter {
  type?: 'EMAIL' | 'SYSTEM';
  status?: 'PENDING' | 'SENT' | 'FAILED';
  relatedTo?: 'VOUCHER' | 'ORDER' | 'PROMOTION' | 'SYSTEM';
  page?: number;
  limit?: number;
  search?: string;
}

export interface INotificationCreate {
  type: 'EMAIL' | 'SYSTEM';
  title: string;
  content: string;
  recipients?: string[];
  relatedTo: 'VOUCHER' | 'ORDER' | 'PROMOTION' | 'SYSTEM';
  relatedId: string;
}

export interface INotificationUpdate {
  title?: string;
  content?: string;
  recipients?: string[];
  status?: 'PENDING' | 'SENT' | 'FAILED';
}

export interface INotificationStatusUpdate {
  status: 'PENDING' | 'SENT' | 'FAILED';
}

export interface ISendToAllCustomers {
  type: 'EMAIL' | 'SYSTEM';
  title: string;
  content: string;
  relatedTo: 'VOUCHER' | 'ORDER' | 'PROMOTION' | 'SYSTEM';
  relatedId: string;
} 