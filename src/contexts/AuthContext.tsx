
import React, { createContext, useState, useContext, useEffect } from "react";
import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web";
import { keycloak } from "@/config/keycloak";
import { User } from "@/types/user";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  register: () => void;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <AuthContextContent>{children}</AuthContextContent>
    </ReactKeycloakProvider>
  );
};

const AuthContextContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      const userProfile = {
        id: keycloak.subject ?? "",
        username: keycloak.tokenParsed?.preferred_username ?? "",
        firstName: keycloak.tokenParsed?.given_name ?? "",
        lastName: keycloak.tokenParsed?.family_name ?? "",
        email: keycloak.tokenParsed?.email ?? "",
        roles: keycloak.tokenParsed?.realm_access?.roles ?? [],
      };
      setUser(userProfile);
    } else {
      setUser(null);
    }
  }, [initialized, keycloak.authenticated]);

  const login = () => {
    keycloak.login();
  };

  const register = () => {
    keycloak.register();
  };

  const logout = () => {
    keycloak.logout();
  };

  const forgotPassword = async (email: string) => {
    try {
      // Redirect to Keycloak's forgot password page
      window.location.href = `${keycloak.authServerUrl}/realms/${keycloak.realm}/login-actions/reset-credentials`;
      toast.success("Redirecting to password reset page");
    } catch (error) {
      toast.error("Failed to redirect to password reset page");
      console.error("Password reset error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!keycloak.authenticated,
        isLoading: !initialized,
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
