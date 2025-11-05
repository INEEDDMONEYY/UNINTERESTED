export default function PromotionTiers() {
  const tiers = [
    {
      label: "24 Hours",
      price: "$4",
      description: "Get instant visibility for 24 hours. Your account will be featured prominently on the homepage.",
    },
    {
      label: "2 Days",
      price: "$6",
      description: "Double the exposure — your account stays promoted for 48 hours with priority placement.",
    },
    {
      label: "4 Days",
      price: "$8",
      description: "Extended reach across the platform for four full days. Ideal for weekend traffic.",
    },
    {
      label: "1 Week",
      price: "$14",
      description: "Maximum exposure for 7 days. Your account remains highlighted all week long.",
    },
  ];

  return (
    <section className="px-6 py-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-white mb-8">Promotion Tiers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-md border border-pink-200 rounded-xl shadow-lg p-6 text-center hover:scale-105 transition"
          >
            <h3 className="text-xl font-semibold text-pink-700 mb-2">{tier.label}</h3>
            <p className="text-gray-600 font-medium mb-2">{tier.price}</p>
            <p className="text-sm text-gray-500">{tier.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
