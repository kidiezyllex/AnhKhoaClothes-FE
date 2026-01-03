import React from 'react'
import { Outlet } from 'react-router-dom'
import SidebarLayout from '@/components/layout/SidebarLayout'

const AdminLayout: React.FC = () => {
  return (
    <SidebarLayout>
      <Outlet />
    </SidebarLayout>
  )
}

export default AdminLayout 