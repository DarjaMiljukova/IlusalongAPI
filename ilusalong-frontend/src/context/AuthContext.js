import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = (data) => {
        localStorage.setItem("token", data.token);
        setUser(data);
        // Перенаправление в зависимости от роли
        if (data.role === "admin") navigate("/admin");
        if (data.role === "client") navigate("/client");
        if (data.role === "master") navigate("/master");
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
