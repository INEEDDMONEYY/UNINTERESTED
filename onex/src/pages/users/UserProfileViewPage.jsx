import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import UserProfileHeader from "../../components/Users/UserProfileHeader";
import PostList from "../../components/Posts/PostList";
import UserAvailabilityDisplay from "../../components/UserDisplay/UserAvailabilityDisplay";
import UserMeetupDisplay from "../../components/UserDisplay/UserMeetupDisplay";

export default function UserProfileViewPage({ userId: propUserId = null }) {
  const params = useParams();
  const userId = useMemo(() => propUserId || params?.id || null, [propUserId, params]);

  // Build per-user localStorage keys
  const availabilityKey = useMemo(() => `availability_${userId}`, [userId]);
  const incallKey = useMemo(() => `incallPrice_${userId}`, [userId]);
  const outcallKey = useMemo(() => `outcallPrice_${userId}`, [userId]);

  // State controlled by parent
  const [availability, setAvailability] = useState({ status: "" });
  const [incallPrice, setIncallPrice] = useState("");
  const [outcallPrice, setOutcallPrice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Hydrate state from localStorage when userId changes
  useEffect(() => {
    try {
      const savedAvail = localStorage.getItem(availabilityKey);
      setAvailability(savedAvail ? JSON.parse(savedAvail) : { status: "" });

      const savedIncall = localStorage.getItem(incallKey);
      setIncallPrice(savedIncall ?? "");

      const savedOutcall = localStorage.getItem(outcallKey);
      setOutcallPrice(savedOutcall ?? "");
    } catch {
      setAvailability({ status: "" });
      setIncallPrice("");
      setOutcallPrice("");
    }
  }, [userId, availabilityKey, incallKey, outcallKey]);

  // Persist availability
  useEffect(() => {
    try {
      localStorage.setItem(availabilityKey, JSON.stringify(availability));
      setRefreshKey(prev => prev + 1);
    } catch {}
  }, [availability, availabilityKey]);

  // Persist incall price
  useEffect(() => {
    try {
      localStorage.setItem(incallKey, incallPrice ?? "");
      setRefreshKey(prev => prev + 1);
    } catch {}
  }, [incallPrice, incallKey]);

  // Persist outcall price
  useEffect(() => {
    try {
      localStorage.setItem(outcallKey, outcallPrice ?? "");
      setRefreshKey(prev => prev + 1);
    } catch {}
  }, [outcallPrice, outcallKey]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* User Info */}
      <section>
        <UserProfileHeader refreshKey={refreshKey} userId={userId} />
      </section>

      {/* Availability */}
      <section>
        <UserAvailabilityDisplay availability={availability} />
      </section>

      {/* Meetup Prices */}
      <section>
        <UserMeetupDisplay
          userId={userId}
          incallPrice={incallPrice}
          setIncallPrice={setIncallPrice}
          outcallPrice={outcallPrice}
          setOutcallPrice={setOutcallPrice}
        />
      </section>

      {/* User's Posts */}
      <section>
        <PostList authorId={userId} />
      </section>
    </div>
  );
}
