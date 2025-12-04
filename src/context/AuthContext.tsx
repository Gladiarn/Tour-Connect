import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  userType: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  isLoading: boolean;
  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return null;

      const res = await fetch("http://localhost:5000/api/users/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      return data.accessToken;
    } catch (error) {
      logout();
      console.log(error);
      return null;
    }
  },[]);

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      let res = await fetch("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          res = await fetch("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${newToken}` },
          });
        }
      }

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  },[refreshAccessToken]);

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    fetchUser();
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await fetchUser();
      setIsLoading(false);
    };
    initializeAuth();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
