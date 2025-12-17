import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const Home = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`pt-28 px-10 min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900' : 'bg-gradient-to-br from-white via-gray-100 to-purple-100'}`}>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-4`}
      >
        Submit your Feedback & Complaints Easily
      </motion.h1>

      <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-xl`}>
        Your voice matters. Share your suggestions and issues anytime.
      </p>

      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mt-10"
      >
        <Link to="/register">
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 hover:scale-105 transition">
            Submit Feedback
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;
