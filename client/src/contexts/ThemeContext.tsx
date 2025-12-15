import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "earthen" | "nocturnal" | "botanical";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

interface ThemeContextState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeContextState = {
  theme: "earthen",
  setTheme: () => null,
};

const ThemeContext = createContext<ThemeContextState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "earthen",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem("azay-theme") as Theme;
    return storedTheme || defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old theme attributes
    root.removeAttribute("data-theme");
    
    // Set new theme
    root.setAttribute("data-theme", theme);
    
    // Handle dark mode class for Nocturnal theme
    if (theme === "nocturnal") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Save to local storage
    localStorage.setItem("azay-theme", theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
