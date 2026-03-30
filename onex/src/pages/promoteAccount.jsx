import Navbar from "../components/Navbar.jsx";
import PromotionTiers from "../components/Promotion/PromotionTiers";
import PromotionFAQ from "../components/Promotion/PromotionFAQ";
import PromotionPayment from "../components/Promotion/PromotionPayment";
import Footer from "../components/Footer.jsx";

export default function PromoteAccount() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 via-white to-yellow-50 text-gray-900">
      {/* 🧭 Navbar */}
      <Navbar />

      {/* Main Content Wrapper */}
      <main className="flex-1 w-full">
        {/* 📢 Promotion Header */}
        <section className="text-center px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-4xl lg:text-4xl font-bold text-pink-600 mb-4">
            Promote Your Account
          </h1>

          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            Promoting your account increases your visibility and helps you reach
            more potential clients.
            <span className="block mt-2 italic font-medium text-yellow-600">
              Promoted profiles receive priority placement on the homepage.
            </span>
          </p>
        </section>

        {/* 💳 Promotion Tiers */}
        <section className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 max-w-7xl mx-auto">
          <PromotionTiers />
        </section>

        {/* ❓ FAQ'S */}
        <section className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 max-w-7xl mx-auto">
          <PromotionFAQ />
        </section>

        {/* 💵 Promotion Payment */}
        <section className="px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 lg:pb-16 max-w-7xl mx-auto">
          <PromotionPayment />
        </section>
      </main>

      {/* 🦶 Footer */}
      <Footer />
    </div>
  );
}
