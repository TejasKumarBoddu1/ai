
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({ 
  theme: 'light',
  toggleTheme: () => {} 
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState('light');

  // Toggle theme function - as requested, we only use light theme
  const toggleTheme = () => {
    // Since we're only using light theme as requested, this is a no-op function
    // but we keep it for interface compatibility
    setTheme('light');
  };

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
