// import { createContext, useState, useContext, useEffect } from 'react'; // ✅ Add useEffect

// const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// const getInitialUser = () => {
//   try {
//     const item = localStorage.getItem('user');
//     return item ? JSON.parse(item) : null;
//   } catch (error) {
//     console.error("Failed to parse user from localStorage", error);
//     localStorage.removeItem('user');
//     return null;
//   }
// };


// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(getInitialUser());

//   // ✅ ADD THIS useEffect HOOK
//   // This keeps the user logged in even if they refresh the page.
//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');

//     if (storedToken && storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);


//   // The login function now expects the whole API response data: { user, token }
//   const login = (data) => {
//     // Check if both user and token exist in the data from the API
//     if (data.user && data.token) {
//         // 1. Save the token to localStorage
//         localStorage.setItem('token', data.token); // ✅ ADD THIS LINE

//         // 2. Save the user object to localStorage
//         localStorage.setItem('user', JSON.stringify(data.user));

//         // 3. Set the user in the component's state
//         setUser(data.user);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token'); // ✅ ADD THIS LINE
//     setUser(null);
//   };

//   const value = {
//     user,
//     login,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// --- Function to safely get user data from localStorage ---
const getInitialUser = () => {
  try {
    const item = localStorage.getItem('user');
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    localStorage.removeItem('user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser());
  // We also need to get the token, which we'll use for API calls
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (userData, token) => {
    // Save both the user data and the token to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    setToken(token);
  };

  // const logout = () => {
  //   // Remove both user and token on logout
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('token');
  //   setUser(null);
  //   setToken(null);
  // };

  const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  setUser(null);
  setToken(null);
  window.location.reload();
};

  const value = {
    user,
    token, // Expose the token through the context
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};