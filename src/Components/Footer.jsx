import { useTheme } from "../contexts/ThemeContext";

const Footer = () => {
  const { isDark } = useTheme();
  
  return (
    <footer className={`${isDark ? 'bg-black text-white' : 'bg-gray-900 text-white'} py-6 `}>
      <div className="text-center">
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-400'}`}>© 2025 FeedbackHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
