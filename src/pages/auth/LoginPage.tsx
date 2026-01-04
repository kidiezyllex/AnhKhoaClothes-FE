import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/useUserContext";
import { useLogin } from "@/hooks/authentication";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginFormValues {
  email: string;
  password: string;
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const signInMutation = useLogin();
  const { loginUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await signInMutation.mutateAsync(formData);
      if (
        response &&
        response.status === "success" &&
        response.data?.tokens?.access &&
        response.data?.user
      ) {
        loginUser(response.data.user, response.data.tokens.access);
        toast.success("Đăng nhập thành công");
        if (
          response.data.user.isAdmin ||
          response.data.user.role === "ADMIN" ||
          response.data.user.role === "STAFF"
        ) {
          navigate("/admin/statistics");
        } else {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      toast.error("Đăng nhập thất bại");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 h-full">
      <div>
        <label className="text-gray-700 dark:text-gray-300 font-semibold block mb-2 text-sm">
          Email
        </label>
        <Input
          type="email"
          name="email"
          placeholder="Nhập email của bạn"
          value={formData.email}
          onChange={handleInputChange}
          className="border-gray-300 dark:border-gray-700 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
          required
        />
      </div>
      <div>
        <label className="text-gray-700 dark:text-gray-300 font-semibold block mb-2 text-sm">
          Mật khẩu
        </label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleInputChange}
            className="border-gray-300 dark:border-gray-700 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300 pr-10"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <a
          href="/auth/register"
          className="text-sm text-primary hover:text-secondary transition-colors duration-300 font-semibold"
        >
          Đăng ký?
        </a>
        <a
          href="/auth/forget-password"
          className="text-sm text-primary hover:text-secondary transition-colors duration-300 font-semibold"
        >
          Quên mật khẩu?
        </a>
      </div>
      <div className="flex justify-center flex-1 h-full items-end mt-4">
        <Button
          type="submit"
          className="bg-primary hover:bg-secondary transition-all duration-300 text-base font-medium w-full py-4"
          disabled={signInMutation.isPending}
        >
          {signInMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang đăng nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </div>
    </form>
  );
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-green-50 via-green-100 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hiệu ứng bong bóng trang trí */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute h-20 w-20 rounded-full bg-primary/70 top-12 left-[10%]"></div>
        <div className="absolute h-24 w-24 rounded-full bg-secondary/80 top-36 right-[15%]"></div>
        <div className="absolute h-16 w-16 rounded-full bg-primary/40 bottom-10 left-[20%]"></div>
        <div className="absolute h-32 w-32 rounded-full bg-secondary/70 -bottom-10 right-[25%]"></div>
        <div className="absolute h-28 w-28 rounded-full bg-primary/70 -top-10 left-[40%]"></div>
        <div className="absolute h-12 w-12 rounded-full bg-secondary/40 top-1/2 left-[5%]"></div>
        <div className="absolute h-14 w-14 rounded-full bg-primary/80 bottom-1/3 right-[10%]"></div>
        <div className="absolute h-10 w-10 rounded-full bg-secondary/70 top-1/4 right-[30%]"></div>
        <div className="absolute h-36 w-36 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 -bottom-16 left-[30%] blur-sm"></div>
        <div className="absolute h-40 w-40 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 -top-20 right-[20%] blur-sm"></div>
      </div>

      <div className="w-full flex justify-center items-center relative z-10">
        {/* Form đăng nhập bên phải */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full w-[500px]"
        >
          <Card className="flex flex-col w-full h-full shadow-sm bg-white dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/30 backdrop-filter">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-700 dark:text-white flex items-center justify-between">
                Đăng nhập tài khoản
                <img
                  draggable="false"
                  src="/images/logo.svg"
                  alt="logo"
                  width={100}
                  height={100}
                  className="w-auto h-12"
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-4 bg-white">
              <LoginForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
