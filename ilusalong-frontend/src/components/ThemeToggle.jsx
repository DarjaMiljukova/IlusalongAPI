import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";

const ThemeToggle = () => {
    const { toggleTheme } = useContext(ThemeContext);
    const { language, translations } = useContext(LanguageContext);

    return (
        <button onClick={toggleTheme}>
            {translations[language].toggleTheme}
        </button>
    );
};

export default ThemeToggle;
