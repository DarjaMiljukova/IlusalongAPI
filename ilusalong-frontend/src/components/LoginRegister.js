import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/logres.css'; // Подключение вашего CSS файла

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

                const { token } = response.data; // Получаем токен из ответа

                if (!token) {
                    setMessage('Не удалось получить токен. Проверьте данные логина.');
                    return;
                }

                localStorage.setItem('authToken', token); // Сохраняем токен в localStorage

                const decodedToken = jwtDecode(token); // Декодируем токен
                const { role, id } = decodedToken; // Извлекаем роль и ID пользователя

                console.log(`User ID: ${id}, Role: ${role}`); // Для отладки

                // Перенаправляем пользователя в зависимости от его роли
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
                        setMessage('Неизвестная роль. Обратитесь в поддержку.');
                }
            } catch (error) {
                console.error(error); // Логирование ошибки
                if (error.response) {
                    setMessage(error.response.data.message || 'Ошибка авторизации.');
                } else {
                    setMessage('Ошибка подключения к серверу. Попробуйте снова.');
                }
            }
        } else {
            if (password !== confirmPassword) {
                setMessage('Пароли не совпадают.');
                return;
            }

            try {
                const response = await axios.post('http://localhost:5259/api/User/register', {
                    email,
                    password,
                    phoneNumber,
                });

                setMessage(response.data.message || 'Регистрация успешна.');
                setIsLogin(true); // Переключение на страницу логина после регистрации
            } catch (error) {
                console.error(error); // Логирование ошибки
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
            <div className="title-text">{isLogin ? 'Вход' : 'Регистрация'}</div>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Введите email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="field">
                    <label>Пароль</label>
                    <input
                        type="password"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {!isLogin && (
                    <>
                        <div className="field">
                            <label>Подтвердите пароль</label>
                            <input
                                type="password"
                                placeholder="Введите пароль повторно"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="field">
                            <label>Номер телефона</label>
                            <input
                                type="text"
                                placeholder="Введите номер телефона"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                    </>
                )}
                <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
            </form>
            {message && <p>{message}</p>}
            <p>
                {isLogin ? (
                    <>
                        У вас нет аккаунта?{' '}
                        <span onClick={() => setIsLogin(false)}>Зарегистрируйтесь</span>
                    </>
                ) : (
                    <>
                        Уже есть аккаунт?{' '}
                        <span onClick={() => setIsLogin(true)}>Войдите</span>
                    </>
                )}
            </p>
        </div>
    );
};

export default LoginRegister;
