import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './components/LoginRegister';
import AdminPanel from './components/AdminPanel';
import MasterPanel from './components/MasterPanel';
import ClientPanel from './components/ClientPanel';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginRegister />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/master" element={<MasterPanel />} />
                <Route path="/client" element={<ClientPanel />} />
            </Routes>
        </Router>
    );
}

export default App;
