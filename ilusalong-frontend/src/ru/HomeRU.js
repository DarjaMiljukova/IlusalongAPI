import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Home.css';
import faceImg from "../assets/images/face.jpg";
import massageImg from "../assets/images/massage.jpg";
import hairImg from "../assets/images/hair.jpg";
import nailImg from "../assets/images/nail.jpg";
import nailsImg from "../assets/images/nails.jpg";
import makeupImg from "../assets/images/makeup.jpg";


const Home = () => {
    const navigate = useNavigate();
    const [activeCard, setActiveCard] = useState(null);

    const services = [
        {
            id: 1,
            title: "Уход за лицом",
            description: "Идеальный уход для обновления и восстановления вашей кожи.",
            image: faceImg,
        },
        {
            id: 2,
            title: "Массаж",
            description: "Глубокое расслабление и снятие напряжения для всего тела.",
            image: massageImg,
        },
        {
            id: 3,
            title: "Уход за волосами",
            description: "Здоровые и блестящие волосы с профессиональным уходом.",
            image: hairImg,
        },
        {
            id: 4,
            title: "Маникюр",
            description: "Идеально ухоженные ногти и стильный вид.",
            image: nailImg,
        },
        {
            id: 5,
            title: "Педикюр",
            description: "Ухоженные и шелковистые ноги в любое время года.",
            image: nailsImg,
        },
        {
            id: 6,
            title: "Макияж",
            description: "Профессиональный макияж на любой случай.",
            image: makeupImg,
        },
    ];

    const handleRegister = () => {
        const path = window.location.pathname;
        if (path.startsWith("/ru")) navigate("/ru/login");
        else if (path.startsWith("/eng")) navigate("/eng/login");
        else navigate("/login");
    };

    const openCard = (id) => {
        setActiveCard(id);
        document.body.style.overflow = "hidden";
    };

    const closeCard = () => {
        setActiveCard(null);
        document.body.style.overflow = "auto";
    };

    return (
        <div className="home-container">
            <h1 className="home-title">Добро пожаловать в Celestial Touch!</h1>
            <div className="services-grid">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className={`card ${activeCard === service.id ? "active" : ""}`}
                        onClick={() => openCard(service.id)}
                    >
                        <div className="card-front" style={{ backgroundImage: `url(${service.image})` }}>
                            <h2>{service.title}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {activeCard && (
                <div className="overlay" onClick={closeCard}>
                    <div className="card-detail" onClick={(e) => e.stopPropagation()}>
                        <h2>{services.find((s) => s.id === activeCard).title}</h2>
                        <p>{services.find((s) => s.id === activeCard).description}</p>
                        <button onClick={handleRegister}>Записаться на прием</button>
                        <span className="close-button" onClick={closeCard}>×</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
