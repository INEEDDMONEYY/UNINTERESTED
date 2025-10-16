export default function PromotedPosts() {
  return (
    <section className="px-6 py-10 max-w-7xl mx-auto">
      {/* 🏷️ Title + Description */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white">Promoted Posts</h2>
        <p className="text-sm text-black mt-2 underline"> 
          All promoted accounts have a duration, entertainer's vary at the end of 'users' promotion period!
        </p>
      </div>

      {/* 🧭 Scrollable Grid */}
      <div
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-transparent"
        style={{
          scrollbarWidth: "thin",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {Array.from({ length: 18 }).map((_, index) => (
          <div
            key={index}
            className="w-[100px] h-[100px] bg-white/80 backdrop-blur-md border border-pink-100 rounded-lg shadow-sm p-2 text-center flex-shrink-0 animate-pulse hover:animate-none hover:shadow-pink-300 hover:shadow-md transition-all duration-200"
          >
            <h3 className="text-xs font-semibold text-pink-600 mb-1">Post #{index + 1}</h3>
            <p className="text-[10px] text-gray-500">
              Placeholder content. Dynamic data will be loaded soon.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
