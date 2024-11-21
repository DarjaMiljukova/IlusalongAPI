import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

const HomePage = () => {
    const { language, translations } = useContext(LanguageContext);

    return (
        <div style={{ padding: "20px" }}>
            <h1>{translations[language].welcome}</h1>
            <ThemeToggle />
            <LanguageSwitcher />
        </div>
    );
};

export default HomePage;
