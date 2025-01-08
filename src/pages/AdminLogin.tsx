import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginAdmin, sendPasswordResetEmail } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    
    try {
      await loginAdmin(values.email, values.password);
      
      toast({
        title: "Login successful",
        description: "Welcome back, admin!",
        variant: "default",
      });

      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error("Login error:", error.message);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: LoginFormValues) => {
    setLoading(true);
    
    try {
      if (!values.email) {
        throw new Error("Please enter your email address");
      }

      await sendPasswordResetEmail(
        values.email, 
        `${window.location.origin}/admin/reset-password`
      );

      toast({
        title: "Reset link sent",
        description: "Please check your email for the password reset link.",
        variant: "default",
      });
      
      setIsResetMode(false);
      form.reset();
    } catch (error: any) {
      console.error("Password reset error:", error.message);
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-youtube-light p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 bg-youtube-red rounded-full">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-youtube-text">
            {isResetMode ? "Reset Password" : "Admin Login"}
          </h1>
        </div>

        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(isResetMode ? handleResetPassword : handleLogin)} 
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isResetMode && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              className="w-full bg-youtube-red hover:bg-red-600"
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : isResetMode
                ? "Send Reset Link"
                : "Login"}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => {
              setIsResetMode(!isResetMode);
              form.reset();
            }}
            className="text-youtube-red hover:text-red-600"
          >
            {isResetMode ? "Back to Login" : "Forgot Password?"}
          </Button>
        </div>
      </Card>
    </div>
  );
}