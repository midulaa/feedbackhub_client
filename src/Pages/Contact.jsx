import { motion } from "framer-motion";

const Contact = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-white flex justify-center items-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-100/80 backdrop-blur-sm p-8 w-full max-w-md rounded-2xl shadow-lg border border-gray-200"
      >
        {/* Title */}
        <h1 className="text-3xl font-semibold text-center mb-6">
          <span className="text-black">Get in</span>{" "}
          <span className="text-purple-700">Touch</span>
        </h1>

        {/* Name */}
        <label className="block text-gray-700 font-medium mb-1">Your Name</label>
        <input
          type="text"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
          focus:ring-2 focus:ring-purple-500 transition"
          placeholder="Enter your name"
        />

        {/* Phone Number */}
        <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
        <input
          type="tel"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
          focus:ring-2 focus:ring-purple-500 transition"
          placeholder="Enter your phone number"
        />

        {/* Message */}
        <label className="block text-gray-700 font-medium mb-1">Message</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg h-28 resize-none 
          focus:outline-none focus:ring-2 focus:ring-purple-500 transition mb-5"
          placeholder="Write your message..."
        ></textarea>

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className="w-full py-3 bg-purple-700 text-white font-semibold rounded-lg 
          shadow-md hover:bg-purple-800 transition-all"
        >
          Send Message
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Contact;

