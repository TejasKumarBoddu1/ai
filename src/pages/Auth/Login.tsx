
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { UserRole } from "@/types/auth";
import { motion } from "framer-motion";
import QwikZenLogo from "@/components/ui/QwikZenLogo";
import { GraduationCap, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userRole, setUserRole] = useState<UserRole>("student");
  const { login, register, isLoading, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the "from" path from location state or default to home
  const from = location.state?.from?.pathname || "/";
  
  // If already logged in, redirect to appropriate page
  useEffect(() => {
    console.log("Login page - Auth status:", isAuthenticated, user);
    if (isAuthenticated && user) {
      console.log("Login page - Already authenticated, redirecting");
      const dashboardPath = user.role === 'organization' ? '/organization-home' : '/student-home';
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Login page - Attempting login");
      await login(email, password);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Login page - Attempting registration");
      await register(name, email, password, userRole);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 relative overflow-hidden">
      {/* 3D Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-modern-blue-100/30 blur-3xl top-1/4 left-1/4 animate-pulse"></div>
        <div className="absolute w-96 h-96 rounded-full bg-soft-purple/20 blur-3xl bottom-1/3 right-1/4 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute w-80 h-80 rounded-full bg-modern-blue-200/20 blur-3xl top-1/2 right-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <motion.div 
        className="mb-8 text-center z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center">
          <QwikZenLogo size="lg" showText={false} />
          <div className="flex items-center mt-4">
            <GraduationCap className="h-8 w-8 text-modern-blue-600 mr-2" />
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-modern-blue-500 to-soft-purple bg-clip-text text-transparent">
                QwiXEd360°Suite
              </span>
            </h1>
          </div>
          <p className="text-muted-foreground mt-2">
            QwikZen Group India
          </p>
        </div>
      </motion.div>
      
      <motion.div 
        className="max-w-md w-full z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-slate-200 focus:border-modern-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="text-xs text-modern-blue-600 hover:text-modern-blue-800 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-slate-200 focus:border-modern-blue-400"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-gradient-to-r from-modern-blue-500 to-soft-purple hover:from-modern-blue-600 hover:to-soft-purple" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            <div className="mt-4 p-4 rounded-lg backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 border border-slate-200/30 dark:border-slate-700/30">
              <p className="text-sm text-muted-foreground">
                For demo purposes:
                <br />
                - Use any email with "organization" or ending with "@org.com" to login as an organization
                <br />
                - Use any email with "admin" or ending with "@admin.com" to login as an admin
                <br />
                - Use any other email to login as a student/freelancer
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="register">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your details to create your account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="border-slate-200 focus:border-modern-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-slate-200 focus:border-modern-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-slate-200 focus:border-modern-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-type">Account Type</Label>
                    <div className="flex gap-4 flex-wrap">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="student"
                          name="accountType"
                          value="student"
                          checked={userRole === "student"}
                          onChange={() => setUserRole("student")}
                          className="h-4 w-4 border-gray-300 text-modern-blue-600 focus:ring-modern-blue-500"
                        />
                        <Label htmlFor="student" className="text-sm font-normal">Student/Freelancer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="organization"
                          name="accountType"
                          value="organization"
                          checked={userRole === "organization"}
                          onChange={() => setUserRole("organization")}
                          className="h-4 w-4 border-gray-300 text-modern-blue-600 focus:ring-modern-blue-500"
                        />
                        <Label htmlFor="organization" className="text-sm font-normal">Organization/HR</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="admin"
                          name="accountType"
                          value="admin"
                          checked={userRole === "admin"}
                          onChange={() => setUserRole("admin")}
                          className="h-4 w-4 border-gray-300 text-modern-blue-600 focus:ring-modern-blue-500"
                        />
                        <Label htmlFor="admin" className="text-sm font-normal">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 text-red-500 mr-1" />
                            Admin
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-gradient-to-r from-modern-blue-500 to-soft-purple hover:from-modern-blue-600 hover:to-soft-purple" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Register"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 QwikZen. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
