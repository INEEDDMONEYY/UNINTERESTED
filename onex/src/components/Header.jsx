import { useDevMessage } from "../context/DevMessageContext";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";

const HERO_BG = "/mm-hero.png";

export default function Header() {
  const { devMessage } = useDevMessage();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const isLoggedIn = user && user.username;
  const heroMessage =
    devMessage ||
    "Where imagination meets adventure. Every door opens to something unexpected, and every moment brings you closer to the unknown.";

  return (
    <header className="relative flex min-h-[70vh] w-full items-center justify-center px-3 pt-8 pb-12 font-[Jost,sans-serif] sm:min-h-[72vh] sm:px-4 sm:pt-10 sm:pb-16">
      {/* Pink Glow Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-[85%] w-[90%] rounded-3xl bg-pink-400/20 blur-3xl"></div>
      </div>

      {/* Hero Image Container */}
      <div className="relative w-full max-w-6xl overflow-hidden rounded-xl shadow-2xl sm:rounded-2xl">

        {/* Blurred Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-md scale-105"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundPosition: "center top",
          }}
        />

        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-black/75" />

        {/* Greeting for logged-in users */}
        {isLoggedIn && (
          <div className="absolute left-3 top-3 z-10 max-w-[calc(100%-1.5rem)] truncate rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[0.65rem] tracking-[0.05em] text-white backdrop-blur sm:left-6 sm:top-5 sm:max-w-none sm:px-4 sm:text-xs sm:tracking-[0.06em]">
            Welcome back, <strong>{user.username}</strong>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-[5] mx-auto max-w-[760px] px-4 py-14 text-center sm:px-6 sm:py-24">

          <p className="mb-3 text-[0.62rem] uppercase tracking-[0.18em] text-white/70 sm:mb-4 sm:text-[0.72rem] sm:tracking-[0.25em]">
            Your sexual desires await here
          </p>

          <h1 className="mb-4 font-[Cormorant_Garamond,serif] text-[clamp(1.9rem,9vw,4.2rem)] font-bold leading-[1.1] text-white drop-shadow-lg sm:mb-6 sm:leading-[1.15]">
            {isLoggedIn
              ? `Welcome Back, ${user.username}.`
              : "Unlock the Mystery. All In One Place."}
          </h1>

          <p className="mx-auto mb-7 max-w-[520px] text-[0.9rem] font-light leading-[1.6] text-white/90 drop-shadow sm:mb-9 sm:text-[clamp(0.9rem,1.6vw,1.05rem)] sm:leading-[1.7]">
            {heroMessage}
          </p>

          {!isLoggedIn && (
            <Motion.div
              animate={{ y: [0, 0, 0, -3, 2, -1, 0] }}
              transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, times: [0, 0.88, 0.9, 0.93, 0.96, 0.98, 1] }}
              className="inline-flex w-full max-w-[260px] sm:w-auto sm:max-w-none"
            >
              <Link
                to="/signup"
                className="inline-flex w-full items-center justify-center rounded-sm bg-white px-6 py-3 text-[0.68rem] font-medium uppercase tracking-[0.11em] text-[#111] transition hover:-translate-y-px hover:bg-[#e8e8e8] sm:px-10 sm:text-xs sm:tracking-[0.15em]"
              >
                Start your journey
              </Link>
            </Motion.div>
          )}
        </div>

      </div>
    </header>
  );
}