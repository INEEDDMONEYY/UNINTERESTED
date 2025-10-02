import { Navigate } from 'react-router';

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')); // assuming you store user info

  if (!token) return <Navigate to="/signin" />;

  if (role && user?.role !== role) {
    return <Navigate to="/home" />;
  }

  return children;
}
