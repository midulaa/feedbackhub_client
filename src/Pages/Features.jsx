import { motion } from "framer-motion";
import { FiShield, FiMessageSquare, FiStar, FiBell } from "react-icons/fi";

const Features = () => {
  const features = [
    {
      icon: <FiMessageSquare size={50} />,
      title: "Smart Feedback System",
      desc: "Collect structured feedback with a beautiful UI & instant responsiveness.",
    },
    {
      icon: <FiShield size={50} />,
      title: "Role Based Security",
      desc: "Admin & User dashboards separated with encrypted authentication.",
    },
    {
      icon: <FiStar size={50} />,
      title: "Ratings & Reviews",
      desc: "Interactive rating widgets & sentiment-based auto categorization.",
    },
    {
      icon: <FiBell size={50} />,
      title: "Real-time Alerts",
      desc: "Admins get real-time updates for new feedback & complaints.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 px-6 py-24 text-white">
      
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-center mb-16"
      >
        Our <span className="text-purple-400">Features</span>
      </motion.h1>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            whileHover={{ scale: 1.08, rotate: 1 }}
            className="
              bg-white/10 
              backdrop-blur-xl 
              rounded-3xl 
              p-8 
              shadow-xl 
              border border-white/10 
              hover:border-purple-400 
              transition-all 
              cursor-pointer
              relative
              overflow-hidden
            "
          >
            {/* Glowing animated border */}
            <motion.div
              className="absolute inset-0 border-2 border-purple-500 rounded-3xl opacity-0"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.4 }}
              transition={{ duration: 0.4 }}
            ></motion.div>

            {/* Icon animation */}
            <motion.div
              initial={{ scale: 0.7 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-purple-400 flex justify-center mb-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]"
            >
              {f.icon}
            </motion.div>

            <h2 className="text-2xl font-bold text-center mb-2">{f.title}</h2>
            <p className="text-gray-300 text-center leading-relaxed">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Features;
