import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import Partners from "/partner.png";
import { FEATURE_FLAGS } from "../config/featureFlags";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-gray-700 py-8 px-6 w-full">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">

        {/* ---------------- Top Logo ---------------- */}
        <div className="flex items-center gap-4">
          <img src={Logo} alt="Company Logo" className="h-16 w-auto" />
          <div className="text-center text-sm">
            <p className="font-bold text-lg">Mystery Mansion</p>
            <p className="text-gray-400 text-sm">© {year}. All rights reserved.</p>
          </div>
        </div>

        {/* ---------------- Middle Policies & Updates Grid ---------------- */}
        <div className="grid grid-cols-2 gap-8 text-center">
          {/* Policies */}
          <div className="flex flex-col gap-2 items-center">
            <h3 className="font-semibold text-base md:text-lg underline">Platform Policies</h3>
            <div className="text-gray-400 text-sm flex flex-wrap gap-2 justify-center">
              <Link to="/terms-policy" className="hover:text-pink-500 transition-colors">Terms</Link>
              ·
              <Link to="/privacy-policy" className="hover:text-pink-500 transition-colors">Privacy</Link>
              · Guidelines
            </div>

            {FEATURE_FLAGS.ENABLE_FOLLOW_US && (
              <div className="mt-2 text-gray-400 text-sm">
                Follow Us: Instagram · Twitter · LinkedIn
              </div>
            )}
          </div>

          {/* Updates */}
          <div className="flex flex-col gap-2 items-center">
            <h3 className="font-semibold text-base md:text-lg underline">Platform Updates</h3>
            <div className="text-gray-400 text-sm">
              <Link to="/platform-updates" className="hover:text-pink-500 transition-colors">
                Updates
              </Link>
            </div>
          </div>
        </div>

        {/* ---------------- Footer Bottom: Powered By ---------------- */}
        <div className="mt-8 flex flex-col items-center gap-2 text-gray-400 text-xs">
          <p>Built with ❤️ for a safer experience. Designed by Mystery Mansion.</p>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <a href="https://fantometechnologies.com" target="_blank" rel="noopener noreferrer">
              <img src={Partners} alt="Partner Logo" className="h-6 w-auto" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
