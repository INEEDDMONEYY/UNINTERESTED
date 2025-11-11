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
    <section className="w-full px-4 py-4 md:px-6 lg:px-8">
      <h2 className="text-base md:text-lg font-semibold text-pink-700 mb-4 text-center flex items-center justify-center gap-2">
        <CalendarDays className="text-pink-600" size={20} />
        Weekly Availability
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="bg-white shadow rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-2 text-pink-600 text-sm font-medium">
              <CalendarDays size={16} />
              <span>{day}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-xs">
              <Clock size={14} className="text-pink-500" />
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
