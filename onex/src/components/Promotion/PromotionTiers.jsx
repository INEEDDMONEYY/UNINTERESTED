export default function PromotionTiers() {
  const tiers = [
    {
      label: "1 Week Promotion",
      price: "$12",
      description:
        "Boost your visibility for a full 7 days. Your profile will receive priority placement and increased exposure across the platform.",
    },
    {
      label: "2 Weeks Promotion",
      price: "$24",
      description:
        "Stay promoted for 14 days straight. Ideal for maintaining consistent visibility and attracting more engagement.",
    },
    {
      label: "3 Weeks Promotion",
      price: "$32",
      description:
        "Maximum promotional coverage for 21 days. Perfect for sustained exposure and long-term visibility on the platform.",
    },
    {
      label: "Blue Badge Verification",
      price: "$3 / Monthly",
      description:
        "Verify your profile with a blue badge to build trust and credibility. This subscription renews monthly.",
    },
  ];

  return (
    <section className="px-6 py-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-black mb-8">
        Promotion Tiers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-md border border-pink-200 rounded-xl shadow-lg p-6 text-center hover:scale-105 transition"
          >
            <h3 className="text-xl font-semibold text-pink-700 mb-2">
              {tier.label}
            </h3>
            <p className="text-gray-600 font-medium mb-2">{tier.price}</p>
            <p className="text-sm text-gray-500">{tier.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}