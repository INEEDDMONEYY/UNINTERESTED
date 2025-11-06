// ✅ UserProfileSettings.jsx (refactored to delegate update logic)
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import AvailabilitySettings from "../../components/Settings/UserDashboardSettings/AvailabilitySettings";
import UpdateProfileSettings from "../../components/Settings/UserDashboardSettings/UpdateProfileSettings";
import MeetupServiceSettings from "../../components/Settings/UserDashboardSettings/MeetupServiceSettings";

export default function UserProfileSettings({ onProfileUpdate }) {
  const { user } = useContext(UserContext);

  return (
    <div className="relative w-full max-w-2xl mx-auto space-y-10 p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-pink-700 text-center">
        Profile Settings
      </h1>

      {/* ✅ Moved profile update UI into its own component */}
      <UpdateProfileSettings onProfileUpdate={onProfileUpdate} user={user} />

      {/* ✅ Availability Settings stays the same */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-medium text-gray-700">
          <span className="text-pink-600">📅</span> Availability Settings
        </h2>
        <div className="border border-pink-100 rounded-lg p-4 bg-white shadow-sm">
          <AvailabilitySettings />
        </div>
      </section>

      {/* ✅ Meetup Service Settings added after Availability Settings */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-medium text-gray-700">
          <span className="text-pink-600">🤝</span> Meetup Service Settings
        </h2>
        <div className="border border-pink-100 rounded-lg p-4 bg-white shadow-sm">
          <MeetupServiceSettings />
        </div>
      </section>
    </div>
  );
}
