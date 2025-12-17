import { motion } from "framer-motion";
import { useState } from "react";
import { feedbackAPI } from "../services/api";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await feedbackAPI.submitFeedback(formData);
      setSuccess(true);
      setFormData({ name: "", phone: "", message: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-white flex justify-center items-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-100/80 backdrop-blur-sm p-8 w-full max-w-md rounded-2xl shadow-lg border border-gray-200"
      >
        <h1 className="text-3xl font-semibold text-center mb-6">
          <span className="text-black">Get in</span>{" "}
          <span className="text-purple-700">Touch</span>
        </h1>

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            Message sent successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 font-medium mb-1">Your Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-purple-500 transition"
            placeholder="Enter your name"
            required
          />

          <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-purple-500 transition"
            placeholder="Enter your phone number"
            required
          />

          <label className="block text-gray-700 font-medium mb-1">Message</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg h-28 resize-none 
            focus:outline-none focus:ring-2 focus:ring-purple-500 transition mb-5"
            placeholder="Write your message..."
            required
          ></textarea>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className="w-full py-3 bg-purple-700 text-white font-semibold rounded-lg 
            shadow-md hover:bg-purple-800 transition-all disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;

