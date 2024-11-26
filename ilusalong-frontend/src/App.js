import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';
import AdminPage from './pages/AdminPage';
import MasterPage from './pages/MasterPage';
import ClientPage from './pages/ClientPage';
import BookingPage from './pages/BookingPage';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginRegister />} />
                <Route path="/admin" element={<PrivateRoute role="admin"><AdminPage /></PrivateRoute>} />
                <Route path="/master" element={<PrivateRoute role="master"><MasterPage /></PrivateRoute>} />
                <Route path="/client" element={<PrivateRoute role="client"><ClientPage /></PrivateRoute>} />
                <Route path="/client/booking" element={<PrivateRoute role="client"><BookingPage /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
