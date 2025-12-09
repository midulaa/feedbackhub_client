import { FaHome, FaStar, FaPhone, FaUser } from "react-icons/fa";

export default function Navbar() {
  return (
    <header className="bg-black text-white shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <h1 className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition">
          FeedbackHub
        </h1>

        <nav className="flex gap-6 text-lg">
          <a className="hover:text-purple-400 transition flex items-center gap-2">
            <FaHome /> Home
          </a>

          <a className="hover:text-purple-400 transition flex items-center gap-2">
            <FaStar /> Features
          </a>

          <a className="hover:text-purple-400 transition flex items-center gap-2">
            <FaPhone /> Contact
          </a>

          <a className="hover:text-purple-400 transition flex items-center gap-2">
            <FaUser /> Login
          </a>
        </nav>
      </div>
    </header>
  );
}
