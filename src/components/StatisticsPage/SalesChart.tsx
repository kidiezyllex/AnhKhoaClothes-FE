'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from '@ant-design/charts';
import { monthlySales } from './mockData';
import { motion } from 'framer-motion';

export const SalesChart = () => {
  const config = {
    data: monthlySales,
    padding: 'auto',
    xField: 'date',
    yField: 'value',
    smooth: true,
    meta: {
      value: {
        formatter: (v: number) => `${(v / 1000000).toFixed(1)}tr`,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: 'Doanh thu', value: `${(datum.value / 1000000).toFixed(1)} triệu đồng` };
      },
    },
    lineStyle: {
      stroke: '#2C8B3D',
      lineWidth: 3,
    },
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fill: '#2C8B3D',
        stroke: '#fff',
        lineWidth: 2,
      },
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-4"
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className='text-lg font-medium text-maintext mb-2'>Doanh thu theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Line {...config} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 