// /* eslint-disable react-refresh/only-export-components */
// import { createContext, useContext, useMemo } from "react";
// import { useAuth } from "@/hooks/useAuth"; // your original hook

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const auth = useAuth(); // use the hook here

//   // Memoize auth value to prevent unnecessary re-renders
//   const value = useMemo(() => auth, [auth]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // custom hook to consume the context
// export const useAuthContext = () => useContext(AuthContext);

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  const value = useMemo(
    () => ({
      user: auth.user,
      role: auth.role,
      isAuthenticated: auth.isAuthenticated,
      loading: auth.loading,
      login: auth.login,
      logout: auth.logout,
    }),
    [
      auth.user,
      auth.role,
      auth.isAuthenticated,
      auth.loading,
      auth.login,
      auth.logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
