import { FiMessageSquare, FiShield, FiStar, FiUsers, FiBarChart, FiCheckCircle, FiClock, FiSettings } from "react-icons/fi";

const Features = () => {
  const items = [
    {
      icon: <FiMessageSquare size={40} />,
      title: "Feedback Management",
      desc: "Submit and manage feedback with user and admin dashboards. Track all your submissions in one place.",
      features: ["Easy submission form", "Real-time status updates", "History tracking"]
    },
    {
      icon: <FiShield size={40} />,
      title: "Complaint System",
      desc: "Report issues with priority levels and status tracking. Get your concerns addressed quickly.",
      features: ["Priority levels", "Category selection", "Status monitoring"]
    },
    {
      icon: <FiBarChart size={40} />,
      title: "Admin Analytics",
      desc: "Complete admin panel with analytics, user management, and comprehensive reporting.",
      features: ["User statistics", "Complaint analytics", "Performance metrics"]
    },
    {
      icon: <FiUsers size={40} />,
      title: "User Dashboard",
      desc: "Personal dashboard to track your feedback and complaints with detailed insights.",
      features: ["Personal tracking", "Submission history", "Status updates"]
    },
    {
      icon: <FiCheckCircle size={40} />,
      title: "Status Tracking",
      desc: "Real-time status updates for all your submissions. Never lose track of your requests.",
      features: ["Live updates", "Email notifications", "Progress tracking"]
    },
    {
      icon: <FiClock size={40} />,
      title: "Quick Response",
      desc: "Fast response times with automated workflows and priority-based handling.",
      features: ["Auto-routing", "Priority handling", "Quick resolution"]
    },
    {
      icon: <FiSettings size={40} />,
      title: "Admin Tools",
      desc: "Powerful admin tools including todo lists, category management, and user controls.",
      features: ["Todo management", "Category control", "User administration"]
    },
    {
      icon: <FiStar size={40} />,
      title: "Quality Assurance",
      desc: "Ensure high-quality service with comprehensive feedback analysis and reporting.",
      features: ["Quality metrics", "Feedback analysis", "Service improvement"]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-6 py-16">
      
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-14 mt-10">
        Our <span className="text-purple-600">Features</span>
      </h1>

      {/* Properly Centered Grid */}
      <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        
        {items.map((box, i) => (
          <div
            key={i}
            className="
              bg-white 
              shadow-lg
              p-10 
              rounded-2xl 
              border border-gray-200
              hover:shadow-2xl 
              transition-all 
              duration-300
              hover:-translate-y-3
              flex 
              flex-col
              items-center
              text-center
              min-h-[320px]
              group
            "
          >
            <div className="text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">{box.icon}</div>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">{box.title}</h2>

            <p className="text-gray-600 text-base mb-6 leading-relaxed">{box.desc}</p>
            
            <div className="mt-auto">
              <ul className="space-y-2">
                {box.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-purple-600 font-medium flex items-center justify-center">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Features;
