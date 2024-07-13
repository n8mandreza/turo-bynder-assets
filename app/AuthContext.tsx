import { createContext, useContext, useState, useEffect } from "react";

// Define the type for the authentication context
interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  saveAccessToken: (token: string | null) => void;
  saveRefreshToken: (token: string | null) => void;
  resetAccessToken: () => void;
}

// Create a new context with default values
const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  saveAccessToken: () => {},
  saveRefreshToken: () => {},
  resetAccessToken: () => {}
});

// AuthProvider component to provide context to children
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Function to update access token in context
  const saveAccessToken = (token: string | null) => {
    console.log("saveAccessToken invoked")
    if (typeof token === 'string' && token) {
      console.log('Saving access token', token)
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

  const resetAccessToken = () => {
    setAccessToken(null);
    console.log('Access token reset')
  };

  useEffect(() => {
    console.log("Access Token updated in context:", accessToken);

    // If accessToken isn't null, send it to the plugin entrypoint
    if (accessToken) {
      const message = {
        pluginMessage: {
          message: 'SAVE_ACCESS_TOKEN',
          accessToken: accessToken
        },
        pluginId: '1381050062397011474'
      }

      console.log("Sending postMessage", message)

      window.parent.postMessage(message, 'https://www.figma.com')
    } else {
      console.log("accessToken is null or undefined")
    }
  }, [accessToken]);  // Include refreshToken if needed

  return (
    <AuthContext.Provider value={{
      accessToken,
      refreshToken,
      saveAccessToken,
      saveRefreshToken,
      resetAccessToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthData() {
  return useContext(AuthContext);
}

export default AuthContext;
