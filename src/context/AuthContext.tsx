
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, UserRole } from "@/types/auth";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  session: Session | null;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Get user profile data
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
              
              if (error) {
                console.error('Error fetching user profile:', error);
                setUser(null);
                return;
              }
              
              if (profileData) {
                // Convert profile data to User type
                const userData: User = {
                  id: currentSession.user.id,
                  name: profileData.full_name || currentSession.user.email?.split('@')[0] || '',
                  email: profileData.email || currentSession.user.email || '',
                  role: (profileData.role as UserRole) || 'student',
                  profilePicture: profileData.profile_picture || null,
                  createdAt: profileData.created_at || currentSession.user.created_at,
                };
                setUser(userData);

                // If this is a login event, navigate to the dashboard
                // Using 'SIGNED_IN' and 'TOKEN_REFRESHED' as these are valid auth event types
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                  console.log("Signed in event detected, redirecting to dashboard");
                  let dashboardPath = '/student-home';
                  
                  // Determine dashboard path based on user role
                  if (userData.role === 'organization') {
                    dashboardPath = '/hr-dashboard';
                  } else if (userData.role === 'admin') {
                    dashboardPath = '/everyone'; // Admin users go to Everyone page by default
                  }
                  
                  navigate(dashboardPath, { replace: true });
                }
              } else {
                console.error('No profile data found');
                setUser(null);
              }
            } catch (err) {
              console.error('Unexpected error in profile fetch:', err);
              setUser(null);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Checking for existing session:", currentSession ? "Found" : "Not found");
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Get user profile data
        setIsLoading(true);
        supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single()
          .then(({ data: profileData, error }) => {
            setIsLoading(false);
            
            if (error) {
              console.error('Error fetching user profile:', error);
              setUser(null);
              return;
            }
            
            if (profileData) {
              // Convert profile data to User type
              const userData: User = {
                id: currentSession.user.id,
                name: profileData.full_name || currentSession.user.email?.split('@')[0] || '',
                email: profileData.email || currentSession.user.email || '',
                role: (profileData.role as UserRole) || 'student',
                profilePicture: profileData.profile_picture || null,
                createdAt: profileData.created_at || currentSession.user.created_at,
              };
              setUser(userData);
              
              // Check if we're on the login page and redirect if needed
              if (location.pathname === '/login' || location.pathname === '/register') {
                console.log("Already logged in and on login/register page, redirecting to home");
                let dashboardPath = '/student-home';
                
                // Determine dashboard path based on user role
                if (userData.role === 'organization') {
                  dashboardPath = '/hr-dashboard';
                } else if (userData.role === 'admin') {
                  dashboardPath = '/everyone'; // Admin users go to Everyone page by default
                }
                
                navigate(dashboardPath, { replace: true });
              }
            } else {
              console.error('No profile data found');
              setUser(null);
            }
          });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // First, authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Login successful, auth state change will handle redirection");
      
      // Success message
      toast({
        title: "Login successful!",
        description: "Welcome back to QwiX CV",
      });
      
      // We don't need to manually redirect here anymore because the onAuthStateChange will handle it
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      setIsLoading(true);
      
      // Determine if this is an admin registration from the email or role
      const isAdmin = role === 'admin' || email.includes('admin') || email.endsWith('@admin.com');
      const isOrganization = role === 'organization' || email.includes('organization') || email.endsWith('@org.com');
      
      // Set the final role based on email patterns or selected role
      const finalRole: UserRole = isAdmin ? 'admin' : isOrganization ? 'organization' : 'student';
      
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: finalRole
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data?.user?.id) {
        throw new Error("Registration failed. Please try again.");
      }
      
      // Show success message
      toast({
        title: "Registration successful!",
        description: `Welcome to QwiX CV as ${finalRole}`,
      });
      
      // The navigation will be handled by the auth state change listener
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Could not create your account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      
      // Show success message
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      // Redirect to login page
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // Forgot password
  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: `Instructions have been sent to ${email}`,
      });
    } catch (error: any) {
      console.error("Forgot password failed:", error);
      toast({
        title: "Failed to send reset email",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Reset password
  const resetPassword = async (token: string, password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset successful",
        description: "You can now login with your new password",
      });
      navigate("/login");
    } catch (error: any) {
      console.error("Reset password failed:", error);
      toast({
        title: "Password reset failed",
        description: error.message || "Invalid or expired token",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    session,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
