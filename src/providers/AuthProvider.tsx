
import { createContext, useContext, useEffect, useState } from "react";
import { 
  createSession, 
  clearSession, 
  findUserByCredentials, 
  findUserById, 
  UserProfile, 
  validateSession 
} from "@/data/localStore";

type AuthContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserProfile | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => Promise.resolve(null),
  logout: () => Promise.resolve(),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const userId = validateSession();
    if (userId) {
      const foundUser = findUserById(userId);
      setUser(foundUser);
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<UserProfile | null> => {
    const foundUser = findUserByCredentials(email, password);
    if (foundUser) {
      createSession(foundUser.id);
      setUser(foundUser);
    }
    return foundUser;
  };

  // Logout function
  const logout = async (): Promise<void> => {
    clearSession();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
