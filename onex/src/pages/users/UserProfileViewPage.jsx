import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserProfileHeader from "../../components/Users/UserProfileHeader";
import PostList from "../../components/Posts/PostList";
import UserAvailabilityDisplay from "../../components/UserDisplay/UserAvailabilityDisplay";
import UserMeetupDisplay from "../../components/UserDisplay/UserMeetupDisplay";
import { FEATURE_FLAGS } from "../../config/featureFlags";
import ReviewButton from "../../components/Buttons/reviewButtons/ReviewButton";
import ReferencesLinks from "../../components/References/ReferencesLinks.jsx";


export default function UserProfileViewPage({ userId: propUserId = null, disableActionButtons = false }) {
  const navigate = useNavigate();
  const params = useParams();

  const handleReturnToPost = () => {
    navigate("/home");
  };

  const userId = useMemo(() => {
    const routeUserId = params?.userId || params?.id || null;
    if (propUserId) return propUserId;
    return routeUserId || null;
  }, [propUserId, params]);

  // Build per-user localStorage keys
  const availabilityKey = useMemo(() => `availability_${userId}`, [userId]);
  const incallKey = useMemo(() => `incallPrice_${userId}`, [userId]);
  const outcallKey = useMemo(() => `outcallPrice_${userId}`, [userId]);

  // State controlled by parent
  const [availability, setAvailability] = useState({ status: "" });
  const [incallPrice, setIncallPrice] = useState("");
  const [outcallPrice, setOutcallPrice] = useState("");

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
    } catch {
      // Ignore localStorage write failures (quota/private mode).
    }
  }, [availability, availabilityKey]);

  // Persist incall price
  useEffect(() => {
    try {
      localStorage.setItem(incallKey, incallPrice ?? "");
    } catch {
      // Ignore localStorage write failures (quota/private mode).
    }
  }, [incallPrice, incallKey]);

  // Persist outcall price
  useEffect(() => {
    try {
      localStorage.setItem(outcallKey, outcallPrice ?? "");
    } catch {
      // Ignore localStorage write failures (quota/private mode).
    }
  }, [outcallPrice, outcallKey]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-36 sm:pb-10">
        {/* User Info */}
        <section>
          <UserProfileHeader userId={userId} />
        </section>

        <section>
          <ReferencesLinks userId={userId} />
        </section>

        {/* Availability */}
        {FEATURE_FLAGS.availability && (
          <section>
            <UserAvailabilityDisplay availability={availability} />
          </section>
        )}

        {/* Meetup Prices */}
        {FEATURE_FLAGS.meetupPricing && (
          <section>
            <UserMeetupDisplay
              userId={userId}
              incallPrice={incallPrice}
              setIncallPrice={setIncallPrice}
              outcallPrice={outcallPrice}
              setOutcallPrice={setOutcallPrice}
            />
          </section>
        )}

        {/* User's Posts */}
        <section>
          <PostList authorId={userId} />
        </section>
      </div>

      {!disableActionButtons && (
        <div className="fixed bottom-4 left-4 right-4 z-40 flex flex-col items-stretch gap-2 pb-[max(0px,env(safe-area-inset-bottom))] sm:bottom-6 sm:left-auto sm:right-6 sm:items-end sm:pb-0">
          <ReviewButton
            onClick={() => {
              if (!userId) return;
              navigate(`/reviews/${userId}`);
            }}
            disabled={!userId}
          />

          <button
            onClick={handleReturnToPost}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-white font-semibold transition-colors bg-gray-800 hover:bg-gray-900"
          >
            Return to post
          </button>
        </div>
      )}
    </>
  );
}
