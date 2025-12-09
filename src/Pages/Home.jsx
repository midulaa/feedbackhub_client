import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="pt-28 px-10 min-h-screen bg-gradient-to-br from-white via-gray-100 to-purple-100">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold text-black mb-4"
      >
        Submit your Feedback & Complaints Easily
      </motion.h1>

      <p className="text-lg text-gray-600 max-w-xl">
        Your voice matters. Share your suggestions and issues anytime.
      </p>

      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mt-10"
      >
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 hover:scale-105 transition">
          Submit Feedback
        </button>
      </motion.div>
    </div>
  );
};

export default Home;
