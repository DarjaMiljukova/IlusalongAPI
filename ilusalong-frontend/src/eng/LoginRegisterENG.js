import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/logres.css';

const LoginRegister = () => {
    const [isLogin, setIsLogin] = useState(true); // Switch between login and registration
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            try {
                const response = await axios.post('http://localhost:5259/api/User/login', {
                    email,
                    password,
                });

                const { token } = response.data;

                if (!token) {
                    setMessage('Failed to retrieve token. Check your login credentials.');
                    return;
                }

                localStorage.setItem('authToken', token);

                const decodedToken = jwtDecode(token);
                const { role, id } = decodedToken;

                console.log(`User ID: ${id}, Role: ${role}`);

                switch (role) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'master':
                        navigate('/master');
                        break;
                    case 'client':
                        navigate('/client');
                        break;
                    default:
                        setMessage('Unknown role. Please contact support.');
                }
            } catch (error) {
                console.error(error);
                if (error.response) {
                    setMessage(error.response.data.message || 'Authorization error.');
                } else {
                    setMessage('Connection to server failed. Try again.');
                }
            }
        } else {
            if (password !== confirmPassword) {
                setMessage('Passwords do not match.');
                return;
            }

            const digitsOnly = phoneNumber.replace(/\D/g, '');
            if (digitsOnly.length < 7) {
                setMessage('Enter a valid phone number (at least 7 digits).');
                return;
            }


            try {
                const response = await axios.post('http://localhost:5259/api/User/register', {
                    email,
                    password,
                    phoneNumber,
                });

                setMessage(response.data.message || 'Registration successful.');
                setIsLogin(true);
            } catch (error) {
                console.error(error);
                if (error.response) {
                    const errors = error.response.data.errors;
                    if (errors) {
                        const errorMessages = Object.values(errors).flat().join(' ');
                        setMessage(errorMessages);
                    } else {
                        setMessage(error.response.data.message || 'Registration error.');
                    }
                } else {
                    setMessage('Connection error. Please try again.');
                }
            }
        }
    };

    return (

        <div className="wrapper">
            <div className="title-text">Celestial Touch</div>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="field">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {!isLogin && (
                    <>
                        <div className="field">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="field">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                placeholder="Enter your phone number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                    </>
                )}
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            {message && <p>{message}</p>}
            <p>
                {isLogin ? (
                    <>
                        Don't have an account?{' '}
                        <span onClick={() => setIsLogin(false)}>Register</span>
                    </>
                ) : (
                    <>
                        Already have an account?{' '}
                        <span onClick={() => setIsLogin(true)}>Login</span>
                    </>
                )}
            </p>
        </div>
    );
};

export default LoginRegister;
