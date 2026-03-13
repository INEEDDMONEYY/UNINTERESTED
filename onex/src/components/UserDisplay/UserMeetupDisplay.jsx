import React from "react";
import { DollarSign } from "lucide-react";

export default function UserMeetupDisplay({
  userId,
  incallPrice,
  setIncallPrice,
  outcallPrice,
  setOutcallPrice,
}) {
  return (
    <section className="w-full flex flex-wrap justify-center items-center gap-3 px-4">

      {/* Incall Button */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full 
        bg-gradient-to-r from-pink-500 to-red-500
        text-white text-xs sm:text-sm font-medium
        shadow-md border border-white/20 backdrop-blur-md"
      >
        <DollarSign size={14} />
        <span>Incall:</span>
        <span className="font-semibold">
          {incallPrice ? `$${incallPrice}` : "Not set"}
        </span>
      </div>

      {/* Outcall Button */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full 
        bg-gradient-to-r from-pink-500 to-red-500
        text-white text-xs sm:text-sm font-medium
        shadow-md border border-white/20 backdrop-blur-md"
      >
        <DollarSign size={14} />
        <span>Outcall:</span>
        <span className="font-semibold">
          {outcallPrice ? `$${outcallPrice}` : "Not set"}
        </span>
      </div>

    </section>
  );
}