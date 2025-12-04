import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');          // ✅ NEW EMAIL STATE
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Role removed from public signup — admins will have a separate form
  const role = "user";

  // Keep API_BASE cleanup
  const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:5020';
  const API_BASE = rawBase.replace(/\/+$/, '');

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
        body: JSON.stringify({ username, email, password, role }),
        credentials: 'include',
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

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

      {/* Username */}
      <input
        type="text"
        placeholder="Create a username"
        className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      {/* ✅ NEW EMAIL INPUT (requested) */}
      <input
        type="email"
        placeholder="Enter your email"
        className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Enter your password"
        className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* ❌ ROLE DROPDOWN REMOVED */}

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
