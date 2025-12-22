import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Correct: API base from env
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  /* ========================= REGISTER ========================= */
  const register = async (email, password, googleData = null) => {
    setLoading(true);
    setError('');

    if (!email || (!password && !googleData)) {
      setError('Please provide all required fields');
      setLoading(false);
      return;
    }

    try {
      let response;

      if (googleData) {
        console.log(
          'Registering with Google:',
          `${API_BASE_URL}/api/auth/google-register`
        );

        response = await fetch(
          `${API_BASE_URL}/api/auth/google-register`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: googleData.profile.email,
              name: googleData.profile.name,
              googleId: googleData.profile.sub,
              picture: googleData.profile.picture,
            }),
          }
        );
      } else {
        console.log(
          'Registering with email:',
          `${API_BASE_URL}/api/auth/register`
        );

        response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            name: email.split('@')[0],
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const userWithAdminCheck = {
        ...data.user,
        isAdmin:
          data.user.role === 'admin' ||
          data.user.email === 'admin@example.com',
      };

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userWithAdminCheck));
      setUser(userWithAdminCheck);

      return { ...data, user: userWithAdminCheck };
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ========================= LOGIN ========================= */
  const login = async (email, password, googleData = null) => {
    setLoading(true);
    setError('');

    if (!email || (!password && !googleData)) {
      setError('Please provide email and password');
      setLoading(false);
      return;
    }

    try {
      let response;

      if (googleData) {
        console.log(
          'Google login:',
          `${API_BASE_URL}/api/auth/google-login`
        );

        response = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: googleData.profile.email,
            name: googleData.profile.name,
            googleId: googleData.profile.sub,
            picture: googleData.profile.picture,
          }),
        });
      } else {
        console.log(
          'Email login:',
          `${API_BASE_URL}/api/auth/login`
        );

        response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const userWithAdminCheck = {
        ...data.user,
        isAdmin:
          data.user.role === 'admin' ||
          data.user.email === 'admin@example.com',
      };

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userWithAdminCheck));
      setUser(userWithAdminCheck);

      return { ...data, user: userWithAdminCheck };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ========================= LOGOUT ========================= */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError('');
  };

  const clearError = () => setError('');

  /* ========================= ADMIN CHECK ========================= */
  const checkIsAdmin = useCallback(() => {
    return user?.role === 'admin' || user?.isAdmin === true;
  }, [user]);

  /* ========================= RESTORE LOGIN ========================= */
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({
          ...parsedUser,
          isAdmin:
            parsedUser.role === 'admin' || parsedUser.isAdmin === true,
        });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        error,
        clearError,
        isAdmin: checkIsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
