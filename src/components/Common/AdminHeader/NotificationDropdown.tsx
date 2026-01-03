'use client';

import { useState } from 'react';
import { IconBell } from '@tabler/icons-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { mdiBell } from '@mdi/js';
import Icon from '@mdi/react';

interface Notification {
  id: string;
  title: string;
  content: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
}

//                                                                                                                     Dữ liệu giả lập cho thông báo
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Đơn hàng mới',
    content: 'Bạn có đơn hàng mới #DH12345 cần xử lý',
    time: '5 phút trước',
    type: 'info',
    read: false,
  },
  {
    id: '2',
    title: 'Hết hàng',
    content: 'Sản phẩm "Prada Air Force 1" sắp hết hàng',
    time: '1 giờ trước',
    type: 'warning',
    read: false,
  },
  {
    id: '3',
    title: 'Nhập hàng thành công',
    content: 'Đơn nhập hàng #IMP-7890 đã được xác nhận',
    time: '3 giờ trước',
    type: 'success',
    read: true,
  },
  {
    id: '4',
    title: 'Lỗi thanh toán',
    content: 'Đơn hàng #HD6789 gặp lỗi khi thanh toán',
    time: '1 ngày trước',
    type: 'error',
    read: true,
  },
];

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 text-blue-600';
      case 'warning':
        return 'bg-yellow-50 text-yellow-600';
      case 'success':
        return 'bg-green-50 text-primary';
      case 'error':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-50 text-maintext';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
        variant="ghost"
        className="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 bg-gray-100">
          <Icon path={mdiBell} size={0.7} className='text-maintext'/>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Thông báo</span>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-xs text-primary hover:underline"
            >
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start p-3 cursor-pointer transition-colors",
                  !notification.read && 'bg-gray-50'
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between w-full">
                  <span className={cn("text-sm font-medium px-2 py-0.5 rounded", getTypeStyles(notification.type))}>
                    {notification.title}
                  </span>
                  <span className="text-xs text-maintext">{notification.time}</span>
                </div>
                <p className="text-sm text-maintext mt-1">{notification.content}</p>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-maintext">
              Không có thông báo nào
            </div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-primary cursor-pointer hover:bg-gray-50">
          Xem tất cả thông báo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 