'use client'; // Kích hoạt rendering phía client trong Next.js

import { useState } from 'react'; // Hook useState để quản lý state
import { useNavigate } from 'react-router-dom'; // Hook điều hướng trong React Router
import { IAccountCreate } from '@/interface/request/account'; // Interface định nghĩa dữ liệu tạo tài khoản

// Import các thành phần giao diện tùy chỉnh
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify'; // Thư viện thông báo toast
import 'react-toastify/dist/ReactToastify.css'; // CSS cho toast
import { Icon } from '@mdi/react'; // Component icon
import { mdiArrowLeft, mdiLoading } from '@mdi/js'; // Icon SVG
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Radio button
import { useRegister } from '@/hooks/authentication'; // Hook xử lý đăng ký tài khoản
import { Eye, EyeOff } from 'lucide-react'; // Icon ẩn/hiện mật khẩu

// Giá trị khởi tạo cho form tài khoản
const initialAccount: IAccountCreate = {
  fullName: '', // Họ và tên
  email: '', // Email
  password: '', // Mật khẩu
  phoneNumber: '', // Số điện thoại
  role: 'CUSTOMER', // Vai trò mặc định
  gender: 'male', // Giới tính mặc định
  birthday: '', // Ngày sinh
  citizenId: '' // CCCD
};

// Component chính
export default function CreateAccountPage() {
  const navigate = useNavigate(); // Hook điều hướng quay lại
  const [account, setAccount] = useState<IAccountCreate>(initialAccount); // State tài khoản
  const [confirmPassword, setConfirmPassword] = useState(''); // State xác nhận mật khẩu
  const createAccount = useRegister(); // Hook đăng ký
  const [showPassword, setShowPassword] = useState(false); // Ẩn/hiện mật khẩu
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Ẩn/hiện xác nhận mật khẩu

  // Xử lý thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Lấy name và value
    setAccount({ ...account, [name]: value }); // Cập nhật state
  };

  // Xử lý select hoặc radio
  const handleSelectChange = (name: string, value: string) => {
    setAccount({ ...account, [name]: value });
  };

  // Toggle hiển thị mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle hiển thị xác nhận mật khẩu
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Gửi form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn reload trang

    // Kiểm tra bắt buộc
    if (!account.fullName || !account.email || !account.password || !account.phoneNumber) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (account.password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    // Regex email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(account.email)) {
      toast.error('Email không hợp lệ');
      return;
    }

    // Regex số điện thoại
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(account.phoneNumber)) {
      toast.error('Số điện thoại không hợp lệ');
      return;
    }

    try {
      // Gửi dữ liệu tạo tài khoản
      await createAccount.mutateAsync({
        ...account,
        birthday: account.birthday ? new Date(account.birthday) : undefined,
        gender: account.gender as 'male' | 'female' | 'other'
      }, {
        onSuccess: () => {
          toast.success('Tạo tài khoản thành công');
          navigate('/admin/accounts');
        },
        onError: (error: any) => {
          let specificMessage = 'Không xác định';
          if (error.response && error.response.data && typeof error.response.data.message === 'string') {
            specificMessage = error.response.data.message;
          } else if (error.message && typeof error.message === 'string') {
            specificMessage = error.message;
          }
          toast.error('Tạo tài khoản thất bại: ' + specificMessage);
        }
      });
    } catch (error) {
      toast.error('Tạo tài khoản thất bại');
    }
  };

  // Giao diện JSX
  return (
    <div className="space-y-4"> {/* Container chính */}
      <div className='flex justify-between items-start'> {/* Breadcrumb và nút quay lại */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/statistics">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/accounts">Quản lý tài khoản</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Thêm tài khoản mới</BreadcrumbPage>
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

      <form onSubmit={handleSubmit}> {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-maintext">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Chia 2 cột */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên <span className="text-red-500">*</span></Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={account.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={account.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={account.password}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-maintext hover:text-maintext focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-maintext hover:text-maintext focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số điện thoại <span className="text-red-500">*</span></Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={account.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Vai trò <span className="text-red-500">*</span></Label>
                <Select value={account.role} onValueChange={(value) => handleSelectChange('role', value)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                    <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="citizenId">CCCD/CMND (Tuỳ chọn)</Label>
                <Input
                  id="citizenId"
                  name="citizenId"
                  value={account.citizenId || ''}
                  onChange={handleInputChange}
                  placeholder="Nhập số CCCD/CMND"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday">Ngày sinh</Label>
                <Input
                  id="birthday"
                  name="birthday"
                  type="date"
                  value={account.birthday ? (typeof account.birthday === 'string' ? account.birthday : account.birthday.toISOString().split('T')[0]) : ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Giới tính</Label>
                <RadioGroup value={account.gender || 'male'} onValueChange={(value) => handleSelectChange('gender', value)} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="gender-nam" />
                    <Label htmlFor="gender-nam">Nam</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="gender-nu" />
                    <Label htmlFor="gender-nu">Nữ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="gender-khac" />
                    <Label htmlFor="gender-khac">Khác</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4"> {/* Footer */}
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              Hủy
            </Button>
            <Button type="submit" disabled={createAccount.isPending} className="flex items-center gap-2">
              {createAccount.isPending ? (
                <>
                  <Icon path={mdiLoading} size={0.7} className="animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Tạo tài khoản'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
