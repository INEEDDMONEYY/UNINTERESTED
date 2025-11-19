// src/pages/homePage.jsx
import Navbar from '../components/Navbar.jsx';
import Body from '../components/Body.jsx';
import Footer from '../components/Footer.jsx';
import PolicyToast from './/../components/Toasts/HomeToasts/PolicyToast.jsx';
import AgeRequirementToast from './/../components/Toasts/HomeToasts/AgeRequirementToast.jsx';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [showPolicyToast, setShowPolicyToast] = useState(false);
  const [showAgeToast, setShowAgeToast] = useState(false);

  useEffect(() => {
    // ✅ Load user info from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // ✅ Show PolicyToast immediately on page load
    setShowPolicyToast(true);
  }, []);

  const handlePolicyOk = () => {
    // ✅ Dismiss PolicyToast
    setShowPolicyToast(false);

    // ✅ Trigger AgeRequirementToast with a short delay
    setTimeout(() => {
      setShowAgeToast(true);
    }, 500); // 500ms delay for smoother transition
  };

  const handleAgeOk = () => {
    // ✅ Dismiss AgeRequirementToast
    setShowAgeToast(false);
  };

  return (
    <>
      <nav>
        <Navbar user={user} />
      </nav>

      <main>
        <div className="bg-img">
          <Body user={user} />
        </div>
      </main>

      <footer className="static bottom-0">
        <Footer />
      </footer>

      {/* ✅ Sequential toasts with delay */}
      {showPolicyToast && <PolicyToast onOk={handlePolicyOk} />}
      {showAgeToast && <AgeRequirementToast onOk={handleAgeOk} />}
    </>
  );
}
