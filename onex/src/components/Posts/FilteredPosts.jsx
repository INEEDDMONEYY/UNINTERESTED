export default function FilteredPosts() {
      const filteredPosts = posts.filter((post) => {
    const matchesLocation =
      !location ||
      post.city?.toLowerCase() === location.city?.toLowerCase() ||
      post.state?.toLowerCase() === location.state?.toLowerCase();

    const matchesCategory =
      !selectedCategory || post.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesLocation && matchesCategory;
  });
    return(
        <>
      {/* ✅ Filtered Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, i) => (
            <div key={i} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
              <h3 className="text-black font-semibold text-md mb-1">{post.title}</h3>
              <p className="text-gray-700 text-sm">{post.content}</p>
              {(post.city || post.state) && (
                <p className="text-gray-500 text-xs mt-1">
                  {post.city}, {post.state}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">No posts available.</p>
        )}
      </div>
        </>
    )
}