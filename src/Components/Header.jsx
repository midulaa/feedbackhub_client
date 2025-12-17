import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <header className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'} shadow-md py-4 px-6 flex items-center justify-between fixed top-0 left-0 w-full z-50`}>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold text-purple-700"
      >
        FeedbackHub
      </motion.h1>

      <div className="flex items-center gap-6">
        <nav className="flex gap-8 font-medium">
          <Link to="/" className="hover:text-purple-600 transition">Home</Link>
          <Link to="/features" className="hover:text-purple-600 transition">Features</Link>
          <Link to="/contact" className="hover:text-purple-600 transition">Contact</Link>
          <Link to="/login" className="hover:text-purple-600 transition">Login</Link>
          <Link to="/register" className="hover:text-purple-600 transition">Register</Link>
        </nav>
        
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};

export default Header;
