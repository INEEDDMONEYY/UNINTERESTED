import UserSearch from '../../components/Searchbar/UserSearch'; // adjust path as needed

export default function CategoryDisplay({ selectedCategory, users = [] }) {
  return (
    <div className="w-full py-10 px-6 md:px-12 lg:px-20">
      <div className="bg-white text-black rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-2xl font-bold mb-2 md:mb-0">
            {selectedCategory ? `Posts for: ${selectedCategory}` : 'Select a category to view posts'}
          </h2>
          <div className="md:w-1/2 lg:w-1/3">
            <UserSearch users={users} />
          </div>
        </div>

        {selectedCategory ? (
          <div className="text-gray-700">
            {/* Placeholder for future post rendering */}
            <p>
              Loading posts for <strong>{selectedCategory}</strong>... (Backend integration coming soon)
            </p>
          </div>
        ) : (
          <p className="text-gray-500 italic">No category selected.</p>
        )}
      </div>
    </div>
  );
}
