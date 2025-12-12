import { FiMessageSquare, FiShield, FiStar, FiUsers } from "react-icons/fi";

const Features = () => {
  const items = [
    {
      icon: <FiMessageSquare size={32} />,
      title: "Easy Feedback",
      desc: "Submit feedback quickly with a clean and simple interface.",
    },
    {
      icon: <FiShield size={32} />,
      title: "Secure Access",
      desc: "Your data stays protected with proper role-based authentication.",
    },
    {
      icon: <FiStar size={32} />,
      title: "Ratings Feature",
      desc: "Rate services to help others understand service quality.",
    },
    {
      icon: <FiUsers size={32} />,
      title: "User Friendly",
      desc: "Simple navigation and a smooth overall user experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-6 py-16">
      
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-14 mt-10">
        Our <span className="text-purple-600">Features</span>
      </h1>

      {/* Properly Centered Grid */}
      <div className="max-w-6xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        
        {items.map((box, i) => (
          <div
            key={i}
            className="
              bg-white 
              shadow-md
              p-8 
              rounded-xl 
              border border-gray-200
              hover:shadow-xl 
              transition-all 
              duration-300
              hover:-translate-y-2
              flex 
              flex-col
              items-center
              text-center
            "
          >
            <div className="text-purple-600 mb-4">{box.icon}</div>

            <h2 className="text-xl font-semibold mb-2">{box.title}</h2>

            <p className="text-gray-600 text-sm">{box.desc}</p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Features;
