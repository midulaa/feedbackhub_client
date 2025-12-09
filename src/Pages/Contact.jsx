import { motion } from "framer-motion";

const Contact = () => {
  return (
    <div className="pt-28 min-h-screen bg-white flex justify-center items-center px-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-100 p-10 rounded-xl shadow-xl w-96"
      >
        <h1 className="text-2xl font-bold text-purple-700 mb-4 text-center">Contact Us</h1>

        <label className="text-gray-600">Your Message</label>
        <textarea className="w-full p-2 border rounded h-32 mb-3"></textarea>

        <button className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700 transition">
          Send
        </button>
      </motion.div>
    </div>
  );
};

export default Contact;
