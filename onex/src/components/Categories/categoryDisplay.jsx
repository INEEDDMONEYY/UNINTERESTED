export default function CategoryDisplay({ selectedCategory }) {
  return (
    <div className="w-full py-10 px-6 md:px-12 lg:px-20">
      <div className="bg-white text-black rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">
          {selectedCategory ? `Posts for: ${selectedCategory}` : 'Select a category to view posts'}
        </h2>

        {selectedCategory ? (
          <div className="text-gray-700">
            {/* Placeholder for future post rendering */}
            <p>Loading posts for <strong>{selectedCategory}</strong>... (Backend integration coming soon)</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">No category selected.</p>
        )}
      </div>
    </div>
  );
}
