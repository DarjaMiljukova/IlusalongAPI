import React, { useState, useContext } from "react";
import { register, login } from "../auth";
import { AuthContext } from "../context/AuthContext";
import "./LoginRegister.css";

const LoginRegister = () => {
    const { login: handleLogin } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true); // Переключение между формами
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        phone: "",
    });
    const [error, setError] = useState("");

    // Обработка ввода
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Обработка отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (isLogin) {
                // Логин
                const data = await login({
                    email: formData.email,
                    password: formData.password,
                });
                handleLogin(data);
            } else {
                // Регистрация
                await register({
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                });
                alert("Registration successful! You can now log in.");
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data || "An error occurred.");
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <button onClick={() => setIsLogin(true)} disabled={isLogin}>
                    Login
                </button>
                <button onClick={() => setIsLogin(false)} disabled={!isLogin}>
                    Register
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <>
                        <div className="form-group">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                required={!isLogin}
                            />
                        </div>
                    </>
                )}
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <div className="form-group">
                    <button type="submit">{isLogin ? "Login" : "Register"}</button>
                </div>
            </form>
        </div>
    );
};

export default LoginRegister;
