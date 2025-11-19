import { useState, useEffect } from "react";
import UserProfileHeader from '../../components/Users/UserProfileHeader';
import PostList from '../../components/Posts/PostList';
import UserAvailabilityDisplay from '../../components/UserDisplay/UserAvailabilityDisplay';
import UserMeetupDisplay from '../../components/UserDisplay/UserMeetupDisplay';

export default function UserProfileViewPage() {
  const [availability, setAvailability] = useState(() => {
    const saved = localStorage.getItem("availability");
    return saved ? JSON.parse(saved) : { status: "" };
  });

  const [incallPrice, setIncallPrice] = useState(() => {
    return localStorage.getItem("incallPrice") || "";
  });

  const [outcallPrice, setOutcallPrice] = useState(() => {
    return localStorage.getItem("outcallPrice") || "";
  });

  // ✅ Add refreshKey to trigger UserProfileHeader re-render
  const [refreshKey, setRefreshKey] = useState(0);

  // keep availability in sync
  useEffect(() => {
    localStorage.setItem("availability", JSON.stringify(availability));
    // bump refreshKey when availability changes
    setRefreshKey(prev => prev + 1);
  }, [availability]);

  // keep prices in sync
  useEffect(() => {
    localStorage.setItem("incallPrice", incallPrice);
    // bump refreshKey when incallPrice changes
    setRefreshKey(prev => prev + 1);
  }, [incallPrice]);

  useEffect(() => {
    localStorage.setItem("outcallPrice", outcallPrice);
    // bump refreshKey when outcallPrice changes
    setRefreshKey(prev => prev + 1);
  }, [outcallPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 👤 User Info Section */}
      <section>
        <UserProfileHeader refreshKey={refreshKey} />
      </section>

      {/* 📝 User Availability Section */}
      <section>
        <UserAvailabilityDisplay availability={availability} />
      </section>

      {/* 🏷️ User Meetup price display */}
      <section>
        <UserMeetupDisplay
          incallPrice={incallPrice}
          outcallPrice={outcallPrice}
        />
      </section>
    </div>
  );
}

