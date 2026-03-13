import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../utils/api";

const PLACEHOLDER_PROFILE = {
  profilePic:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
  username: "YourUsername",
  bio: "This is how promoted profiles are displayed to users.",
};

function useCountdown(expiryDate) {
  const calcRemaining = () => {
    const diff = new Date(expiryDate).getTime() - Date.now();
    if (diff <= 0) return null;
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  };

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const id = setInterval(() => {
      const next = calcRemaining();
      setRemaining(next);
      if (!next) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiryDate]);

  return remaining;
}

function CountdownBadge({ expiryDate }) {
  const remaining = useCountdown(expiryDate);

  if (!remaining) {
    return (
      <span className="mt-2 inline-block text-[10px] font-semibold text-gray-400">
        Promotion ended
      </span>
    );
  }

  const parts = [];
  if (remaining.days > 0) parts.push(`${remaining.days}d`);
  parts.push(
    `${String(remaining.hours).padStart(2, "0")}h`,
    `${String(remaining.minutes).padStart(2, "0")}m`,
    `${String(remaining.seconds).padStart(2, "0")}s`,
  );

  return (
    <span className="mt-2 inline-block text-[10px] font-semibold text-pink-500 tabular-nums">
      ⏱ {parts.join(" ")}
    </span>
  );
}

function ProfileCard({ profile, isPlaceholder = false }) {
  const userId = profile?._id || profile?.id || profile?.userId || "";
  const username = profile?.username || "";
  const profilePath = userId
    ? `/user/${userId}`
    : username
      ? `/profile/${encodeURIComponent(username)}`
      : null;

  const cardClasses = `relative w-[210px] rounded-xl border p-4 text-center flex-shrink-0 transition-all duration-200 ${
    isPlaceholder
      ? "bg-pink-50 border-pink-300 shadow-sm"
      : "bg-white/90 backdrop-blur-sm border-pink-100 shadow-sm hover:shadow-pink-200"
  }`;

  const cardContent = (
    <>
      {!isPlaceholder && (
        <span
          className="absolute top-3 right-3 inline-flex items-center justify-center"
          aria-label="Promoted account"
          title="Promoted account"
        >
          <BadgeCheck size={18} className="text-pink-500 fill-pink-100" />
        </span>
      )}
      <img
        src={profile.profilePic || "https://via.placeholder.com/64?text=?"}  
        alt={username || "Promoted user"}
        className="w-16 h-16 rounded-full object-cover border-2 border-pink-300 mx-auto mb-3"
      />
      <h3 className="text-sm font-semibold text-pink-600 break-words">{username}</h3>
      <p className="text-xs text-gray-600 mt-1 break-words">{profile.bio || "No bio provided."}</p>
      {!isPlaceholder && profile.activePromoExpiry && (
        <CountdownBadge expiryDate={profile.activePromoExpiry} />
      )}
    </>
  );

  if (!isPlaceholder && profilePath) {
    return (
      <Link to={profilePath} className={`${cardClasses} cursor-pointer`}>
        {cardContent}
      </Link>
    );
  }

  return (
    <article className={cardClasses}>
      {cardContent}
    </article>
  );
}

export default function PromotedPosts() {
  const [promotedUsers, setPromotedUsers] = useState([]);

  useEffect(() => {
    const fetchPromoted = async () => {
      try {
        const { data } = await api.get("/public/users/promoted");
        const users = Array.isArray(data?.data) ? data.data : [];
        setPromotedUsers(users);
      } catch (err) {
        console.error("Failed to fetch promoted users:", err);
        setPromotedUsers([]);
      }
    };

    fetchPromoted();

    const handlePromoUpdated = () => {
      fetchPromoted();
    };
    window.addEventListener("promo-updated", handlePromoUpdated);

    // Re-fetch every 60 s so expired accounts drop off without a full page reload
    const id = setInterval(fetchPromoted, 60_000);
    return () => {
      clearInterval(id);
      window.removeEventListener("promo-updated", handlePromoUpdated);
    };
  }, []);

  return (
    <section className="px-6 py-10 max-w-7xl mx-auto">
      {/* Title + Description */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white">Promoted Posts</h2>
        <button
          type="button"
          className="mt-3 px-3 py-1 text-[11px] font-semibold rounded-full bg-pink-600 text-white shadow-sm"
        >
          Promoted accounts
        </button>
      </div>

      {/* Scrollable Profile Row */}
      <div
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-transparent"
        style={{
          scrollbarWidth: "thin",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <ProfileCard profile={PLACEHOLDER_PROFILE} isPlaceholder />

        {promotedUsers.length > 0 ? (
          promotedUsers.map((user) => (
            <ProfileCard key={user._id || user.id} profile={user} />
          ))
        ) : (
          <div className="w-[260px] rounded-xl border border-dashed border-gray-300 bg-white/70 p-4 text-sm text-gray-600 flex-shrink-0">
            No active promo profiles yet.
          </div>
        )}
      </div>
    </section>
  );
}
