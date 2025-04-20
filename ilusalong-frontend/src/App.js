import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginRegister from './components/LoginRegister';
import AdminPanel from './components/AdminPanel';
import MasterPanel from './components/MasterPanel';
import ClientPanel from './components/ClientPanel';

import LoginRegisterRU from './ru/LoginRegisterRU';
import AdminPanelRU from './ru/AdminPanelRU';
import MasterPanelRU from './ru/MasterPanelRU';
import ClientPanelRU from './ru/ClientPanelRU';

import LoginRegisterENG from './eng/LoginRegisterENG';
import AdminPanelENG from './eng/AdminPanelENG';
import MasterPanelENG from './eng/MasterPanelENG';
import ClientPanelENG from './eng/ClientPanelENG';

import ThemeToggle from './components/ThemeToggle';
import LanguageDropdown from './components/LanguageDropdown';

function App() {
    return (
        <Router>
            <ThemeToggle />
            <LanguageDropdown />
            <Routes>
                {/* ЭСТОНСКИЙ (по умолчанию) */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginRegister />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/master" element={<MasterPanel />} />
                <Route path="/client" element={<ClientPanel />} />

                {/* РУССКИЙ */}
                <Route path="/ru" element={<Navigate to="/ru/login" />} />
                <Route path="/ru/login" element={<LoginRegisterRU />} />
                <Route path="/ru/admin" element={<AdminPanelRU />} />
                <Route path="/ru/master" element={<MasterPanelRU />} />
                <Route path="/ru/client" element={<ClientPanelRU />} />

                {/* АНГЛИЙСКИЙ */}
                <Route path="/eng" element={<Navigate to="/eng/login" />} />
                <Route path="/eng/login" element={<LoginRegisterENG />} />
                <Route path="/eng/admin" element={<AdminPanelENG />} />
                <Route path="/eng/master" element={<MasterPanelENG />} />
                <Route path="/eng/client" element={<ClientPanelENG />} />
            </Routes>
        </Router>
    );
}

export default App;
