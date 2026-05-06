import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const isAdmin = () => user?.role === "ADMIN";
  const isUser = () => user?.role === "USER";

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        isAdmin,
        isUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}