// ✅ UserProfileSettings.jsx (integrated with Availability + Meetup display + per-user persistence)
import { useContext, useState, useEffect, useMemo } from "react";
import { UserContext } from "../../context/UserContext";
import AvailabilitySettings from "../../components/Settings/UserDashboardSettings/AvailabilitySettings";
import UpdateProfileSettings from "../../components/Settings/UserDashboardSettings/UpdateProfileSettings";
import MeetupServiceSettings from "../../components/Settings/UserDashboardSettings/MeetupServiceSettings";
import UserAvailabilityDisplay from "../../components/UserDisplay/UserAvailabilityDisplay";
import { FEATURE_FLAGS } from "../../config/featureFlags";
import { DollarSign } from "lucide-react";

export default function UserProfileSettings({ onProfileUpdate }) {
  const { user } = useContext(UserContext);

  // ✅ Stable userId for namespacing localStorage keys
  const userId = useMemo(() => user?._id || user?.id || null, [user]);

  // ✅ Per-user keys
  const incallKey = useMemo(
    () => (userId ? `incallPrice_${userId}` : "incallPrice"),
    [userId]
  );
  const outcallKey = useMemo(
    () => (userId ? `outcallPrice_${userId}` : "outcallPrice"),
    [userId]
  );
  const availabilityKey = useMemo(
    () => (userId ? `availability_${userId}` : "availability"),
    [userId]
  );

  // ✅ Lifted state with per-user persistence (hydrate by user)
  const [incallPrice, setIncallPrice] = useState(() => {
    const saved = localStorage.getItem(incallKey);
    return saved ?? "";
  });

  const [outcallPrice, setOutcallPrice] = useState(() => {
    const saved = localStorage.getItem(outcallKey);
    return saved ?? "";
  });

  const [availability, setAvailability] = useState(() => {
    const saved = localStorage.getItem(availabilityKey);
    return saved ? JSON.parse(saved) : { status: "" };
  });

  // ✅ Rehydrate when the user changes (avoid cross-user bleed)
  useEffect(() => {
    const savedIncall = localStorage.getItem(incallKey);
    setIncallPrice(savedIncall ?? "");

    const savedOutcall = localStorage.getItem(outcallKey);
    setOutcallPrice(savedOutcall ?? "");

    const savedAvailability = localStorage.getItem(availabilityKey);
    setAvailability(savedAvailability ? JSON.parse(savedAvailability) : { status: "" });
  }, [incallKey, outcallKey, availabilityKey]);

  // ✅ Persist per-user availability changes
  useEffect(() => {
    try {
      localStorage.setItem(availabilityKey, JSON.stringify(availability));
    } catch {}
  }, [availability, availabilityKey]);

  // ✅ Persist per-user prices
  useEffect(() => {
    try {
      localStorage.setItem(incallKey, incallPrice ?? "");
    } catch {}
  }, [incallPrice, incallKey]);

  useEffect(() => {
    try {
      localStorage.setItem(outcallKey, outcallPrice ?? "");
    } catch {}
  }, [outcallPrice, outcallKey]);

  return (
    <div className="relative w-full max-w-2xl mx-auto space-y-10 p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-pink-700 text-center">
        Profile Settings
      </h1>

      {/* ✅ Profile Update */}
      <UpdateProfileSettings onProfileUpdate={onProfileUpdate} user={user} />

      {/* =====================================================================================
          AVAILABILITY SETTINGS — controlled by FEATURE_FLAGS.AVAILABILITY_SETTINGS
         ===================================================================================== */}
      {FEATURE_FLAGS.AVAILABILITY_SETTINGS && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 font-medium text-gray-700">
            <span className="text-pink-600">📅</span> Availability Settings
          </h2>
          <div className="border border-pink-100 rounded-lg p-4 bg-white shadow-sm">
            <AvailabilitySettings
              availability={availability}
              setAvailability={setAvailability}
              userId={userId} // pass userId to namespace storage
            />
          </div>
        </section>
      )}

      {/* =====================================================================================
          MEETUP SERVICE SETTINGS — controlled by FEATURE_FLAGS.MEETUP_SERVICE_SETTINGS
         ===================================================================================== */}
      {FEATURE_FLAGS.MEETUP_SERVICE_SETTINGS && (
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
              userId={userId} // pass userId to namespace storage
            />
          </div>
        </section>
      )}

      {/* =====================================================================================
          OVERVIEW DISPLAY — controlled by FEATURE_FLAGS.SETTINGS_OVERVIEW
         ===================================================================================== */}
      {FEATURE_FLAGS.SETTINGS_OVERVIEW && (
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

          {/* Availability Display */}
          <UserAvailabilityDisplay availability={availability} />
        </section>
      )}
    </div>
  );
}
