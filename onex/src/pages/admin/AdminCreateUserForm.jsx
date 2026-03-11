import { useState } from "react";

export default function AdminCreateUserForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE ||
    "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/admin/create-user`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to create user.");
      } else {
        setMessage(data.message || "User created successfully.");

        setUsername("");
        setEmail("");
        setPassword("");
        setRole("user");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white shadow-md rounded-xl p-6">

      <h2 className="text-xl font-semibold text-pink-700 mb-4 text-center">
        Create New User
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {/* Username */}
        <input
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* Email */}
        <input
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <input
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Role */}
        <select
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition disabled:opacity-50"
        >
          {loading ? "Creating User..." : "Create User"}
        </button>

        {/* Message */}
        {message && (
          <p className="text-center text-sm text-gray-700">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}