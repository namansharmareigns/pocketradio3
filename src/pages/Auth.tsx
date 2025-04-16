
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

const Auth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Sign in form
  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle sign in submission
  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    try {
      const user = await login(values.email, values.password);
      if (user) {
        toast.success("Signed in successfully!");
        navigate("/");
      } else {
        toast.error("Invalid email or password. Try asmitabag@gmail.com or namansharma@gmail.com with password123");
      }
    } catch (error: any) {
      toast.error("An error occurred during sign in");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center">
      <div className="max-w-md w-full glass p-8 rounded-xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          <span className="text-gradient">Demo Login</span>
        </h1>
        
        <div className="mb-6 p-4 bg-blue-900/20 rounded-md">
          <h3 className="font-medium mb-2">Available test accounts:</h3>
          <p className="text-sm">asmita@gmail.com / password123</p>
          <p className="text-sm">naman@gmail.com / password123</p>
        </div>
        
        <Form {...signInForm}>
          <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-6">
            <FormField
              control={signInForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="asmitabag@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={signInForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Auth;
