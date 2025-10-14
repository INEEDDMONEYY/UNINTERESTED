import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
import PromotionTiers from "../components/Promotion/PromotionTiers";
import PromotionFAQ from "../components/Promotion/PromotionFAQ";

export default function PromoteAccount() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-pink-700 to-yellow-400 relative overflow-hidden text-white">
      {/* 🎨 Background Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-2xl opacity-40 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-black rounded-full blur-2xl opacity-20 animate-pulse -translate-x-1/2 -translate-y-1/2" />

      {/* 🧭 Navbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/10 backdrop-blur-md shadow-md">
        <img src={Logo} alt="Company Logo" className="h-10" />
        <Link
          to="/home"
          className="flex items-center gap-2 text-yellow-300 hover:text-pink-300 font-medium transition"
        >
          <ArrowLeft size={18} />
          Return Home
        </Link>
      </header>

      {/* 📢 Promotion Header */}
      <section className="text-center px-6 py-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-300 mb-4">Promote your account</h1>
        <p className="text-white text-lg">
          Promoting your account will guarantee more exposure for your services.{" "}
          <span className="italic font-medium text-pink-300">
            Promoted posts have a dedicated spot on the homepage.
          </span>
        </p>
      </section>

      {/* 💳 Promotion Tiers */}
      <section>
        <PromotionTiers />
      </section>

      {/* ❓ FAQ'S */}
      <section>
        <PromotionFAQ />
      </section>
    </div>
  );
}
