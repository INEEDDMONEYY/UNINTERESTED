import { useEffect } from "react";
import { X } from "lucide-react";

export default function UserSearch({
  users = [],
  query,
  onQueryChange,
  onSelectUser = () => {}, // ✅ fallback to prevent TypeError
}) {
  useEffect(() => {
    if (!query || typeof query !== "string" || query.trim() === "") {
      onSelectUser(null);
      return;
    }

    const results = users.filter((user) =>
      user?.username?.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length > 0) {
      onSelectUser(results[0].username);
    } else {
      onSelectUser(null);
    }
  }, [query, users]);

  const handleClear = () => {
    onQueryChange("");
    onSelectUser(null);
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
