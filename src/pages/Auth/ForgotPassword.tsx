
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error during password reset request:", error);
      // Handle error case if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-xl">Reset Password</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Reset Link
                  </>
                )}
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </CardFooter>
          </form>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-xl">Email Sent</CardTitle>
              <CardDescription>Check your inbox for reset instructions</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to <span className="font-medium">{email}</span>. 
                Please check your inbox and follow the instructions to reset your password.
              </p>
              <div className="text-sm text-muted-foreground">
                Didn't receive an email? Check your spam folder or{' '}
                <Link to="/forgot-password" className="text-primary hover:underline">
                  try again
                </Link>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </AuthLayout>
  );
};

export default ForgotPassword;
