import { useContext, useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { UserContext } from "../../context/UserContext";

export default function UserAvailabilityDisplay() {
  const { user } = useContext(UserContext);
  const [availability, setAvailability] = useState({});

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  useEffect(() => {
    if (user?.availability) {
      setAvailability(user.availability);
    }
  }, [user]);

  return (
    <section className="w-full px-4 py-6 md:px-6 lg:px-8">
      <h2 className="text-xl md:text-2xl font-semibold text-pink-700 mb-6 text-center flex items-center justify-center gap-2">
        <CalendarDays className="text-pink-600" size={22} />
        Weekly Availability
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOfWeek.map((day) => (
          <div key={day} className="bg-white shadow rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-pink-600 font-medium">
              <CalendarDays size={18} />
              <span>{day}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Clock size={16} className="text-pink-500" />
              <span>
                {availability[day] ? availability[day] : "Not available"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
