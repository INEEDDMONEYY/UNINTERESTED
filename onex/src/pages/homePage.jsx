// src/pages/homePage.jsx
import Navbar from '../components/Navbar.jsx';
import Body from '../components/Body.jsx';
import Footer from '../components/Footer.jsx';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Try to load user info from localStorage (set on signin/signup)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <nav>
        {/* ✅ Pass user info to Navbar (optional, for showing username, logout, etc.) */}
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
    </>
  );
}
