import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ЭСТОНСКИЙ
import Home from './components/Home';
import LoginRegister from './components/LoginRegister';
import AdminPanel from './components/AdminPanel';
import MasterPanel from './components/MasterPanel';
import ClientPanel from './components/ClientPanel';
import MasterProfile from './components/MasterProfile';

// РУССКИЙ
import HomeRU from './ru/HomeRU';
import LoginRegisterRU from './ru/LoginRegisterRU';
import AdminPanelRU from './ru/AdminPanelRU';
import MasterPanelRU from './ru/MasterPanelRU';
import ClientPanelRU from './ru/ClientPanelRU';
import MasterProfileRU from './ru/MasterProfileRU';

// АНГЛИЙСКИЙ
import HomeENG from './eng/HomeENG';
import LoginRegisterENG from './eng/LoginRegisterENG';
import AdminPanelENG from './eng/AdminPanelENG';
import MasterPanelENG from './eng/MasterPanelENG';
import ClientPanelENG from './eng/ClientPanelENG';
import MasterProfileENG from './eng/MasterProfileENG';

import ThemeToggle from './components/ThemeToggle';
import LanguageDropdown from './components/LanguageDropdown';

function App() {
    // Установка языка по умолчанию
    useEffect(() => {
        const storedLanguage = localStorage.getItem("language");
        if (!storedLanguage) {
            localStorage.setItem("language", "ee");
        }
    }, []);

    return (
        <Router>
            <ThemeToggle />
            <LanguageDropdown />
            <Routes>
                {/* ЭСТОНСКИЙ */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginRegister />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/master" element={<MasterPanel />} />
                <Route path="/client" element={<ClientPanel />} />
                <Route path="/master/profile" element={<MasterProfile />} />

                {/* РУССКИЙ */}
                <Route path="/ru" element={<HomeRU />} />
                <Route path="/ru/login" element={<LoginRegisterRU />} />
                <Route path="/ru/admin" element={<AdminPanelRU />} />
                <Route path="/ru/master" element={<MasterPanelRU />} />
                <Route path="/ru/client" element={<ClientPanelRU />} />
                <Route path="/ru/master/profile" element={<MasterProfileRU />} />

                {/* АНГЛИЙСКИЙ */}
                <Route path="/eng" element={<HomeENG />} />
                <Route path="/eng/login" element={<LoginRegisterENG />} />
                <Route path="/eng/admin" element={<AdminPanelENG />} />
                <Route path="/eng/master" element={<MasterPanelENG />} />
                <Route path="/eng/client" element={<ClientPanelENG />} />
                <Route path="/eng/master/profile" element={<MasterProfileENG />} />
            </Routes>
        </Router>
    );
}

export default App;
