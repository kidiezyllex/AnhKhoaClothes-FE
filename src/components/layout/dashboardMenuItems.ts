import { MenuItem } from '@/interface/types';
import {
  mdiAccountGroup,
  mdiChartBar,
} from '@mdi/js';
export const adminMenuItems: MenuItem[] = [
  {
    id: 'user-management',
    name: 'Quản lý người dùng',
    path: '/dashboard/admin/users',
    icon: mdiAccountGroup,
    subMenu: [
      {
        id: 'users-list',
        name: 'Danh sách người dùng',
        path: '/dashboard/admin/users',
      },
      {
        id: 'users-create',
        name: 'Thêm người dùng mới',
        path: '/dashboard/admin/users/create',
      },
    ],
  },
  {
    id: 'statistics',
    name: 'Thống kê',
    path: '/dashboard/admin/statistics',
    icon: mdiChartBar,
  },
]; 