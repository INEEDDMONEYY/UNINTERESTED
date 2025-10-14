export default function PromotedPosts() {
  return (
    <section className="px-6 py-10 max-w-7xl mx-auto">
      {/* 🏷️ Title + Description */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white">Promoted Posts</h2>
        <p className="text-sm text-black mt-2 underline">
          All Promoted Post have a duration, entertainer vary!
        </p>
      </div>

      {/* 🧭 Scrollable Grid */}
      <div
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-transparent"
        style={{
          scrollbarWidth: "thin",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {Array.from({ length: 18 }).map((_, index) => (
          <div
            key={index}
            className="min-w-[250px] bg-white/80 backdrop-blur-md border border-pink-200 rounded-xl shadow-md p-6 text-center flex-shrink-0 animate-pulse hover:animate-none hover:shadow-pink-500 hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-pink-700 mb-2">Post #{index + 1}</h3>
            <p className="text-sm text-gray-600">
              This is a placeholder for a promoted post. Future content will be dynamically loaded from the backend.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}


