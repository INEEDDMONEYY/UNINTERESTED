export default function CategoryList({ onSelect }) {
  const categories = [
    'Restrictions',
    'Only AA 🔥',
    'MM Baddies 💝',
    'MM BBW ⛱️',
    'MM Asians 🌏',
    'MM LGBQT+ 🌈',
    'MM 40+ 💘',
    'MM MILF 💅',
    'MM Request ride 💳',
    'MM Car Dates 🚘',
  ];

  return (
    <div className="w-full py-10 px-6 md:px-12 lg:px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => onSelect(category)}
            className="bg-white text-black font-semibold text-center py-6 px-4 rounded-lg shadow-md hover:scale-105 hover:bg-gradient-to-r hover:from-pink-400 hover:to-yellow-300 transition duration-300 ease-in-out cursor-pointer"
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  );
}
