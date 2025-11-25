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
    <section className="w-full flex flex-col md:flex-row justify-center items-center gap-6 px-4">
      {/* Incall Section */}
      <div className="w-[130px] h-[130px] flex flex-col justify-center items-center text-center rounded-xl shadow-lg p-4 bg-gradient-to-br from-pink-500 to-red-500 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-white/20">
        <h3 className="flex flex-col items-center text-base font-semibold text-white mb-2">
          <DollarSign size={18} className="text-white mb-1" />
          Incall
        </h3>
        <p className="text-white text-sm font-medium">
          {incallPrice ? `$${incallPrice}` : "Not set"}
        </p>
      </div>

      {/* Outcall Section */}
      <div className="w-[130px] h-[130px] flex flex-col justify-center items-center text-center rounded-xl shadow-lg p-4 bg-gradient-to-br from-pink-500 to-red-500 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 border border-white/20">
        <h3 className="flex flex-col items-center text-base font-semibold text-white mb-2">
          <DollarSign size={18} className="text-white mb-1" />
          Outcall
        </h3>
        <p className="text-white text-sm font-medium">
          {outcallPrice ? `$${outcallPrice}` : "Not set"}
        </p>
      </div>
    </section>
  );
}
