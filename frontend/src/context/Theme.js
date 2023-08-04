import { useState, useContext, createContext } from "react";

export const ThemeContext = createContext();

export const useThemeContext = () => {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        theme === "light" ? setTheme("dark") : setTheme("light");
    }

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}

export function Theme() {
    const {toggleTheme} = useContext(ThemeContext);
    return (
        <button onClick={toggleTheme}></button>
    )
}
