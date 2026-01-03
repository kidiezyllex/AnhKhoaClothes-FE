'use client';

import { useState, useEffect } from 'react';
 
import { useNavigate } from 'react-router-dom';
import { useCreateProduct } from '@/hooks/product';
import { useUploadImage } from '@/hooks/upload';
import { IProductCreate, IProductVariant } from '@/interface/request/product';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createFormData } from '@/utils/cloudinary';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icon } from '@mdi/react';
import { mdiPlus, mdiTrashCanOutline, mdiArrowLeft, mdiLoading, mdiAutoFix } from '@mdi/js';
import { AnimatePresence, motion } from 'framer-motion';
import ProductVariantForm from '@/components/ProductPage/ProductVariantForm';
import VariantGenerator from '@/components/ProductPage/VariantGenerator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBrands, useCategories, useColors, useMaterials, useSizes } from '@/hooks/attributes';

const initialProduct: IProductCreate = {
  name: '',
  brand: '',
  category: '',
  material: '',
  description: '',
  weight: 0,
  variants: [
    {
      colorId: '',
      sizeId: '',
      price: 0,
      stock: 0,
      images: []
    }
  ]
};

export default function CreateProductPage() {
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProductCreate>(initialProduct);
  const [activeTab, setActiveTab] = useState('info');
  const [uploading, setUploading] = useState(false);
  const [showVariantGenerator, setShowVariantGenerator] = useState(false);
  const createProduct = useCreateProduct();
  const uploadImage = useUploadImage();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'weight') {
      setProduct({ ...product, [name]: parseFloat(value) || 0 });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };
  const { data: brandsData } = useBrands();
  const { data: categoriesData } = useCategories();

  const { data: materialsData } = useMaterials();
  const handleAddVariant = () => {
    setProduct({
      ...product,
      variants: [
        ...product.variants,
        {
          colorId: '',
          sizeId: '',
          price: 0,
          stock: 0,
          images: []
        }
      ]
    });
  };

  const handleRemoveVariant = (index: number) => {
    setProduct({
      ...product,
      variants: product.variants.filter((_, i) => i !== index)
    });
  };

  const handleVariantChange = (index: number, updatedVariant: IProductVariant) => {
    const newVariants = [...product.variants];
    newVariants[index] = updatedVariant;
    setProduct({ ...product, variants: newVariants });
  };

  const handleImageUpload = async (file: File, variantIndex: number) => {
    try {
      setUploading(true);
      const formData = createFormData(file);
      const result = await uploadImage.mutateAsync(formData);
      const newVariants = [...product.variants];
      newVariants[variantIndex].images = [
        ...(newVariants[variantIndex].images || []),
        result?.data?.imageUrl
      ];

      setProduct({ ...product, variants: newVariants });
      toast.success('Tải lên hình ảnh thành công');
    } catch (error) {
      toast.error('Tải lên hình ảnh thất bại');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (variantIndex: number, imageIndex: number) => {
    const newVariants = [...product.variants];
    newVariants[variantIndex].images = newVariants[variantIndex].images?.filter((_, i) => i !== imageIndex);
    setProduct({ ...product, variants: newVariants });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.name || !product.brand || !product.category) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm');
      setActiveTab('info');
      return;
    }

    if (product.variants.some(v => !v.colorId || !v.sizeId || v.price <= 0)) {
      toast.error('Vui lòng điền đầy đủ thông tin biến thể');
      setActiveTab('variants');
      return;
    }

    try {
      await createProduct.mutateAsync(product, {
        onSuccess: () => {
          toast.success('Tạo sản phẩm thành công');
          navigate('/admin/products');
        },
        onError: (error) => {
          console.error('Chi tiết lỗi:', error);
        }
      });
    } catch (error) {
      toast.error('Vui lòng cung cấp đầy đủ thông tin sản phẩm');
    }
  };

  const isFormValid = () => {
    const isBasicInfoValid = !!product.name && !!product.brand && !!product.category;
    const areVariantsValid = product.variants.every(v => !!v.colorId && !!v.sizeId && v.price > 0);
    return isBasicInfoValid && areVariantsValid;
  };

  const validateBasicInfo = () => {
    const missingFields = [];

    if (!product.name.trim()) {
      missingFields.push('Tên sản phẩm');
    }
    if (!product.brand) {
      missingFields.push('Thương hiệu');
    }
    if (!product.category) {
      missingFields.push('Danh mục');
    }
    if (!product.material) {
      missingFields.push('Chất liệu');
    }

    return missingFields;
  };

  const handleNextTab = () => {
    const missingFields = validateBasicInfo();

    if (missingFields.length > 0) {
      toast.error(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`);
      return;
    }

    setActiveTab('variants');
  };

  const handleGenerateVariants = (variants: IProductVariant[]) => {
    setProduct({ ...product, variants });
    setShowVariantGenerator(false);
    toast.success(`Đã tạo ${variants.length} biến thể`);
  };

  const isFirstVariantComplete = () => {
    const firstVariant = product.variants[0];
    return firstVariant && firstVariant.colorId && firstVariant.sizeId && firstVariant.price > 0;
  };

  return (
    <div className="space-y-4">
      <div className='flex justify-between items-start'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/products">Quản lý sản phẩm</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Thêm sản phẩm mới</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <Icon path={mdiArrowLeft} size={0.7} />
          Quay lại
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="info">Thông tin cơ bản</TabsTrigger>
            <TabsTrigger value="variants">Biến thể sản phẩm</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-maintext">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên sản phẩm <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      name="name"
                      value={product.name}
                      onChange={handleInputChange}
                      placeholder="Nhập tên sản phẩm"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Thương hiệu <span className="text-red-500">*</span></Label>
                    <Select
                      value={product.brand}
                      onValueChange={value => setProduct({ ...product, brand: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thương hiệu">
                          {product.brand 
                            ? (brandsData?.data || []).find(brand => brand.id.toString() === product.brand?.toString())?.name || 'Chọn thương hiệu'
                            : 'Chọn thương hiệu'
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {(brandsData?.data || []).map(brand => (
                          <SelectItem key={brand.id} value={brand.id.toString()}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục <span className="text-red-500">*</span></Label>
                    <Select
                      value={product.category}
                      onValueChange={value => setProduct({ ...product, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục">
                          {product.category 
                            ? (categoriesData?.data || []).find(category => category.id.toString() === product.category?.toString())?.name || 'Chọn danh mục'
                            : 'Chọn danh mục'
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {(categoriesData?.data || []).map(category => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="material">Chất liệu <span className="text-red-500">*</span></Label>
                    <Select
                      value={product.material}
                      onValueChange={value => setProduct({ ...product, material: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chất liệu">
                          {product.material 
                            ? (materialsData?.data || []).find(material => material.id.toString() === product.material?.toString())?.name || 'Chọn chất liệu'
                            : 'Chọn chất liệu'
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {(materialsData?.data || []).map(material => (
                          <SelectItem key={material.id} value={material.id.toString()}>
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Trọng lượng (gram)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      min="0"
                      value={product.weight || ''}
                      onChange={handleInputChange}
                      placeholder="Nhập trọng lượng"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả sản phẩm</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả sản phẩm"
                    rows={5}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  onClick={handleNextTab}
                >
                  Tiếp theo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="variants" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className='flex items-center justify-between w-full'>Biến thể sản phẩm
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowVariantGenerator(true)}
                      disabled={!isFirstVariantComplete()}
                      className="flex items-center gap-1"
                      title={!isFirstVariantComplete() ? "Vui lòng hoàn thành biến thể đầu tiên" : ""}
                    >
                      <Icon path={mdiAutoFix} size={0.7} />
                      Generate tất cả biến thể
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddVariant}
                      className="flex items-center gap-1"
                    >
                      <Icon path={mdiPlus} size={0.7} />
                      Thêm biến thể
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isFormValid() || createProduct.isPending}
                      className="flex items-center gap-2"
                    >
                      {createProduct.isPending ? (
                        <>
                          <Icon path={mdiLoading} size={0.7} className="animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        'Tạo sản phẩm'
                      )}
                    </Button>
                  </div>
                </CardTitle>

              </CardHeader>
              <CardContent className="space-y-4 text-maintext">
                <AnimatePresence>
                  {product.variants.map((variant, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="border p-4 rounded-[6px]"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Biến thể #{index + 1}</h3>
                        {product.variants.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveVariant(index)}
                            className="flex items-center gap-1"
                          >
                            <Icon path={mdiTrashCanOutline} size={0.7} />
                            Xóa
                          </Button>
                        )}
                      </div>

                      <ProductVariantForm
                        variant={variant}
                        onChange={(updatedVariant) => handleVariantChange(index, updatedVariant)}
                        onImageUpload={(file) => handleImageUpload(file, index)}
                        onRemoveImage={(imageIndex) => handleRemoveImage(index, imageIndex)}
                        uploading={uploading}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('info')}
                >
                  Quay lại
                </Button>

              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
      <AnimatePresence>
        {showVariantGenerator && (
          <VariantGenerator
            baseVariant={product.variants[0]}
            onGenerate={handleGenerateVariants}
            onClose={() => setShowVariantGenerator(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 