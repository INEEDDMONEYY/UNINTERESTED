// ✅ UserProfileSettings.jsx (integrated with Availability + Meetup display + persistence)
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import AvailabilitySettings from "../../components/Settings/UserDashboardSettings/AvailabilitySettings";
import UpdateProfileSettings from "../../components/Settings/UserDashboardSettings/UpdateProfileSettings";
import MeetupServiceSettings from "../../components/Settings/UserDashboardSettings/MeetupServiceSettings";
import UserAvailabilityDisplay from "../../components/UserDisplay/UserAvailabilityDisplay";
import { DollarSign } from "lucide-react";

export default function UserProfileSettings({ onProfileUpdate }) {
  const { user } = useContext(UserContext);

  // ✅ Lifted state with persistence
  const [incallPrice, setIncallPrice] = useState(() => {
    return localStorage.getItem("incallPrice") || "";
  });
  const [outcallPrice, setOutcallPrice] = useState(() => {
    return localStorage.getItem("outcallPrice") || "";
  });
  const [availability, setAvailability] = useState(() => {
    const saved = localStorage.getItem("availability");
    return saved ? JSON.parse(saved) : { status: "" };
  });

  // ✅ Persist availability changes
  useEffect(() => {
    localStorage.setItem("availability", JSON.stringify(availability));
  }, [availability]);

  // ✅ Persist prices
  useEffect(() => {
    localStorage.setItem("incallPrice", incallPrice);
  }, [incallPrice]);

  useEffect(() => {
    localStorage.setItem("outcallPrice", outcallPrice);
  }, [outcallPrice]);

  return (
    <div className="relative w-full max-w-2xl mx-auto space-y-10 p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-pink-700 text-center">
        Profile Settings
      </h1>

      {/* ✅ Profile Update */}
      <UpdateProfileSettings onProfileUpdate={onProfileUpdate} user={user} />

      {/* ✅ Availability Settings */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-medium text-gray-700">
          <span className="text-pink-600">📅</span> Availability Settings
        </h2>
        <div className="border border-pink-100 rounded-lg p-4 bg-white shadow-sm">
          <AvailabilitySettings
            availability={availability}
            setAvailability={setAvailability}
          />
        </div>
      </section>

      {/* ✅ Meetup Service Settings */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-medium text-gray-700">
          <span className="text-pink-600">🤝</span> Meetup Service Settings
        </h2>
        <div className="border border-pink-100 rounded-lg p-4 bg-white shadow-sm">
          <MeetupServiceSettings
            incallPrice={incallPrice}
            setIncallPrice={setIncallPrice}
            outcallPrice={outcallPrice}
            setOutcallPrice={setOutcallPrice}
          />
        </div>
      </section>

      {/* ✅ Integrated Display */}
      <section className="space-y-6">
        <h2 className="flex items-center gap-2 font-medium text-gray-700">
          <span className="text-pink-600">👀</span> Current Settings Overview
        </h2>

        {/* Meetup Prices */}
        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-6 px-4">
          {/* Incall Card */}
          <div
            className="w-[130px] h-[130px] flex flex-col justify-center items-center 
                       text-center rounded-xl shadow-lg p-4
                       bg-gradient-to-br from-pink-500 to-red-500 
                       bg-clip-padding backdrop-filter backdrop-blur-md 
                       bg-opacity-30 border border-white/20"
          >
            <h3 className="flex flex-col items-center text-base font-semibold text-white mb-2">
              <DollarSign size={18} className="text-white mb-1" />
              Incall
            </h3>
            <p className="text-white text-sm font-medium">
              {incallPrice ? `$${incallPrice}` : "Not set"}
            </p>
          </div>

          {/* Outcall Card */}
          <div
            className="w-[130px] h-[130px] flex flex-col justify-center items-center 
                       text-center rounded-xl shadow-lg p-4
                       bg-gradient-to-br from-pink-500 to-red-500 
                       bg-clip-padding backdrop-filter backdrop-blur-md 
                       bg-opacity-30 border border-white/20"
          >
            <h3 className="flex flex-col items-center text-base font-semibold text-white mb-2">
              <DollarSign size={18} className="text-white mb-1" />
              Outcall
            </h3>
            <p className="text-white text-sm font-medium">
              {outcallPrice ? `$${outcallPrice}` : "Not set"}
            </p>
          </div>
        </div>

        {/* ✅ Availability Display (replaces custom card) */}
        <UserAvailabilityDisplay availability={availability} />
      </section>
    </div>
  );
}
