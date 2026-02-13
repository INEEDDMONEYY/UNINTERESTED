import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { FEATURE_FLAGS } from "../config/featureFlags";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-gray-700 py-8 px-6 w-full">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* ---------------- Left Section: Logo & Info ---------------- */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <img src={Logo} alt="Company Logo" className="h-12 w-auto" />
          <div className="mt-2 md:mt-0 text-sm md:text-left">
            <p className="font-bold text-lg md:text-base">Mystery Mansion</p>
            <p className="text-gray-400 text-sm">© {year}. All rights reserved.</p>
          </div>
        </div>

        {/* ---------------- Middle Section: Policies ---------------- */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-base md:text-lg underline">Platform Policies</h3>
          <div className="text-gray-400 text-sm flex flex-wrap gap-2">
            <Link to="/terms-policy" className="hover:text-pink-500 transition-colors">Terms</Link>
            ·
            <Link to="/privacy-policy" className="hover:text-pink-500 transition-colors">Privacy</Link>
            · Guidelines
          </div>

          {FEATURE_FLAGS.ENABLE_FOLLOW_US && (
            <div className="mt-2">
              <h3 className="font-semibold text-base md:text-lg underline">Follow Us</h3>
              <p className="text-gray-400 text-sm">Instagram · Twitter · LinkedIn</p>
            </div>
          )}
        </div>

        {/* ---------------- Right Section: Updates ---------------- */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-base md:text-lg underline">Platform Updates</h3>
          <div className="text-gray-400 text-sm">
            <Link to="/platform-updates" className="hover:text-pink-500 transition-colors">
              Updates
            </Link>
          </div>
        </div>
      </div>

      {/* ---------------- Footer Bottom Note ---------------- */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-gray-500 text-xs text-center md:text-left">
        Built with ❤️ for a safer experience. Designed by Mystery Mansion.
      </div>
    </footer>
  );
}

