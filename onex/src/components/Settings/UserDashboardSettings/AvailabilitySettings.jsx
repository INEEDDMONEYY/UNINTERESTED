export default function AvailabilitySettings() {
  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const suffix = i < 12 ? "AM" : "PM";
    return `${hour}:00 ${suffix}`;
  });

  return (
    <section className="w-full px-4 py-6 md:px-8 lg:px-12">
      <h2 className="text-xl md:text-2xl font-semibold text-pink-700 mb-6 text-center">
        Set your availability so your clients know when to book.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOfWeek.map((day) => (
          <div key={day} className="bg-white shadow rounded-lg p-4">
            <label className="block text-pink-600 font-medium mb-2">{day}</label>
            <select className="w-full border border-pink-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400">
              <option value="">Select available time</option>
              {hours.map((hour) => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}
