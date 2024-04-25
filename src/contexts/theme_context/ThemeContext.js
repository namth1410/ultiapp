import PropTypes from "prop-types";
import { createContext, useContext, useMemo, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const themeModeLocalstorage =
    JSON.parse(localStorage.getItem("ulti_config"))?.themeMode || "light";
  const [themeMode, setThemeMode] = useState(themeModeLocalstorage);

  useEffect(() => {
    localStorage.setItem(
      "ulti_config",
      JSON.stringify({
        themeMode: themeMode,
      })
    );
    if (themeMode === "dark") {
      document.querySelector("body").setAttribute("data-theme", "dark");
    } else {
      document.querySelector("body").setAttribute("data-theme", "light");
    }
  }, [themeMode]);

  const contextValue = useMemo(
    () => ({
      themeMode,
      setThemeMode,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [themeMode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.any,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
