'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Column } from '@ant-design/charts';
import { weeklyOrders } from './mockData';
import { motion } from 'framer-motion';

export const OrdersChart = () => {
  const config = {
    data: weeklyOrders,
    xField: 'date',
    yField: 'value',
    color: '#88C140',
    label: {
      position: 'top',
      style: {
        fill: '#595959',
        fontSize: 12,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: 'Đơn hàng', value: datum.value };
      },
    },
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1500,
      },
    },
    columnStyle: {
      radius: [6, 6, 0, 0],
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-4"
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className='text-lg font-medium text-maintext mb-2'>Đơn hàng trong tuần</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Column {...config} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 