import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function PromotionFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Can I refund after I promote my account?",
      answer:
        "No, refunds after account promotion are not valid. Once a user promotes their account, it will remain promoted for the duration they paid for.",
    },
    {
      question: "After promoting account, how will I know to renew promotion fee if I wanted to?",
      answer:
        "After promoting an account, a notification will appear confirming the promotion and its duration. One day before expiration, another notification will remind the user that the promotion will expire the following day.",
    },
    {
      question: "Is there a limit on how many times I can promote my account?",
      answer:
        "No, there is no limit. Users can promote their account as many times as they want. However, users must wait until their current promotion expires before promoting again.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-6 py-10 max-w-5xl mx-auto">
      {/* 🖤 Title */}
      <h2 className="text-3xl font-bold text-center text-black mb-8">
        FAQ's are where all questions about the promotion system are answered
      </h2>

      {/* ❓ FAQ List */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-md border border-pink-200 rounded-xl shadow-md p-4 transition"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="text-pink-700 font-semibold text-lg">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp size={20} className="text-pink-500" />
              ) : (
                <ChevronDown size={20} className="text-pink-500" />
              )}
            </button>
            {openIndex === index && (
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
