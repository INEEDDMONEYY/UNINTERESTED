import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return <button onClick={handleLogout}>Logout</button>;
}
