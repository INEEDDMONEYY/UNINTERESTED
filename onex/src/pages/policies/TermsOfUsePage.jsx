import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TermsPolicy from '../../components/policy/TermsPolicy';

export default function TermsOfUsePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-500 via-yellow-400 to-black text-white flex flex-col justify-between">
      <div className="max-w-5xl mx-auto py-10 px-6">
        <TermsPolicy />
      </div>

      {/* Return Home Button */}
      <div className="w-full text-center py-6">
        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-2 rounded hover:bg-gray-200 transition duration-200"
        >
          <ArrowLeft size={18} />
          Return Home
        </button>
      </div>
    </div>
  );
}
