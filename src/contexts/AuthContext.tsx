import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Department = 'pharma' | 'lab' | 'radiology';

interface User {
  username: string;
  department: Department;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, department: Department) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string, department: Department): boolean => {
    // Demo authentication - in real app, this would call an API
    if (username === 'admin' && password === 'password123') {
      setUser({ username, department });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};