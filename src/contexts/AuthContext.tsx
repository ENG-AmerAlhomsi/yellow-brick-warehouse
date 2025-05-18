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

// Configure Keycloak init options
const keycloakInitOptions = {
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  checkLoginIframe: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReactKeycloakProvider 
      authClient={keycloak}
      initOptions={keycloakInitOptions}
    >
      <AuthContextContent>{children}</AuthContextContent>
    </ReactKeycloakProvider>
  );
};

const AuthContextContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    
    if (initialized) {
      if (keycloak.authenticated) {        
        try {
          // Get realm roles
          const realmRoles = keycloak.tokenParsed?.realm_access?.roles || [];
          
          // Get client roles from different clients
          const clientRoles: string[] = [];
          
          // Check WareHouse-frontend client roles
          if (keycloak.tokenParsed?.resource_access?.['WareHouse-frontend']?.roles) {
            const frontendRoles = keycloak.tokenParsed.resource_access['WareHouse-frontend'].roles;
            clientRoles.push(...frontendRoles);
          }
          
          // Check WareHouse client roles
          if (keycloak.tokenParsed?.resource_access?.['WareHouse']?.roles) {
            const warehouseRoles = keycloak.tokenParsed.resource_access['WareHouse'].roles;
            clientRoles.push(...warehouseRoles);
          }
          
          // Combine all roles
          const allRoles = [...realmRoles, ...clientRoles];
          
          const userProfile = {
            id: keycloak.subject ?? "",
            username: keycloak.tokenParsed?.preferred_username ?? "",
            firstName: keycloak.tokenParsed?.given_name ?? "",
            lastName: keycloak.tokenParsed?.family_name ?? "",
            email: keycloak.tokenParsed?.email ?? "",
            roles: allRoles,
          };
          
          setUser(userProfile);
        } catch (error) {
          console.error("AuthContext - Error parsing user data:", error);
          toast.error("Error loading user profile");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  }, [initialized, keycloak.authenticated, keycloak.tokenParsed]);

  const login = () => {
    keycloak.login({
      redirectUri: window.location.origin + '/shop'
    }).catch(error => {
      toast.error("Login failed");
    });
  };

  const register = () => {
    keycloak.register().catch(error => {
      console.error("Registration error:", error);
      toast.error("Registration failed");
    });
  };

  const logout = () => {
    keycloak.logout({
      redirectUri: window.location.origin + '/shop'
    }).catch(error => {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    });
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
