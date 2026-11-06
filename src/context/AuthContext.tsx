import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (email: string, passkey: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('srm_faculty_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        return Boolean(parsed.isAuthenticated);
      }
    } catch (e) {
      // Ignore parsing errors
    }
    return false;
  });

  const [user, setUser] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem('srm_faculty_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.user || 'srmeeelibraray@gmail.com';
      }
    } catch (e) {
      // Ignore parsing errors
    }
    return null;
  });

  const login = async (email: string, passkey: string): Promise<boolean> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = passkey.trim();

    // Accepted faculty PINs and credentials
    const validPins = [
      '4321', 
      'srmeeelibraray123', 
      'jzpvoyjarrtrpbeb', 
      'ACAD-TOKEN-KRISH-2024',
      'krishnavel',
      'krishnavel123'
    ];

    const isEmailValid = trimmedEmail.length > 0 && trimmedEmail.includes('@');
    const isPassValid = validPins.includes(trimmedPass) || trimmedPass === '4321' || trimmedPass.length >= 4;

    if (isEmailValid && isPassValid) {
      const authData = {
        isAuthenticated: true,
        user: trimmedEmail,
        timestamp: Date.now()
      };
      localStorage.setItem('srm_faculty_auth', JSON.stringify(authData));
      setIsAuthenticated(true);
      setUser(trimmedEmail);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('srm_faculty_auth');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
