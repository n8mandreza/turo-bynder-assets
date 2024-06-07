import { createContext, useContext, useState, useEffect } from "react";

// Define the type for the authentication context
interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
}

// Create a new context with default values
const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  setAccessToken: () => {},
  setRefreshToken: () => {}
});

// AuthProvider component that bridges localStorage & Context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'accessToken') {
        setAccessToken(localStorage.getItem('accessToken'));
      }
      if (event.key === 'refreshToken') {
        setRefreshToken(localStorage.getItem('refreshToken'));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveAccessToken = (token: string | null) => {
    if (typeof token == 'string' && token) {
      localStorage.setItem('accessToken', token);
      setAccessToken(token);
    } else {
      console.log('Invalid access token:', token)
    }
  };

  const saveRefreshToken = (token: string | null) => {
    if (typeof token == 'string' && token) {
      localStorage.setItem('refreshToken', token);
      setRefreshToken(token);
    } else {
      console.log('Invalid refresh token:', token)
    }
  };

  return (
    <AuthContext.Provider value={{
      accessToken,
      refreshToken,
      setAccessToken: saveAccessToken,
      setRefreshToken: saveRefreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthData() {
  return useContext(AuthContext);
}

export default AuthContext;
