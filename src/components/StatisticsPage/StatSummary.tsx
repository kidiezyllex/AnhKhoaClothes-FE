'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Icon } from '@mdi/react';
import { mdiCashMultiple, mdiPackageVariantClosed, mdiAccountGroup, mdiTrendingUp } from '@mdi/js';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  percentage: string;
  increasing: boolean;
}

const StatCard = ({ title, value, icon, iconColor, bgColor, percentage, increasing }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="p-4 h-full">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-base text-maintext">{title}</p>
            <h3 
            className={`text-xl font-bold mt-2 ${iconColor}`}
            >{value}</h3>
            <div className="flex items-center mt-2">
              <Icon
                path={increasing ? mdiTrendingUp : mdiTrendingUp}
                size={0.7}
                className={increasing ? 'text-green-medium' : 'text-red-medium'}
              />
              <span
                className={`text-xs ml-1 ${
                  increasing ? 'text-green-medium' : 'text-red-medium'
                }`}
              >
                {percentage} {increasing ? 'tăng' : 'giảm'}
              </span>
              <span className="text-xs text-maintext ml-1">so với tháng trước</span>
            </div>
          </div>
          <div
            className={`${bgColor} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <Icon path={icon} size={1} className={iconColor} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const StatSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-stretch">
      <StatCard
        title="Doanh thu tháng"
        value="897,521,000 đ"
        icon={mdiCashMultiple}
        iconColor="text-primary"
        bgColor="bg-green-100"
        percentage="8.2%"
        increasing={true}
      />
      <StatCard
        title="Đơn hàng tháng"
        value="352"
        icon={mdiPackageVariantClosed}
        iconColor="text-blue-600"
        bgColor="bg-blue-100"
        percentage="5.3%"
        increasing={true}
      />
      <StatCard
        title="Khách hàng mới"
        value="87"
        icon={mdiAccountGroup}
        iconColor="text-purple-600"
        bgColor="bg-purple-100"
        percentage="12.7%"
        increasing={true}
      />
      <StatCard
        title="Tỷ lệ chuyển đổi"
        value="28.5%"
        icon={mdiTrendingUp}
        iconColor="text-amber-600"
        bgColor="bg-amber-100"
        percentage="2.1%"
        increasing={true}
      />
    </div>
  );
}; 