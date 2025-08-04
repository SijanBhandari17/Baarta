import { createContext, useContext, useState, useEffect } from 'react';
// import socket from '../socket';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    // socket.connect();
    //
    // socket.on('message', data => {
    //   console.log('Received message: ', data);
    // });
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/dashboard', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginAction = userData => {
    setUser(userData);
  };

  const logOut = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Logout successful');
      } else {
        console.error('Logout failed on server:', response.status);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };
  const handleProfilePicChange = profileData => {
    setUser(prev => ({
      ...prev,
      info: {
        ...prev.info,
        profilePic: profileData,
      },
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginAction,
        logOut,
        checkAuthStatus,
        handleProfilePicChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
