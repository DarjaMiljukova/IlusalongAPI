import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../theme.css';

const LanguageDropdown = () => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();

    const currentPath = window.location.pathname;
    const currentLang = currentPath.startsWith('/ru') ? 'ru' :
        currentPath.startsWith('/eng') ? 'eng' : 'et';

    const flags = {
        et: '🇪🇪',
        ru: '🇷🇺',
        eng: 'EN',
    };

    const handleLangChange = (lang) => {
        setOpen(false);
        navigate(lang === 'et' ? '/' : `/${lang}`);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="language-dropdown" ref={ref}>
            <button className="flag-button" onClick={() => setOpen(!open)}>
                {flags[currentLang]}
            </button>
            {open && (
                <div className="flag-options">
                    {Object.entries(flags).map(([code, flag]) => (
                        code !== currentLang && (
                            <button key={code} className="flag-button" onClick={() => handleLangChange(code)}>
                                {flag}
                            </button>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageDropdown;
