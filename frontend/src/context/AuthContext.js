import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// --- Function to safely get user data from localStorage ---
const getInitialUser = () => {
  try {
    const item = localStorage.getItem('user');
    // Return the parsed user object, or null if nothing is stored or if it's invalid
    return item ? JSON.parse(item) : null;
  } catch (error) {
    // If parsing fails (because data is not valid JSON), clear the bad data and return null
    console.error("Failed to parse user from localStorage", error);
    localStorage.removeItem('user');
    return null;
  }
};


export const AuthProvider = ({ children }) => {
  // Use the safe function to initialize state
  const [user, setUser] = useState(getInitialUser());

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};