import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated && user?.isAdmin ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" />
  );
};

export default AdminRoute;