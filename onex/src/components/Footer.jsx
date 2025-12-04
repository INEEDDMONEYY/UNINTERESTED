import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import TermsPolicy from '../components/policy/TermsPolicy';
import PrivacyPolicy from '../components/policy/PrivacyPolicy';
import { FEATURE_FLAGS } from '../config/featureFlags';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-6 px-4 w-full border-t border-gray-700">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Section: Logo + Info */}
        <div className="flex items-center gap-4">
          <img src={Logo} alt="Company Logo" className="h-10 w-auto" />
          <div className="text-sm">
            <p className="font-semibold">Mystery Mansion</p>
            <p className="text-gray-300">© {year}. All rights reserved.</p>
          </div>
        </div>

        {/* Right Section: Links */}
        <div className="flex flex-col md:flex-row items-center gap-6 text-sm">
          <div>
            <h3 className="font-semibold underline mb-1">Platform Policies</h3>
            <p className="text-gray-300">
              <Link to="/terms-policy" className="hover:underline">Terms</Link> ·{' '}
              <Link to="/privacy-policy" className="hover:underline">Privacy</Link> · Guidelines
            </p>
          </div>

          {/* Conditionally render Follow Us section */}
          {FEATURE_FLAGS.ENABLE_FOLLOW_US && (
            <div>
              <h3 className="font-semibold underline mb-1">Follow Us</h3>
              <p className="text-gray-300">Instagram · Twitter · LinkedIn</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold underline mb-1">Platform updates</h3>
            <p className="text-gray-300">
              <Link to="/platform-updates" className="hover:underline">Updates</Link>
              {/**<Link to="/" className="hover:underline">Privacy</Link> */}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

