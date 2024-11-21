import React, { createContext, useState } from "react";

export const LanguageContext = createContext();

const translations = {
    en: { welcome: "Welcome", toggleTheme: "Switch Theme", language: "Switch Language" },
    et: { welcome: "Tere tulemast", toggleTheme: "Vaheta teemat", language: "Vaheta keelt" },
    ru: { welcome: "Добро пожаловать", toggleTheme: "Сменить тему", language: "Сменить язык" },
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("en");

    const switchLanguage = (lang) => {
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, translations, switchLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
