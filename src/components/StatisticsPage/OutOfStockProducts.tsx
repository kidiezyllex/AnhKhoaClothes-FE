'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { outOfStockProducts } from './mockData';
import { motion } from 'framer-motion';
import { Icon } from '@mdi/react';
import { mdiAlert } from '@mdi/js';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

export const OutOfStockProducts = () => {
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const lightboxImages = outOfStockProducts.map(product => ({
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
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className='text-lg font-medium text-maintext mb-2'>Sản phẩm hết hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {outOfStockProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <p className="text-maintext">Không có sản phẩm nào hết hàng</p>
            </div>
          ) : (
            <div className="space-y-4">
              {outOfStockProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-2 rounded-[6px] border p-3"
                >
                  <div 
                    className="relative h-14 w-14 overflow-hidden rounded-[6px] bg-gray-100 cursor-pointer transition-transform hover:scale-105"
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <div className="flex items-center text-sm text-red-500 mt-1">
                      <Icon path={mdiAlert} size={0.7} className="mr-1" />
                      <span>Hết hàng</span>
                    </div>
                  </div>
                  <button className="rounded-[6px] bg-primary px-3 py-1 text-xs font-medium text-white hover:bg-primary/80 transition-colors">
                    Nhập hàng
                  </button>
                </motion.div>
              ))}
            </div>
          )}
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