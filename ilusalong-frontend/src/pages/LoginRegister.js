import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './logres.css';

function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();

    const handleToggle = () => setIsLogin(!isLogin);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin
            ? 'http://localhost:5259/api/User/login'
            : 'http://localhost:5259/api/User/register';

        const body = isLogin
            ? { email, password }
            : { PhoneNumber: phoneNumber, email, password };

        console.log('Request body:', body);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Authentication failed');
            }

            const data = await response.json();
            if (isLogin) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role || 'Client');
                navigate(`/${data.role || 'client'}`);
            } else {
                alert('Registration successful! Please log in.');
                setIsLogin(true);
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <div className="wrapper">
            <div className="title-text">{isLogin ? 'Login' : 'Register'}</div>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="field">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {!isLogin && (
                    <div className="field">
                        <label>Phone Number:</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                )}
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
                <p>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <span onClick={handleToggle} style={{ color: 'blue', cursor: 'pointer' }}>
                        {isLogin ? 'Register' : 'Login'}
                    </span>
                </p>
            </form>
        </div>
    );
}

export default LoginRegister;
