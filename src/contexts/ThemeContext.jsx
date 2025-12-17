import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDark));
    document.documentElement.style.setProperty('--primary-purple', isDark ? '#8B5CF6' : '#7C3AED');
    document.documentElement.style.setProperty('--secondary-purple', isDark ? '#A78BFA' : '#8B5CF6');
    document.documentElement.style.setProperty('--bg-primary', isDark ? '#1F1B24' : '#FFFFFF');
    document.documentElement.style.setProperty('--bg-secondary', isDark ? '#2D1B3D' : '#F8FAFC');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};