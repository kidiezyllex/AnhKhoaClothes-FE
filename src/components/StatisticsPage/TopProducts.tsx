'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { topProducts } from './mockData';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

export const TopProducts = () => {
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const lightboxImages = topProducts.map(product => ({
    src: product.image,
    alt: product.name,
  }));

  const openLightbox = (index: number) => {
    setImageIndex(index);
    setOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-4"
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className='text-lg font-medium text-maintext mb-2'>Sản phẩm bán chạy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div 
                  className="relative h-16 w-16 overflow-hidden rounded-[6px] bg-gray-100 cursor-pointer transition-transform hover:scale-105"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{product.name}</p>
                    <span className="text-sm font-medium text-primary">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-maintext">
                    <span>{product.sold} đã bán</span>
                    <div className="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
                    <span>{formatCurrency(product.revenue / product.sold)}/sản phẩm</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.min(
                          (product.sold / topProducts[0].sold) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={lightboxImages}
        index={imageIndex}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
        }}
      />
    </motion.div>
  );
}; 