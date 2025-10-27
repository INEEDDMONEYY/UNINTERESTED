import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5020/api';

  const handleSignup = async (e) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
        credentials: 'include', // ✅ Important for cookie auth
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/home');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Server error: ' + (err?.message || ''));
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col w-96">
      <input
        type="text"
        placeholder="Create a username"
        className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Enter your password"
        className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <select
        className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button
        type="submit"
        className="border-2 border-white m-1 px-1 text-black text-[1.3rem] rounded-md"
      >
        Sign Up
      </button>

      {error && <div className="text-red-600 text-sm m-2">{error}</div>}

      <div>
        <h3 className="text-black text-[1rem] underline">
          Already have an account?{' '}
          <Link to="/signin" className="text-pink-700">
            Sign In
          </Link>
        </h3>
        <Link to="/home">
          <p className="underline text-pink-700">Return home</p>
        </Link>
      </div>
    </form>
  );
}
