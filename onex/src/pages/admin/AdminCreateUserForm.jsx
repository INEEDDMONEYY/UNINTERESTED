import { useState } from "react";

export default function AdminCreateUserForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE}/api/admin/create-user`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role })
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-96 p-4 border rounded-lg">
      <h2 className="text-xl mb-3">Admin: Create New User</h2>

      <input
        className="border p-2 m-1"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="border p-2 m-1"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 m-1"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        className="border p-2 m-1"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button className="border p-2 m-1 bg-pink-600 text-white">
        Create User
      </button>

      {message && <p className="text-center mt-2">{message}</p>}
    </form>
  );
}
