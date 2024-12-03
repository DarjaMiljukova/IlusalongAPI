import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/logres.css';

const LoginRegister = () => {
    const [isLogin, setIsLogin] = useState(true); // Переключение между логином и регистрацией
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
                    setMessage('Žetooni hankimine ebaõnnestus. Kontrollige oma sisselogimisandmeid.');
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
                        setMessage('Tundmatu roll. Võtke ühendust toega.');
                }
            } catch (error) {
                console.error(error);
                if (error.response) {
                    setMessage(error.response.data.message || 'Volituse viga.');
                } else {
                    setMessage('Viga serveriga ühenduse loomisel. Proovi uuesti.');
                }
            }
        } else {
            if (password !== confirmPassword) {
                setMessage('Paroolid ei ühti.\n');
                return;
            }

            try {
                const response = await axios.post('http://localhost:5259/api/User/register', {
                    email,
                    password,
                    phoneNumber,
                });

                setMessage(response.data.message || 'Registreerimine õnnestus.');
                setIsLogin(true);
            } catch (error) {
                console.error(error);
                if (error.response) {
                    const errors = error.response.data.errors;
                    if (errors) {
                        const errorMessages = Object.values(errors).flat().join(' ');
                        setMessage(errorMessages);
                    } else {
                        setMessage(error.response.data.message || 'Ошибка регистрации.');
                    }
                } else {
                    setMessage('Ошибка подключения к серверу. Попробуйте снова.');
                }
            }
        }
    };

    return (
        <div className="wrapper">
            <div className="title-text">{isLogin ? 'Logi sisse' : 'Registreerimine'}</div>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Sisestage e-posti aadress"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="field">
                    <label>Parool</label>
                    <input
                        type="password"
                        placeholder="Sisestage oma parool"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {!isLogin && (
                    <>
                        <div className="field">
                            <label>Kinnitage oma parool</label>
                            <input
                                type="password"
                                placeholder="Sisestage oma parool uuesti"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="field">
                            <label>Telefoninumber</label>
                            <input
                                type="text"
                                placeholder="Sisestage oma telefoninumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                    </>
                )}
                <button type="submit">{isLogin ? 'Logi sisse' : 'Registreerimine'}</button>
            </form>
            {message && <p>{message}</p>}
            <p>
                {isLogin ? (
                    <>
                        Kas teil pole kontot?{' '}
                        <span onClick={() => setIsLogin(false)}>Registreeru</span>
                    </>
                ) : (
                    <>
                        Kas teil on juba konto?{' '}
                        <span onClick={() => setIsLogin(true)}>Logi sisse</span>
                    </>
                )}
            </p>
        </div>
    );
};

export default LoginRegister;
