export default function CategoryList({ onSelect }) {
  const categories = [
    'Restrictions 🚫',
    'Only AA 🔥',
    'MM Baddies 💝',
    'MM Latinas 🏳️',
    'MM BBW ⛱️',
    'MM Asians 🌏',
    'MM LGBQT+ 🌈',
    'MM 40+ 💘',
    'MM MILF 💅',
    'MM Request Pickup/Dropoff 💳',
    'MM Car Dates 🚘',
  ];

  return (
    <div className="w-full py-6 px-4 md:px-8 lg:px-12">
      <div className="flex overflow-x-auto gap-4 scrollbar-hide px-2">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => onSelect(category)}
            className="
              min-w-[120px] 
              bg-white text-black font-semibold 
              py-3 px-3 rounded-lg shadow-md 
              flex items-center justify-center text-center 
              hover:scale-105 hover:bg-gradient-to-r hover:from-pink-400 hover:to-yellow-300 
              transition duration-300 ease-in-out 
              focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-white
            "
          >
            <span className="text-sm">{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}


