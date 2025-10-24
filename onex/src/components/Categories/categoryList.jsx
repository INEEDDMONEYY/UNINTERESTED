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
    <div className="w-full py-10 px-6 md:px-12 lg:px-20">
      <div className="flex overflow-x-auto gap-6 scrollbar-hide px-4">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => onSelect(category)}
            className="min-w-[160px] bg-white text-black font-semibold py-6 px-4 rounded-lg shadow-md flex items-center justify-center text-center hover:scale-105 hover:bg-gradient-to-r hover:from-pink-400 hover:to-yellow-300 transition duration-300 ease-in-out cursor-pointer"
          >
            <span className="text-sm">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
