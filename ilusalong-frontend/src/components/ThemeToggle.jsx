import { useEffect, useState } from 'react';
import '../theme.css';

export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <button className="theme-toggle theme-icon-only" onClick={() =>
            setTheme(theme === 'light' ? 'dark' : 'light')
        }>
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
}
