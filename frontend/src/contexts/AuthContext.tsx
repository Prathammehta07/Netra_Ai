import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface UserProfile {
  id?: string;
  mobile?: string;
  age?: number;
  gender?: string;
  city?: string;
  state?: string;
  language?: string;
  medicalHistory?: string;
  diabeticStatus?: string;
  onboardingComplete?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('netraai_token') || localStorage.getItem('swasthmitra_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('netraai_user') || localStorage.getItem('swasthmitra_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Validate session with backend
      axios.get('/api/users/me')
        .then((res) => {
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('netraai_user', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          // Token expired or server unreachable
          logout();
        })
        .finally(() => setIsLoading(false));
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setIsLoading(false);
    }
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('netraai_token', newToken);
    localStorage.setItem('netraai_user', JSON.stringify(newUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('netraai_token');
    localStorage.removeItem('netraai_user');
    localStorage.removeItem('swasthmitra_token');
    localStorage.removeItem('swasthmitra_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('netraai_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
