import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import env from '../config/env'; // ✅ central env

export default function SigninForm() {
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const API_BASE = env.API_BASE;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) localStorage.setItem('token', data.token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        setError(data.error || 'Sign in failed');
      }
    } catch (err) {
      setError('Error connecting to server: ' + (err?.message || ''));
    }

    setUsername('');
    setPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-96">
      <input
        type="text"
        name="username"
        placeholder="Enter your username"
        className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        className="border-2 border-pink-600 m-2 px-1 text-[1rem] text-black rounded-lg"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div>
        <button
          type="submit"
          className="border-2 border-white m-1 px-1 text-black text-[1.3rem] rounded-md"
        >
          Sign In
        </button>
      </div>

      {error && <div className="text-red-600 text-sm m-2">{error}</div>}

      <div>
        <h3 className="text-black text-[1rem] underline">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-pink-700">
            Sign Up
          </Link>
        </h3>
        <Link to="/forgotpass">
          <p className="underline text-red-700">Forgot password?</p>
        </Link>
        <Link to="/home">
          <p className="underline text-pink-700">Return home</p>
        </Link>
      </div>
    </form>
  );
}
