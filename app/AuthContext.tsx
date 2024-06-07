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

// AuthProvider component to provide context to children
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Function to update access token in context
  const saveAccessToken = (token: string | null) => {
    if (typeof token === 'string' && token) {
      setAccessToken(token);
    } else {
      console.log('Invalid access token:', token);
    }
  };

  // Function to update refresh token in context
  const saveRefreshToken = (token: string | null) => {
    if (typeof token === 'string' && token) {
      setRefreshToken(token);
    } else {
      console.log('Invalid refresh token:', token);
    }
  };

  useEffect(() => {
    console.log("Access Token updated in context:", accessToken);
  }, [accessToken]);

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
