import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginRegister from "./components/LoginRegister";
import AdminPage from "./components/AdminPage";
import ClientPage from "./components/ClientPage";
import MasterPage from "./components/MasterPage";

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LoginRegister />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/client" element={<ClientPage />} />
                    <Route path="/master" element={<MasterPage />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
