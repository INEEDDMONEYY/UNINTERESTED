import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react'; // ✅ Lucide X icon

export default function UserSearch({ users = [], onResults, query, onQueryChange }) {
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const results = users.filter(user =>
      user.username?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(results);

    const fetchPostsByUsername = async () => {
      if (!query.trim()) {
        if (onResults) onResults([]);
        return;
      }

      if (results.length === 0) {
        if (onResults) onResults([]);
        return;
      }

      const username = results[0].username;
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL || ""}/api/posts?username=${username}`
        );
        if (onResults) onResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch posts for user:", err);
        if (onResults) onResults([]);
      }
    };

    fetchPostsByUsername();
  }, [query, users]);

  const handleClear = () => {
    onQueryChange('');
    if (onResults) onResults([]);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search users by username..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="px-4 py-2 border rounded w-full pr-10"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
