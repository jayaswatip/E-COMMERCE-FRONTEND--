import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin()) {
    // Redirect to home if not admin but trying to access admin route
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
