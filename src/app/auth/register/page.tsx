"use client";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@/context/useUserContext";
import { motion } from "framer-motion";
import { useRegister } from "@/hooks/authentication";
import { ScrollArea } from "@/components/ui/scroll-area";

const registerSchema = z.object({
  username: z.string().min(4, "Tên đăng nhập phải có ít nhất 4 ký tự"),
  fullName: z.string().min(3, "Tên đầy đủ phải có ít nhất 3 ký tự"),
  email: z
    .string()
    .email("Email không hợp lệ")
    .min(1, "Email không được để trống"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  role: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const signUpMutation = useRegister();
  const { loginUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [strengthMessage, setStrengthMessage] = useState<string>(
    "Nhập mật khẩu là bắt buộc."
  );

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      role: "CUSTOMER",
    },
  });

  const evaluatePasswordStrength = (pass: string) => {
    if (!pass) {
      setPasswordStrength(0);
      setStrengthMessage("Nhập mật khẩu là bắt buộc.");
      return;
    }

    const commonPasswords = [
      "password",
      "123456",
      "qwerty",
      "111111",
      "abc123",
    ];
    const hasSequence =
      /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210/i;

    if (commonPasswords.includes(pass.toLowerCase())) {
      if (
        pass.toLowerCase() === "123456" ||
        pass.toLowerCase() === "password"
      ) {
        setPasswordStrength(10);
        setStrengthMessage(
          "Mật khẩu này nằm trong Top 10 mật khẩu phổ biến nhất."
        );
        return;
      }
      setPasswordStrength(20);
      setStrengthMessage("Đây là một mật khẩu rất phổ biến.");
      return;
    }

    if (hasSequence.test(pass)) {
      setPasswordStrength(30);
      setStrengthMessage('Chuỗi như "abc" hoặc "6543" rất dễ đoán.');
      return;
    }

    let strength = 0;

    if (pass.length >= 8) strength += 20;
    if (pass.length >= 12) strength += 20;

    if (/[a-z]/.test(pass)) strength += 10;
    if (/[A-Z]/.test(pass)) strength += 10;
    if (/[0-9]/.test(pass)) strength += 10;
    if (/[^a-zA-Z0-9]/.test(pass)) strength += 20;

    setPasswordStrength(strength);

    if (strength < 40) {
      setStrengthMessage("Mật khẩu đã chọn có thể mạnh hơn.");
    } else if (strength < 80) {
      setStrengthMessage("Đây là một mật khẩu khá mạnh.");
    } else {
      setStrengthMessage("Đây là một mật khẩu rất mạnh.");
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const response = await signUpMutation.mutateAsync(data as any);
      if (
        response &&
        response.status === "success" &&
        response.data?.tokens?.access &&
        response.data?.user
      ) {
        loginUser(response.data.user, response.data.tokens.access);
        toast.success("Đăng ký thành công");
        onSuccess();
      }
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      toast.error("Đăng ký thất bại");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-maintext dark:text-gray-300 font-medium">
                Tên đăng nhập
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  {...field}
                  className="border-gray-300 dark:border-gray-700 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-maintext dark:text-gray-300 font-medium">
                Họ và tên
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nhập họ và tên của bạn"
                  {...field}
                  className="border-gray-300 dark:border-gray-700 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-maintext dark:text-gray-300 font-medium">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Nhập email của bạn"
                  {...field}
                  className="border-gray-300 dark:border-gray-700 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-maintext dark:text-gray-300 font-medium">
                Mật khẩu
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      evaluatePasswordStrength(e.target.value);
                    }}
                    className="border-gray-300 dark:border-gray-700 focus-visible:ring-primary focus-visible:border-primary transition-all duration-300 pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-maintext hover:text-maintext focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
              <div className="mt-2">
                <meter
                  min={0}
                  max={100}
                  low={40}
                  high={80}
                  optimum={100}
                  value={passwordStrength}
                  className="w-full h-1.5 rounded-full overflow-hidden [&::-webkit-meter-bar]:bg-gray-300 [&::-webkit-meter-optimum-value]:bg-[#EAEBF2]0 [&::-webkit-meter-suboptimum-value]:bg-yellow-500 [&::-webkit-meter-even-less-good-value]:bg-red-500 [&::-moz-meter-bar]:bg-gray-300 [&::-moz-meter-optimum]:bg-[#EAEBF2]0 [&::-moz-meter-suboptimum]:bg-yellow-500 [&::-moz-meter-border-less-good]:bg-red-500"
                ></meter>
                <p
                  className="text-xs mt-1"
                  style={{
                    color:
                      passwordStrength < 40
                        ? "#ef4444"
                        : passwordStrength < 80
                        ? "#f59e0b"
                        : "#22c55e",
                  }}
                >
                  {strengthMessage}
                </p>
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center">
          <a
            href="/auth/login"
            className="text-sm font-semibold text-primary hover:text-secondary transition-colors duration-300"
          >
            Đã có tài khoản? Đăng nhập
          </a>
        </div>
        <div className="flex justify-center flex-1 h-full items-end mt-4">
          <Button
            type="submit"
            className="bg-primary hover:bg-secondary transition-all duration-300 text-base font-medium w-full py-4"
            disabled={signUpMutation.isPending}
          >
            {signUpMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang đăng ký...
              </>
            ) : (
              "Đăng ký"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-green-50 via-green-100 to-green-50 dark:from-gray-900 dark:to-gray-800">
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

      <div className="flex justify-center items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[600px]"
        >
          <Card className="flex flex-col w-full shadow-sm bg-white dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/30 backdrop-filter">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-maintext dark:text-white">
                <span className="relative">
                  Tạo tài khoản mới
                  <span className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></span>
                </span>
              </CardTitle>
              <CardDescription className="text-maintext dark:text-maintext pt-3">
                Đăng ký để khám phá Clothes Shop!
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ScrollArea className="h-[60vh] pr-4">
                <div className="pb-4">
                  <RegisterForm onSuccess={handleSuccess} />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
