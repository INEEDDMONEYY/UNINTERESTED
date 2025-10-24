import { useState, useEffect } from 'react';

export default function UserSearch({ users = [], onResults }) {
  const [query, setQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const results = users.filter(user =>
      user.name?.toLowerCase().includes(query.toLowerCase()) ||
      user.username?.toLowerCase().includes(query.toLowerCase()) ||
      user.email?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(results);
    if (onResults) onResults(results);
  }, [query, users]);

  return (
    <>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 border rounded w-full mb-4"
      />
      <ul className="space-y-2">
        {filteredUsers.map(user => (
          <li key={user.id} className="p-2 border rounded">
            <strong>{user.name}</strong> ({user.username}) - {user.email}
          </li>
        ))}
      </ul>
    </>
  );
}
