/* eslint-disable react-refresh/only-export-components */
// hooks/AuthProvider.jsx
import { createContext, useContext } from "react";
import { useAuth } from "@/hooks/useAuth"; // your original hook

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuth(); // use the hook here
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// custom hook to consume the context
export const useAuthContext = () => useContext(AuthContext);
