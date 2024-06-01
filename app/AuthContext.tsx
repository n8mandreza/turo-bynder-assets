import { createContext, useContext, useState } from "react";

// Define the type for the authentication context
interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
}

// Create a new context to store the authentication data
const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  setAccessToken: () => {},
  setRefreshToken: () => {},
});

// Update AuthProvider to correctly type its props
interface AuthProviderProps {
  children: React.ReactNode;
  value: AuthContextType;  // The expected structure for `value`
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children, value }) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthData() {
  return useContext(AuthContext);
}

export default AuthContext;