
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/types/user";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

// Mock user for demonstration
const mockUser: User = {
  id: "1",
  username: "johnsmith",
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@example.com",
  roles: ["user"],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage (for demo)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call the Keycloak API
      // For now, we'll simulate a successful login with our mock user
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo, check if username and password are not empty
      if (!username || !password) {
        throw new Error("Username and password are required");
      }
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      toast.success("Successfully logged in");
    } catch (error) {
      toast.error("Failed to log in. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call the Keycloak API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo, just show success
      toast.success("Registration successful. Please check your email to verify your account.");
    } catch (error) {
      toast.error("Failed to register. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // In a real implementation, this would call the Keycloak API
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Successfully logged out");
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call the Keycloak API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Password reset link sent to your email");
    } catch (error) {
      toast.error("Failed to send password reset link");
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
