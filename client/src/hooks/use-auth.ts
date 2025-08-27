
import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const token = localStorage.getItem('auth-token');
    const userData = localStorage.getItem('user-data');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    // Simulate login - in a real app, this would make an API call
    localStorage.setItem('auth-token', 'demo-token-' + Date.now());
    localStorage.setItem('user-data', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-data');
    setIsAuthenticated(false);
    setUser(null);
  };

  const signup = (userData: Omit<User, 'id'>) => {
    // Simulate signup - in a real app, this would make an API call
    const newUser: User = {
      ...userData,
      id: 'user_' + Date.now()
    };
    
    login(newUser);
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    signup
  };
}
