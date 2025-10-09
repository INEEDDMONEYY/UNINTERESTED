import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

export default function PostForm() {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  function CheckboxMessage() {
    return `Checking this box acknowledges that each post will cost $10. 
    Please review our post policy before submitting.`;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const paymentChecked = document.getElementById("payment-checkbox").checked;
    if (!paymentChecked) {
      alert("You must agree to the payment terms to post.");
      return;
    }
    setShowPaymentModal(true);
  }

  async function handlePayment(confirm) {
    if (!confirm) {
      setPaymentStatus("failed");
      setShowPaymentModal(false);
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // mock payment delay
      setPaymentStatus("success");
      setShowPaymentModal(false);

      const form = document.getElementById("post-form");
      const formData = new FormData(form);

      // Rename fields to match your backend
      formData.append("title", formData.get("username"));
      formData.append("content", formData.get("description"));
      formData.delete("username");
      formData.delete("description");

      await axios.post(
        `${import.meta.env.VITE_API_URL || ""}/api/posts`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      form.reset();
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      console.error("Payment/post failed:", err);
      setPaymentStatus("failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <form id="post-form" className="flex flex-col w-96" onSubmit={handleSubmit}>
        <input
          type="file"
          name="picture"
          id="post-picture"
          className="border-2 border-black m-2 px-1 text-[1rem] text-black rounded-lg"
        />
        <input
          type="text"
          name="username"
          id="post-username"
          className="border-2 border-black m-2 px-1 text-[1rem] text-black rounded-lg"
          placeholder="Enter Title"
          required
        />
        <textarea
          name="description"
          id="post-description"
          className="border-2 border-black m-2 px-1 text-[1rem] text-black rounded-lg"
          placeholder="Enter text"
          required
        ></textarea>

        {/* Optional city/state for location-based filtering */}
        <input
          type="text"
          name="city"
          placeholder="City (optional)"
          className="border-2 border-black m-2 px-1 text-[1rem] text-black rounded-lg"
        />
        <input
          type="text"
          name="state"
          placeholder="State (optional)"
          className="border-2 border-black m-2 px-1 text-[1rem] text-black rounded-lg"
        />

        <div className="p-1 text-[0.7rem]">
          <input type="checkbox" id="payment-checkbox" required />
          <label htmlFor="payment-checkbox" className="mx-1">
            {CheckboxMessage()}
          </label>
        </div>

        <button type="submit" className="border-2 border-white m-1 px-1 text-black text-[1.3rem] rounded-md">
          Post
        </button>

        <Link to="/home">
          <p className="underline text-black">Return home</p>
        </Link>
      </form>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-2">Mock Payment</h2>
            <p className="text-sm mb-4">Confirm $10 payment to post?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handlePayment(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
              <button
                onClick={() => handlePayment(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {paymentStatus === "success" && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
          Payment Successful! Posting...
        </div>
      )}
      {paymentStatus === "failed" && (
        <div
          className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg cursor-pointer"
          onClick={() => setPaymentStatus(null)}
        >
          Payment Failed or Cancelled. Click to close.
        </div>
      )}
    </div>
  );
}
