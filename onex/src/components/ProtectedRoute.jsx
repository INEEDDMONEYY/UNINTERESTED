import { Navigate } from 'react-router'

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to='/signin' />;
}