import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios"; // Optional: for sending data to backend

function PostForm() {
  const [picture, setPicture] = useState(null);
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [paymentChecked, setPaymentChecked] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!paymentChecked) {
      alert("You must agree to the payment terms to post.");
      return;
    }

    // Log values
    console.log("Picture:", picture);
    console.log("Username:", username);
    console.log("Description:", description);
    console.log("Payment Checked:", paymentChecked);

    // Prepare form data for backend
    const formData = new FormData();
    formData.append("picture", picture);
    formData.append("username", username);
    formData.append("description", description);
    formData.append("paymentChecked", paymentChecked);

    try {
      await axios.post("http://localhost:5000/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Post submitted successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Something went wrong.");
    }

    // Reset form
    setPicture(null);
    setUsername("");
    setDescription("");
    setPaymentChecked(false);
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <input type="file" onChange={(e) => setPicture(e.target.files[0])} />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <label>
        <input
          type="checkbox"
          checked={paymentChecked}
          onChange={(e) => setPaymentChecked(e.target.checked)}
        />
        Agree to payment terms
      </label>
      <button  class="border border-2 h-auto"type="submit">Submit</button>
    </form>
  );
}

export default PostForm